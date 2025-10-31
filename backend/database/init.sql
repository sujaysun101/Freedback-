-- Database initialization script
-- This runs automatically when the Docker container starts

-- Create the database if it doesn't exist (handled by Docker)
-- The schema will be applied via migrations in production

-- For development, we can source the schema directly
-- In production, use Alembic migrations

\c freedback_dev;

-- The full schema will be applied via schema.sql or Alembic migrations
