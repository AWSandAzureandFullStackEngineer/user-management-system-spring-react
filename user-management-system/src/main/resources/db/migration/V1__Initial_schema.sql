-- src/main/resources/db/migration/V1__Initial_schema.sql
-- Description: Creates the initial database schema for the User Management System.


CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- Create the main app_users table (using 'app_users' as table name to match entity)
CREATE TABLE app_users (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Use UUID as primary key, auto-generated
                       username VARCHAR(100) NOT NULL UNIQUE,        -- Username, required and unique
                       email VARCHAR(150) NOT NULL UNIQUE,           -- Email, required and unique
                       password VARCHAR(255) NOT NULL,               -- Stores the HASHED password, required
                       first_name VARCHAR(50),                       -- Optional first name
                       last_name VARCHAR(50),                        -- Optional last name
                       phone_number VARCHAR(20),                     -- Added phone_number column (adjust length if needed)
                       is_active BOOLEAN NOT NULL DEFAULT TRUE,      -- Active status, defaults to true
                       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Creation timestamp
                       updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP  -- Last update timestamp
);

-- Add indexes for frequently queried columns (like username and email)
CREATE INDEX idx_users_username ON app_users(username);
CREATE INDEX idx_users_email ON app_users(email);

-- Create the table to store user roles (many-to-many relationship implied by @ElementCollection)
CREATE TABLE user_roles (
                            user_id UUID NOT NULL,                      -- Foreign key referencing the users table
                            role VARCHAR(50) NOT NULL,                  -- Role name (e.g., 'ADMIN', 'USER')
    -- Define composite primary key
                            PRIMARY KEY (user_id, role),
    -- Define foreign key constraint
                            CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE -- Cascade delete if user is deleted
);

-- Optional: Add index on user_id in user_roles for faster lookups
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);

