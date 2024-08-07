#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER admin WITH PASSWORD 'thepassword';
    CREATE DATABASE admindb;
    GRANT ALL PRIVILEGES ON DATABASE admindb TO admin;
EOSQL