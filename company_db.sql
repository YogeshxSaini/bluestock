-- Company Registration & Verification Database Schema
-- PostgreSQL 15+

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS company_profile CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    firebase_uid VARCHAR(128) UNIQUE,
    signup_type CHAR(1) DEFAULT 'e' CHECK (signup_type IN ('e', 's', 'g')), -- e=email, s=sms, g=google
    gender CHAR(1) CHECK (gender IN ('m', 'f', 'o')), -- m=male, f=female, o=other
    mobile_no VARCHAR(20) NOT NULL UNIQUE,
    is_mobile_verified BOOLEAN DEFAULT FALSE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create company_profile table
CREATE TABLE company_profile (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    website TEXT,
    logo_url TEXT,
    banner_url TEXT,
    industry TEXT NOT NULL,
    founded_date DATE,
    description TEXT,
    social_links JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_mobile ON users(mobile_no);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_company_owner ON company_profile(owner_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_profile_updated_at
    BEFORE UPDATE ON company_profile
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert seed data for demo
-- Password: DemoPass123! (hashed with bcrypt, rounds=10)
INSERT INTO users (email, password, full_name, signup_type, gender, mobile_no, is_mobile_verified, is_email_verified)
VALUES 
    ('demo@example.com', '$2b$10$cKTOXrk6mUWxRA7VaRA11uqKyKihUduVl2F5pSVF3d3sgh7j3OYOa', 'Demo User', 'e', 'm', '+12025551234', true, true),
    ('jane.doe@example.com', '$2b$10$cKTOXrk6mUWxRA7VaRA11uqKyKihUduVl2F5pSVF3d3sgh7j3OYOa', 'Jane Doe', 'e', 'f', '+12025551235', true, true),
    ('john.smith@example.com', '$2b$10$cKTOXrk6mUWxRA7VaRA11uqKyKihUduVl2F5pSVF3d3sgh7j3OYOa', 'John Smith', 'e', 'm', '+12025551236', false, true);

-- Insert seed company profiles
INSERT INTO company_profile (
    owner_id, 
    company_name, 
    address, 
    city, 
    state, 
    country, 
    postal_code, 
    website, 
    industry, 
    founded_date, 
    description,
    social_links
)
VALUES 
    (
        1, 
        'Demo Tech Corp', 
        '123 Innovation Drive', 
        'San Francisco', 
        'California', 
        'USA', 
        '94102', 
        'https://demotechcorp.com', 
        'Technology', 
        '2020-01-15', 
        'A leading technology company focused on innovative solutions.',
        '{"linkedin": "https://linkedin.com/company/demotechcorp", "twitter": "https://twitter.com/demotechcorp"}'
    ),
    (
        2, 
        'Jane Design Studio', 
        '456 Creative Avenue', 
        'New York', 
        'New York', 
        'USA', 
        '10001', 
        'https://janedesign.studio', 
        'Design', 
        '2019-05-20', 
        'Premium design services for modern businesses.',
        '{"instagram": "https://instagram.com/janedesignstudio", "behance": "https://behance.net/janedesignstudio"}'
    );

-- Grant permissions (adjust username as needed)
-- GRANT ALL PRIVILEGES ON DATABASE company_db TO your_db_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_db_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_db_user;
