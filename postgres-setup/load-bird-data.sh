#!/bin/bash

echo "Starting bird data loading process..."

echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h localhost -p 5432 -U kicau_user -d kicau_db; do
    echo "PostgreSQL is not ready yet..."
    sleep 2
done

echo "PostgreSQL is ready. Starting data fetch..."

python3 /usr/local/bin/bird-data-fetcher.py

echo "Bird data loading completed!"
