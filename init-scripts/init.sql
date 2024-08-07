-- init-scripts/init.sql
\set db_user `echo "$DB_USER"`
\set db_password `echo "$DB_PASSWORD"`
\set db_name `echo "$DB_NAME"`

CREATE USER :db_user WITH PASSWORD :'db_password';
CREATE DATABASE :db_name;
GRANT ALL PRIVILEGES ON DATABASE :db_name TO :db_user;
ALTER ROLE :db_user WITH SUPERUSER CREATEROLE CREATEDB BYPASSRLS;

\connect :db_name

GRANT CREATE ON SCHEMA public TO :db_user;
-- ALTER ROLE :db_user WITH SUPERUSER CREATEROLE CREATEDB BYPASSRLS;