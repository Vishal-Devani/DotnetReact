-- =============================================
-- Database: Project1
-- Create Table: People
-- =============================================

USE Project1;
GO

-- Drop table if exists (for clean setup)
IF OBJECT_ID('People', 'U') IS NOT NULL
    DROP TABLE People;
GO

-- Create People table
CREATE TABLE People
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(30) NOT NULL,
    LastName NVARCHAR(30) NOT NULL
);
GO

-- =============================================
-- Stored Procedure: sp_CreatePerson
-- Description: Inserts a new person and returns the created person
-- =============================================

IF OBJECT_ID('sp_CreatePerson', 'P') IS NOT NULL
    DROP PROCEDURE sp_CreatePerson;
GO

CREATE PROCEDURE sp_CreatePerson
    @FirstName NVARCHAR(30),
    @LastName NVARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @NewId INT;
    
    INSERT INTO People (FirstName, LastName)
    VALUES (@FirstName, @LastName);
    
    SET @NewId = SCOPE_IDENTITY();
    
    SELECT Id, FirstName, LastName
    FROM People
    WHERE Id = @NewId;
END
GO

-- =============================================
-- Stored Procedure: sp_GetAllPeople
-- Description: Returns all people
-- =============================================

IF OBJECT_ID('sp_GetAllPeople', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetAllPeople;
GO

CREATE PROCEDURE sp_GetAllPeople
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT Id, FirstName, LastName
    FROM People
    ORDER BY Id;
END
GO

-- =============================================
-- Stored Procedure: sp_GetPersonById
-- Description: Returns a person by ID
-- =============================================

IF OBJECT_ID('sp_GetPersonById', 'P') IS NOT NULL
    DROP PROCEDURE sp_GetPersonById;
GO

CREATE PROCEDURE sp_GetPersonById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT Id, FirstName, LastName
    FROM People
    WHERE Id = @Id;
END
GO

-- =============================================
-- Stored Procedure: sp_UpdatePerson
-- Description: Updates a person by ID
-- =============================================

IF OBJECT_ID('sp_UpdatePerson', 'P') IS NOT NULL
    DROP PROCEDURE sp_UpdatePerson;
GO

CREATE PROCEDURE sp_UpdatePerson
    @Id INT,
    @FirstName NVARCHAR(30),
    @LastName NVARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE People
    SET FirstName = @FirstName,
        LastName = @LastName
    WHERE Id = @Id;
    
    -- Return affected rows count
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

-- =============================================
-- Stored Procedure: sp_DeletePerson
-- Description: Deletes a person by ID
-- =============================================

IF OBJECT_ID('sp_DeletePerson', 'P') IS NOT NULL
    DROP PROCEDURE sp_DeletePerson;
GO

CREATE PROCEDURE sp_DeletePerson
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM People
    WHERE Id = @Id;
    
    -- Return affected rows count
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

PRINT 'Table and Stored Procedures created successfully!';
GO
