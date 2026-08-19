-- Initialize isolated database schemas for Aarambha
CREATE SCHEMA IF NOT EXISTS tours;
CREATE SCHEMA IF NOT EXISTS fleet;
CREATE SCHEMA IF NOT EXISTS shared;

-- Set search path defaults
ALTER DATABASE aarambha_db SET search_path TO "$user", public, shared, tours, fleet;
