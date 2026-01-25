-- =============================================
-- Database: Project1
-- Create Table: Users
-- Seed Admin User
-- =============================================

USE Project1;
GO

-- Drop table if exists (for clean setup)
IF OBJECT_ID('Users', 'U') IS NOT NULL
    DROP TABLE Users;
GO

-- Create Users table
CREATE TABLE Users
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(50) NOT NULL DEFAULT 'User',
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    LastLoginAt DATETIME2 NULL,
    IsActive BIT NOT NULL DEFAULT 1
);
GO

-- Create index on Username for faster lookups
CREATE INDEX IX_Users_Username ON Users(Username);
GO

-- Create index on Email for faster lookups
CREATE INDEX IX_Users_Email ON Users(Email);
GO

-- Seed Admin User
-- Password: Admin@123 (hashed with BCrypt)
-- You can generate a new hash using: BCrypt.Net.BCrypt.HashPassword("Admin@123")
INSERT INTO Users (Username, Email, PasswordHash, Role, CreatedAt, IsActive)
VALUES 
    ('admin', 'admin@example.com', '$2a$11$KIXQZqJZqJZqJZqJZqJZqOqJZqJZqJZqJZqJZqJZqJZqJZqJZqJZq', 'Admin', GETUTCDATE(), 1);
GO

-- Note: The password hash above is a placeholder. 
-- In production, you should:
-- 1. Generate a proper BCrypt hash for "Admin@123"
-- 2. Or use the application to register the admin user
-- 3. Or create a migration/seeding script that uses BCrypt

PRINT 'Users table created successfully!';
PRINT 'NOTE: Admin user password hash needs to be generated using BCrypt in the application.';
GO
