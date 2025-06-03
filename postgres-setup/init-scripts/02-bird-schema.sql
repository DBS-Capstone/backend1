-- Create birds table in the existing kicau_db

CREATE TABLE IF NOT EXISTS birds (
    id SERIAL PRIMARY KEY,
    species_code VARCHAR(20) UNIQUE NOT NULL,
    ebird_url VARCHAR(500),
    common_name VARCHAR(255),
    scientific_name VARCHAR(255),
    family VARCHAR(255),
    order_name VARCHAR(255),
    conservation_status VARCHAR(100),
    habitat TEXT,
    description TEXT,
    behavior TEXT,
    diet TEXT,
    nesting TEXT,
    migration_pattern TEXT,
    vocalization TEXT,
    size_length_cm DECIMAL(6,2),
    size_wingspan_cm DECIMAL(6,2),
    size_weight_g DECIMAL(8,2),
    finding_tips TEXT,
    cool_facts JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_birds_species_code ON birds(species_code);
CREATE INDEX IF NOT EXISTS idx_birds_common_name ON birds(common_name);
CREATE INDEX IF NOT EXISTS idx_birds_scientific_name ON birds(scientific_name);
CREATE INDEX IF NOT EXISTS idx_birds_family ON birds(family);
CREATE INDEX IF NOT EXISTS idx_birds_order ON birds(order_name);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$ language 'plpgsql';

-- Create trigger for updating timestamp
DROP TRIGGER IF EXISTS update_birds_updated_at ON birds;
CREATE TRIGGER update_birds_updated_at BEFORE UPDATE ON birds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust according to your user setup)
GRANT SELECT, INSERT, UPDATE, DELETE ON birds TO kicau_user;
GRANT USAGE, SELECT ON SEQUENCE birds_id_seq TO kicau_user;
