-- Create database schema for GKBJ Regency Church Management System

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Members table
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    gender VARCHAR(20),
    email VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(100) DEFAULT 'Member',
    address TEXT,
    join_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location VARCHAR(255),
    event_type VARCHAR(100) DEFAULT 'Service',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
    attended_date DATE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, member_id, attended_date)
);

-- Registration requests table
CREATE TABLE IF NOT EXISTS registration_requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    age INTEGER,
    gender VARCHAR(20),
    address TEXT,
    ministry_interest VARCHAR(255),
    hear_about VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    processed_by INTEGER REFERENCES users(id)
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,
    quote_text TEXT NOT NULL,
    author VARCHAR(255),
    scripture_reference VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_role ON members(role);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attended_date);
CREATE INDEX IF NOT EXISTS idx_attendance_member ON attendance(member_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_registration_status ON registration_requests(status);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, name, role) 
VALUES ('admin@gkbjregency.org', '$2b$10$rQZ8kHWKtGKVQxvxHxHxHOuYxYxYxYxYxYxYxYxYxYxYxYxYxYxYx', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample quotes
INSERT INTO quotes (quote_text, author, scripture_reference) VALUES
('For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.', 'Bible', 'Jeremiah 29:11'),
('Trust in the Lord with all your heart and lean not on your own understanding.', 'Bible', 'Proverbs 3:5'),
('Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.', 'Bible', 'Joshua 1:9'),
('The Lord is my shepherd; I shall not want.', 'Bible', 'Psalm 23:1'),
('I can do all things through Christ who strengthens me.', 'Bible', 'Philippians 4:13')
ON CONFLICT DO NOTHING;
