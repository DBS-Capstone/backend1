import pandas as pd
import psycopg2
import json
import logging
import sys
from pathlib import Path

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class BirdCSVLoader:
    def __init__(self, db_config):
        self.db_config = db_config

    def connect_db(self):
        """Connect to PostgreSQL database"""
        try:
            conn = psycopg2.connect(**self.db_config)
            return conn
        except Exception as e:
            logger.error(f"Database connection error: {e}")
            return None

    def load_csv_data(self, csv_file_path):
        """Load bird data from CSV file"""
        try:
            # read csv
            df = pd.read_csv(csv_file_path)
            logger.info(f"Loaded {len(df)} records from CSV file")

            df.columns = df.columns.str.strip()

            logger.info(f"CSV columns: {list(df.columns)}")

            return df
        except Exception as e:
            logger.error(f"Error loading CSV file: {e}")
            return None

    def process_csv_row(self, row):
        """Process a single CSV row and convert to database format"""
        try:
            def safe_get(value):
                if pd.isna(value) or value == '' or str(value).lower() == 'nan':
                    return None
                return str(value).strip() if isinstance(value, str) else value

            cool_facts = safe_get(row.get('cool_facts'))
            if cool_facts:
                try:
                    if cool_facts.startswith('[') or cool_facts.startswith('{'):
                        cool_facts = json.loads(cool_facts)
                    else:
                        cool_facts = [cool_facts]
                except json.JSONDecodeError:
                    cool_facts = [cool_facts]
            else:
                cool_facts = None

            bird_data = {
                'species_code': safe_get(row.get('species_code')),
                'ebird_url': safe_get(row.get('ebird_url')),
                'common_name': safe_get(row.get('common_name')),
                'scientific_name': safe_get(row.get('scientific_name')),
                'family': safe_get(row.get('family')),
                'order_name': safe_get(row.get('order_name')),
                'conservation_status': safe_get(row.get('conservation_status')),
                'habitat': safe_get(row.get('habitat')),
                'description': safe_get(row.get('description')),
                'behavior': safe_get(row.get('behavior')),
                'diet': safe_get(row.get('diet')),
                'nesting': safe_get(row.get('nesting')),
                'migration_pattern': safe_get(row.get('migration_pattern')),
                'vocalization': safe_get(row.get('vocalization')),
                'size_length_cm': self.safe_float(row.get('size_length_cm')),
                'size_wingspan_cm': self.safe_float(row.get('size_wingspan_cm')),
                'size_weight_g': self.safe_float(row.get('size_weight_g')),
                'finding_tips': safe_get(row.get('finding_tips')),
                'cool_facts': cool_facts
            }

            return bird_data

        except Exception as e:
            logger.error(f"Error processing row: {e}")
            logger.error(f"Row data: {dict(row)}")
            return None

    def safe_float(self, value):
        """Safely convert value to float, return None if invalid"""
        if pd.isna(value) or value == '' or str(value).lower() == 'nan':
            return None
        try:
            return float(value)
        except (ValueError, TypeError):
            return None

    def save_bird_data(self, bird_data):
        """Save bird data to database"""
        conn = self.connect_db()
        if not conn:
            return False

        try:
            cur = conn.cursor()

            insert_bird_sql = """
                INSERT INTO birds (
                    species_code, ebird_url, common_name, scientific_name, family, order_name,
                    conservation_status, habitat, description, behavior, diet, nesting, migration_pattern,
                    vocalization, size_length_cm, size_wingspan_cm, size_weight_g, finding_tips, cool_facts
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (species_code) DO UPDATE SET
                    ebird_url = EXCLUDED.ebird_url,
                    common_name = EXCLUDED.common_name,
                    scientific_name = EXCLUDED.scientific_name,
                    family = EXCLUDED.family,
                    order_name = EXCLUDED.order_name,
                    conservation_status = EXCLUDED.conservation_status,
                    habitat = EXCLUDED.habitat,
                    description = EXCLUDED.description,
                    behavior = EXCLUDED.behavior,
                    diet = EXCLUDED.diet,
                    nesting = EXCLUDED.nesting,
                    migration_pattern = EXCLUDED.migration_pattern,
                    vocalization = EXCLUDED.vocalization,
                    size_length_cm = EXCLUDED.size_length_cm,
                    size_wingspan_cm = EXCLUDED.size_wingspan_cm,
                    size_weight_g = EXCLUDED.size_weight_g,
                    finding_tips = EXCLUDED.finding_tips,
                    cool_facts = EXCLUDED.cool_facts,
                    updated_at = CURRENT_TIMESTAMP
                RETURNING id;
            """

            bird_values = (
                bird_data['species_code'],        # 1
                bird_data['ebird_url'],          # 2
                bird_data['common_name'],        # 3
                bird_data['scientific_name'],    # 4
                bird_data['family'],             # 5
                bird_data['order_name'],         # 6
                bird_data['conservation_status'], # 7
                bird_data['habitat'],            # 8
                bird_data['description'],        # 9
                bird_data['behavior'],           # 10
                bird_data['diet'],               # 11
                bird_data['nesting'],            # 12
                bird_data['migration_pattern'],  # 13
                bird_data['vocalization'],       # 14
                bird_data['size_length_cm'],     # 15
                bird_data['size_wingspan_cm'],   # 16
                bird_data['size_weight_g'],      # 17
                bird_data['finding_tips'],       # 18
                json.dumps(bird_data['cool_facts']) if bird_data['cool_facts'] else None  # 19
            )

            cur.execute(insert_bird_sql, bird_values)
            result = cur.fetchone()

            if result:
                bird_id = result[0]
                logger.info(f"Successfully saved data for {bird_data['species_code']} with ID {bird_id}")
            else:
                logger.info(f"Successfully saved data for {bird_data['species_code']}")

            conn.commit()
            return True

        except Exception as e:
            logger.error(f"Error saving bird data for {bird_data.get('species_code', 'unknown')}: {e}")
            logger.error(f"SQL values count: {len(bird_values) if 'bird_values' in locals() else 'N/A'}")
            conn.rollback()
            return False
        finally:
            cur.close()
            conn.close()

    def load_all_birds_from_csv(self, csv_file_path):
        """Load all bird data from CSV file to database"""
        df = self.load_csv_data(csv_file_path)
        if df is None:
            return False

        success_count = 0
        total_count = len(df)

        for index, row in df.iterrows():
            logger.info(f"Processing row {index + 1}/{total_count}: {row.get('species_code', 'unknown')}")

            bird_data = self.process_csv_row(row)
            if bird_data and bird_data['species_code']:
                if self.save_bird_data(bird_data):
                    success_count += 1
                else:
                    logger.warning(f"Failed to save data for {bird_data['species_code']}")
            else:
                logger.warning(f"Failed to process row {index + 1}")

        logger.info(f"Completed processing. Success: {success_count}/{total_count}")
        return success_count == total_count

def main():
    script_dir = Path(__file__).parent
    csv_file_path = script_dir / "bird_data_full.csv"

    if not csv_file_path.exists():
        print(f"Error: CSV file '{csv_file_path}' not found")
        sys.exit(1)

    db_config = {
        'host': 'localhost',
        'database': 'kicau_db',
        'user': 'kicau_user',
        'password': 'kicau_password',
        'port': 5432
    }

    loader = BirdCSVLoader(db_config)
    success = loader.load_all_birds_from_csv(csv_file_path)

    if success:
        print("All bird data loaded successfully!")
        sys.exit(0)
    else:
        print("Some errors occurred during loading. Check logs for details.")
        sys.exit(1)

if __name__ == "__main__":
    main()
