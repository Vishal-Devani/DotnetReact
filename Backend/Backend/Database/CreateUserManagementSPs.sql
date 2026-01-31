-- User Management Stored Procedures

-- 1. Get All Users
CREATE OR ALTER PROCEDURE sp_User_GetAll
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        Id,
        Username,
        Email,
        Role,
        CreatedAt,
        LastLoginAt,
        IsActive
    FROM Users
    ORDER BY CreatedAt DESC;
END
GO

-- 2. Update User Status (Activate/Deactivate)
CREATE OR ALTER PROCEDURE sp_User_UpdateStatus
    @UserId INT,
    @IsActive BIT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Users
    SET IsActive = @IsActive
    WHERE Id = @UserId;
END
GO
