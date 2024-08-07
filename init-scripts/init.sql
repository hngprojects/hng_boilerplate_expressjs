-- init-scripts/init.sql
\set db_user `echo "$DB_USER"`
\set db_password `echo "$DB_PASSWORD"`
\set db_name `echo "$DB_NAME"`

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Connect to the database
\c :db_name

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON SCHEMA public TO :db_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO :db_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO :db_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO :db_user;
