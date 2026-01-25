-- Refactoring Auth to use Stored Procedures

-- 1. Register User SP
CREATE OR ALTER PROCEDURE sp_User_Register
    @Username NVARCHAR(100),
    @Email NVARCHAR(255),
    @PasswordHash NVARCHAR(MAX),
    @Role NVARCHAR(50),
    @CreatedAt DATETIME2,
    @IsActive BIT
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if username exists
    IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username)
    BEGIN
        SELECT -1 AS Id; -- Error code for duplicate username
        RETURN;
    END

    -- Check if email exists
    IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email)
    BEGIN
        SELECT -2 AS Id; -- Error code for duplicate email
        RETURN;
    END

    -- Insert new user
    INSERT INTO Users (Username, Email, PasswordHash, Role, CreatedAt, IsActive)
    VALUES (@Username, @Email, @PasswordHash, @Role, @CreatedAt, @IsActive);

    -- Return the new ID
    SELECT CAST(SCOPE_IDENTITY() AS INT) AS Id;
END
GO

-- 2. Get User by Username or Email SP (Login)
CREATE OR ALTER PROCEDURE sp_User_GetByUsernameOrEmail
    @UsernameOrEmail NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1 
        Id,
        Username,
        Email,
        PasswordHash,
        Role,
        CreatedAt,
        LastLoginAt,
        IsActive
    FROM Users
    WHERE Username = @UsernameOrEmail OR Email = @UsernameOrEmail;
END
GO

-- 3. Update Last Login SP
CREATE OR ALTER PROCEDURE sp_User_UpdateLastLogin
    @Id INT,
    @LastLoginAt DATETIME2
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Users
    SET LastLoginAt = @LastLoginAt
    WHERE Id = @Id;
END
GO
