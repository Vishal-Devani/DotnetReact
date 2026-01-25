-- =============================================
-- Database: Project1
-- Create Tables: ApiLogs and ErrorLogs
-- =============================================

USE Project1;
GO

-- =============================================
-- Table: ApiLogs
-- Description: Stores all API request/response logs
-- =============================================

IF OBJECT_ID('ApiLogs', 'U') IS NOT NULL
    DROP TABLE ApiLogs;
GO

CREATE TABLE ApiLogs
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    HttpMethod NVARCHAR(10) NOT NULL,
    Path NVARCHAR(500) NOT NULL,
    QueryString NVARCHAR(1000) NULL,
    IpAddress NVARCHAR(50) NULL,
    UserId INT NULL,
    Username NVARCHAR(100) NULL,
    RequestTime DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ResponseTime DATETIME2 NULL,
    StatusCode INT NULL,
    ResponseTimeMs BIGINT NULL,
    RequestBody NVARCHAR(MAX) NULL,
    ResponseBody NVARCHAR(MAX) NULL,
    UserAgent NVARCHAR(1000) NULL,
    Controller NVARCHAR(100) NULL,
    Action NVARCHAR(100) NULL
);
GO

-- Create indexes for better query performance
IF OBJECT_ID('ApiLogs', 'U') IS NOT NULL
BEGIN
    CREATE INDEX IX_ApiLogs_RequestTime ON ApiLogs(RequestTime DESC);
    CREATE INDEX IX_ApiLogs_UserId ON ApiLogs(UserId);
    CREATE INDEX IX_ApiLogs_Path ON ApiLogs(Path);
    CREATE INDEX IX_ApiLogs_StatusCode ON ApiLogs(StatusCode);
    CREATE INDEX IX_ApiLogs_HttpMethod ON ApiLogs(HttpMethod);
    PRINT 'ApiLogs table and indexes created successfully!';
END
GO

-- =============================================
-- Table: ErrorLogs
-- Description: Stores all error/exception logs
-- =============================================

IF OBJECT_ID('ErrorLogs', 'U') IS NOT NULL
    DROP TABLE ErrorLogs;
GO

CREATE TABLE ErrorLogs
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    HttpMethod NVARCHAR(10) NULL,
    Path NVARCHAR(500) NULL,
    QueryString NVARCHAR(1000) NULL,
    IpAddress NVARCHAR(50) NULL,
    UserId INT NULL,
    Username NVARCHAR(100) NULL,
    ErrorTime DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ErrorType NVARCHAR(500) NOT NULL,
    ErrorMessage NVARCHAR(2000) NOT NULL,
    StackTrace NVARCHAR(MAX) NULL,
    Controller NVARCHAR(100) NULL,
    Action NVARCHAR(100) NULL,
    StatusCode INT NULL,
    RequestBody NVARCHAR(MAX) NULL,
    UserAgent NVARCHAR(1000) NULL,
    InnerException NVARCHAR(1000) NULL
);
GO

-- Create indexes for better query performance
IF OBJECT_ID('ErrorLogs', 'U') IS NOT NULL
BEGIN
    CREATE INDEX IX_ErrorLogs_ErrorTime ON ErrorLogs(ErrorTime DESC);
    CREATE INDEX IX_ErrorLogs_UserId ON ErrorLogs(UserId);
    CREATE INDEX IX_ErrorLogs_ErrorType ON ErrorLogs(ErrorType);
    CREATE INDEX IX_ErrorLogs_Path ON ErrorLogs(Path);
    PRINT 'ErrorLogs table and indexes created successfully!';
END
GO

PRINT 'All tables and indexes created successfully!';
GO
