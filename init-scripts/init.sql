-- init-scripts/init.sql
\set db_user `echo "$DB_USER"`
\set db_password `echo "$DB_PASSWORD"`
\set db_name `echo "$DB_NAME"`

CREATE USER :db_user WITH PASSWORD :'db_password';
CREATE DATABASE :db_name;
GRANT ALL PRIVILEGES ON DATABASE :db_name TO :db_user;

\connect :db_name

GRANT USAGE, CREATE ON SCHEMA public TO :db_user;
GRANT USAGE ON SCHEMA public TO :db_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO :db_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO :db_user;