-- Smart AI Resume Analyzer - PostgreSQL Schema
-- Optional: run only if not using JPA ddl-auto=update (e.g. for manual DB setup on Render)

-- Create database (run as superuser if needed):
-- CREATE DATABASE resume_analyzer_db;

\connect resume_analyzer_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS analysis (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_description TEXT NOT NULL,
    resume_text TEXT NOT NULL,
    match_percentage DOUBLE PRECISION NOT NULL,
    resume_score DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_analysis_user_id ON analysis(user_id);
