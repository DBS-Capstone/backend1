# postgres-setup/Dockerfile
FROM postgres:13

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN python3 -m venv /opt/bird-env

RUN /opt/bird-env/bin/pip install --upgrade pip && \
    /opt/bird-env/bin/pip install pandas psycopg2-binary lxml

RUN echo '#!/bin/bash\n/opt/bird-env/bin/python "$@"' > /usr/local/bin/python-venv && \
    chmod +x /usr/local/bin/python-venv

COPY init-scripts/ /docker-entrypoint-initdb.d/
COPY bird_data_full.csv /usr/local/bin/
COPY bird-data-fetcher.py /usr/local/bin/
COPY load-bird-data.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/bird-data-fetcher.py
RUN chmod +x /usr/local/bin/load-bird-data.sh
RUN chmod +x /docker-entrypoint-initdb.d/*

ENV PATH="/opt/bird-env/bin:$PATH"

EXPOSE 5432
