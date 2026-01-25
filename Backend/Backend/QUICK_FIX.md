# Quick Fix Guide - Project Won't Run

## Most Common Issues

### 1. Missing Database Tables

**Error:** `Invalid object name 'ApiLogs'` or `Invalid object name 'ErrorLogs'`

**Fix:**
1. Open SQL Server Management Studio
2. Connect to your database (Project1)
3. Run these SQL scripts in order:
   - `Database/CreateTableAndStoredProcedures.sql` (if not already run)
   - `Database/CreateUsersTableAndSeedAdmin.sql` (if not already run)
   - `Database/CreateLogsTables.sql` (NEW - must run this!)

### 2. Build/Restore Issues

**Fix:**
```bash
cd Backend/Backend

# Clean everything
dotnet clean

# Delete obj and bin folders manually if needed

# Restore packages
dotnet restore

# Build
dotnet build

# Run
dotnet run
```

### 3. Missing Configuration

**Check `appsettings.json` has:**
```json
{
  "ConnectionStrings": {
    "Default": "Server=VISHAL-PC\\SQLEXPRESS01;Database=Project1;Integrated Security=true;TrustServerCertificate=true;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyThatShouldBeAtLeast32CharactersLongForHS256Algorithm!",
    "Issuer": "Backend",
    "Audience": "Backend"
  }
}
```

### 4. Middleware Order Issue

**Current order in Program.cs (should be):**
1. CORS
2. Authentication
3. Authorization
4. API Logging Middleware
5. Exception Handler Middleware
6. Controllers

### 5. Service Registration

**Verify in Program.cs:**
```csharp
builder.Services.AddScoped<IPersonService, PersonService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ILoggingService, LoggingService>(); // Must be registered!
```

## Step-by-Step Fix

1. **Run SQL Scripts:**
   - Execute `CreateLogsTables.sql` in SQL Server
   - Verify tables exist: `SELECT * FROM ApiLogs` (should return empty, not error)

2. **Clean and Rebuild:**
   ```bash
   cd Backend/Backend
   dotnet clean
   dotnet restore
   dotnet build
   ```

3. **Check for Errors:**
   - Look for red errors in the build output
   - Common: missing using statements, missing services

4. **Run the Project:**
   ```bash
   dotnet run
   ```

5. **Test:**
   - Open browser to `http://localhost:3000` (or your configured port)
   - Should see Swagger UI
   - Try a simple API call

## If Still Not Working

**Check these files exist:**
- ✅ `Backend/Models/ApiLog.cs`
- ✅ `Backend/Models/ErrorLog.cs`
- ✅ `Backend/Services/ILoggingService.cs`
- ✅ `Backend/Services/LoggingService.cs`
- ✅ `Backend/Middleware/ApiLoggingMiddleware.cs`
- ✅ `Backend/Middleware/GlobalExceptionHandlerMiddleware.cs`
- ✅ `Backend/Controllers/LogsController.cs`

**Check Program.cs has:**
- ✅ `builder.Services.AddScoped<ILoggingService, LoggingService>();`
- ✅ `app.UseMiddleware<Backend.Middleware.ApiLoggingMiddleware>();`
- ✅ `app.UseMiddleware<Backend.Middleware.GlobalExceptionHandlerMiddleware>();`

**Check AppDbContext.cs has:**
- ✅ `public DbSet<ApiLog> ApiLogs { get; set; }`
- ✅ `public DbSet<ErrorLog> ErrorLogs { get; set; }`

## Common Error Messages

### "Unable to resolve service for type 'ILoggingService'"
**Fix:** Add `builder.Services.AddScoped<ILoggingService, LoggingService>();` in Program.cs

### "Invalid object name 'ApiLogs'"
**Fix:** Run `CreateLogsTables.sql` script

### "JWT Key not configured"
**Fix:** Add JWT section to `appsettings.json`

### "Connection string 'Default' not found"
**Fix:** Add ConnectionStrings section to `appsettings.json`

---

**After fixing, the project should run successfully!**
