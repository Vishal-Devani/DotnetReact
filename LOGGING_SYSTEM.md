# API Logging & Error Logging System

## Overview

A comprehensive logging system that captures all API requests and errors, storing them in database tables for analysis, debugging, and security monitoring.

## Features

### ✅ API Request Logging
- Captures all HTTP requests (method, path, query string)
- Records request/response bodies (truncated to 5000 chars)
- Tracks response times
- Captures user information (if authenticated)
- Records IP address and User-Agent
- Stores controller and action names
- Tracks HTTP status codes

### ✅ Error Logging
- Captures all exceptions and errors
- Records error type, message, and stack trace
- Stores request context (path, method, body)
- Tracks user information
- Records inner exceptions
- Captures HTTP status codes

## Database Tables

### ApiLogs Table
Stores all API request/response information:
- Request details (method, path, query, body)
- Response details (status code, body, time)
- User information (ID, username)
- Performance metrics (response time in ms)
- Client information (IP, User-Agent)
- Controller/Action names

### ErrorLogs Table
Stores all error/exception information:
- Error details (type, message, stack trace)
- Request context (method, path, body)
- User information
- Inner exceptions
- HTTP status codes

## Setup Instructions

### 1. Create Database Tables

Run the SQL script to create the tables:

```sql
-- Execute: Backend/Backend/Database/CreateLogsTables.sql
```

Or create a migration:

```bash
cd Backend/Backend
dotnet ef migrations add AddLogsTables
dotnet ef database update
```

### 2. Verify Middleware Registration

The middleware is automatically registered in `Program.cs`:
- `ApiLoggingMiddleware` - Logs all API requests
- `GlobalExceptionHandlerMiddleware` - Logs all errors

### 3. Service Registration

The `LoggingService` is registered in `Program.cs`:
```csharp
builder.Services.AddScoped<ILoggingService, LoggingService>();
```

## API Endpoints (Admin Only)

### Get API Logs
```
GET /api/logs/api-logs
Query Parameters:
  - page (default: 1)
  - pageSize (default: 50, max: 100)
  - filter (optional search term)
```

### Get API Log by ID
```
GET /api/logs/api-logs/{id}
```

### Get Error Logs
```
GET /api/logs/error-logs
Query Parameters:
  - page (default: 1)
  - pageSize (default: 50, max: 100)
  - filter (optional search term)
```

### Get Error Log by ID
```
GET /api/logs/error-logs/{id}
```

**Note:** All endpoints require Admin role authentication.

## What Gets Logged

### API Requests
- ✅ All HTTP methods (GET, POST, PUT, DELETE, etc.)
- ✅ Request path and query string
- ✅ Request body (JSON, truncated to 5000 chars)
- ✅ Response body (truncated to 5000 chars)
- ✅ HTTP status code
- ✅ Response time in milliseconds
- ✅ User ID and username (if authenticated)
- ✅ IP address
- ✅ User-Agent
- ✅ Controller and Action names

### Errors
- ✅ Exception type
- ✅ Error message
- ✅ Stack trace
- ✅ Inner exception details
- ✅ Request path and method
- ✅ Request body (if available)
- ✅ User information
- ✅ HTTP status code
- ✅ Controller and Action names

## Excluded Paths

The following paths are NOT logged (to reduce noise):
- `/swagger` - Swagger UI
- `/_framework` - Framework files
- `/css`, `/js`, `/lib` - Static files
- `/` - Root path
- `/favicon.ico` - Favicon

## Performance Considerations

1. **Asynchronous Logging**: Logs are written asynchronously to avoid blocking requests
2. **String Truncation**: Request/response bodies are truncated to prevent database bloat
3. **Indexes**: Database indexes are created on frequently queried columns
4. **Non-blocking**: Logging failures don't affect the main request flow

## Security Features

1. **Admin Only Access**: Log viewing endpoints require Admin role
2. **Sensitive Data**: Consider masking sensitive data in request/response bodies
3. **IP Tracking**: Client IP addresses are captured for security monitoring
4. **User Tracking**: Authenticated user information is logged

## Usage Examples

### View Recent API Logs
```bash
GET /api/logs/api-logs?page=1&pageSize=20
Authorization: Bearer <admin_token>
```

### Search API Logs
```bash
GET /api/logs/api-logs?filter=/api/people
Authorization: Bearer <admin_token>
```

### View Recent Errors
```bash
GET /api/logs/error-logs?page=1&pageSize=20
Authorization: Bearer <admin_token>
```

### Get Specific Error Details
```bash
GET /api/logs/error-logs/123
Authorization: Bearer <admin_token>
```

## Database Maintenance

### Cleanup Old Logs

To prevent database growth, consider implementing cleanup:

```sql
-- Delete API logs older than 90 days
DELETE FROM ApiLogs 
WHERE RequestTime < DATEADD(DAY, -90, GETUTCDATE());

-- Delete error logs older than 180 days
DELETE FROM ErrorLogs 
WHERE ErrorTime < DATEADD(DAY, -180, GETUTCDATE());
```

### Index Maintenance

The tables have indexes on:
- RequestTime/ErrorTime (for date range queries)
- UserId (for user-specific queries)
- Path (for endpoint filtering)
- StatusCode (for error filtering)
- HttpMethod (for method filtering)

## Monitoring & Alerts

Consider implementing:
1. **Error Rate Monitoring**: Alert on high error rates
2. **Slow Request Monitoring**: Alert on requests > 5 seconds
3. **Failed Authentication Tracking**: Monitor failed login attempts
4. **Unusual Activity Detection**: Track suspicious patterns

## Frontend Integration (Future)

Consider creating:
1. Admin dashboard to view logs
2. Real-time error monitoring
3. Log filtering and search UI
4. Export functionality
5. Charts and analytics

## Troubleshooting

### Logs Not Appearing
1. Check database connection
2. Verify tables exist
3. Check middleware order in Program.cs
4. Verify LoggingService is registered

### Performance Issues
1. Check database indexes
2. Consider archiving old logs
3. Review string truncation limits
4. Monitor database size

### Missing User Information
- Ensure authentication middleware runs before logging middleware
- Verify JWT token is valid
- Check user claims in token

---

**Status:** ✅ **Logging System Fully Implemented**

All API requests and errors are now automatically logged to the database!
