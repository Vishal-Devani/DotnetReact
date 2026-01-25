# Troubleshooting Guide

## Common Issues and Solutions

### 1. Project Won't Build or Run

#### Issue: Network/Connection Errors
**Error:** `NU1301: Failed to retrieve information... No connection could be made`

**Solution:**
- Check your internet connection
- If behind a proxy, configure NuGet proxy settings
- Try: `dotnet restore --no-cache`
- Check if NuGet.org is accessible

#### Issue: File Access Denied
**Error:** `Access to the path '...obj\...tmp' is denied`

**Solution:**
- Close any processes using the files (IDE, other dotnet processes)
- Delete the `obj` and `bin` folders
- Run: `dotnet clean`
- Try building again

### 2. Database Connection Issues

#### Issue: Connection String Not Found
**Error:** `Connection string 'Default' not found`

**Solution:**
- Check `appsettings.json` has the connection string
- Or set up User Secrets (see USER_SECRETS_SETUP.md)
- Verify SQL Server is running
- Check database name exists

#### Issue: Cannot Connect to Database
**Error:** `A network-related or instance-specific error occurred`

**Solution:**
- Verify SQL Server is running
- Check server name is correct
- Verify Windows Authentication or SQL Authentication credentials
- Check firewall settings
- Ensure SQL Server allows remote connections

### 3. JWT Authentication Issues

#### Issue: JWT Key Not Configured
**Error:** `JWT Key not configured`

**Solution:**
- Add JWT configuration to `appsettings.json`:
```json
{
  "Jwt": {
    "Key": "YourSuperSecretKeyThatShouldBeAtLeast32CharactersLongForHS256Algorithm!",
    "Issuer": "Backend",
    "Audience": "Backend"
  }
}
```

#### Issue: Invalid Token
**Error:** `Invalid token` or `Unauthorized`

**Solution:**
- Check token is being sent in Authorization header: `Bearer <token>`
- Verify token hasn't expired (default: 1 hour)
- Check JWT Key matches between token generation and validation
- Ensure user has correct role

### 4. Middleware Order Issues

#### Issue: User information not captured in logs
**Solution:**
- Ensure `UseAuthentication()` and `UseAuthorization()` are called BEFORE logging middleware
- Check middleware order in `Program.cs`

#### Issue: Exceptions not being logged
**Solution:**
- Ensure `GlobalExceptionHandlerMiddleware` is registered
- Check middleware order (exception handler should wrap other middleware)

### 5. Database Table Issues

#### Issue: Tables Don't Exist
**Error:** `Invalid object name 'ApiLogs'` or `Invalid object name 'ErrorLogs'`

**Solution:**
- Run the SQL scripts to create tables:
  - `CreateLogsTables.sql`
  - `CreateUsersTableAndSeedAdmin.sql`
  - `CreateTableAndStoredProcedures.sql`
- Or use Entity Framework migrations:
  ```bash
  dotnet ef migrations add InitialCreate
  dotnet ef database update
  ```

#### Issue: NVARCHAR Size Error
**Error:** `The size (5000) given to the parameter exceeds the maximum allowed (4000)`

**Solution:**
- Use `NVARCHAR(MAX)` instead of `NVARCHAR(5000)`
- The SQL script has been updated to use `NVARCHAR(MAX)`

### 6. Logging Issues

#### Issue: Logs Not Appearing in Database
**Solution:**
- Verify `ApiLogs` and `ErrorLogs` tables exist
- Check database connection is working
- Verify `LoggingService` is registered in `Program.cs`
- Check application logs for errors
- Ensure middleware is registered in correct order

#### Issue: Performance Issues with Logging
**Solution:**
- Logging is asynchronous, but if still slow:
  - Check database indexes exist
  - Consider archiving old logs
  - Review string truncation limits

### 7. CORS Issues

#### Issue: CORS Policy Error
**Error:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solution:**
- Check `AllowedOrigins` in `appsettings.json`
- Verify frontend URL matches exactly (including port)
- Ensure `AllowCredentials()` is set if using cookies/auth headers
- Check CORS middleware is registered before other middleware

### 8. Package Restore Issues

#### Issue: Packages Not Restoring
**Solution:**
```bash
# Clear NuGet cache
dotnet nuget locals all --clear

# Restore packages
dotnet restore

# Clean and rebuild
dotnet clean
dotnet build
```

### 9. Runtime Errors

#### Issue: Service Not Registered
**Error:** `Unable to resolve service for type '...'`

**Solution:**
- Check service is registered in `Program.cs`:
  ```csharp
  builder.Services.AddScoped<IService, Service>();
  ```
- Verify service interface and implementation exist
- Check namespace is correct

#### Issue: Null Reference Exception
**Solution:**
- Check all required services are injected
- Verify database connection is working
- Check configuration values are set
- Review null checks in code

### 10. Migration Issues

#### Issue: Migration Errors
**Error:** `The migration '...' has already been applied`

**Solution:**
```bash
# Check migration status
dotnet ef migrations list

# Remove last migration if needed
dotnet ef migrations remove

# Or update database
dotnet ef database update
```

## Quick Diagnostic Steps

1. **Check Build:**
   ```bash
   dotnet clean
   dotnet restore
   dotnet build
   ```

2. **Check Database:**
   - Verify SQL Server is running
   - Test connection string
   - Check tables exist

3. **Check Configuration:**
   - Verify `appsettings.json` has all required settings
   - Check JWT Key is set
   - Verify connection string

4. **Check Logs:**
   - Review application console output
   - Check database for error logs
   - Review API logs for failed requests

5. **Check Middleware Order:**
   - CORS first
   - Authentication/Authorization
   - Exception Handler
   - API Logging
   - Controllers

## Still Having Issues?

1. Check the application console for detailed error messages
2. Review the database error logs: `SELECT * FROM ErrorLogs ORDER BY ErrorTime DESC`
3. Check API logs: `SELECT * FROM ApiLogs ORDER BY RequestTime DESC`
4. Verify all SQL scripts have been executed
5. Ensure all NuGet packages are installed
6. Check .NET version matches (should be 9.0)

---

**Note:** If you're still experiencing issues, provide:
- Exact error message
- Stack trace (if available)
- Steps to reproduce
- Environment details (OS, .NET version, SQL Server version)
