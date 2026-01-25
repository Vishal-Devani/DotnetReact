# Authentication & Authorization Setup Guide

## Overview

The application now includes a complete authentication and authorization system with:
- JWT-based authentication
- Role-based access control (Admin/User)
- Secure password hashing (BCrypt)
- Protected routes
- Admin and User dashboards

## Backend Setup

### 1. Database Migration

Run the SQL script to create the Users table:

```sql
-- Execute: Backend/Backend/Database/CreateUsersTableAndSeedAdmin.sql
```

Or create the table manually and run migrations:

```bash
cd Backend/Backend
dotnet ef migrations add AddUsersTable
dotnet ef database update
```

### 2. Create Admin User

You have two options:

#### Option A: Register via API (Recommended)
1. Start the backend server
2. Use Swagger UI or Postman to call:
   - `POST /api/auth/register`
   - Body: `{ "username": "admin", "email": "admin@example.com", "password": "Admin@123", "confirmPassword": "Admin@123" }`
3. Manually update the role in the database:
   ```sql
   UPDATE Users SET Role = 'Admin' WHERE Username = 'admin'
   ```

#### Option B: Use BCrypt to generate password hash
1. Create a simple console app or use online BCrypt generator
2. Generate hash for your admin password
3. Insert directly into database

### 3. JWT Configuration

The JWT settings are in `appsettings.json`:

```json
{
  "Jwt": {
    "Key": "YourSuperSecretKeyThatShouldBeAtLeast32CharactersLongForHS256Algorithm!",
    "Issuer": "Backend",
    "Audience": "Backend"
  }
}
```

**⚠️ IMPORTANT:** Change the JWT Key in production! Use a strong, random key (at least 32 characters).

### 4. Install Packages

The following packages have been added:
- `Microsoft.AspNetCore.Authentication.JwtBearer` (v9.0.0)
- `BCrypt.Net-Next` (v4.0.3)

Run:
```bash
dotnet restore
```

## Frontend Setup

### 1. Environment Variables

Ensure your `.env` file has:
```
VITE_BASE_API_URL=http://localhost:3000/api
```

### 2. Install Dependencies

All required packages should already be installed. If not:
```bash
cd client
npm install
```

## Usage

### Login Flow

1. **User Registration:**
   - Navigate to `/login`
   - Click "Register" or "Don't have an account? Register"
   - Fill in username, email, password, and confirm password
   - Submit to create a new user account (default role: "User")

2. **User Login:**
   - Navigate to `/login`
   - Enter username/email and password
   - Submit to authenticate

3. **Dashboard Access:**
   - After login, users are redirected to `/dashboard`
   - Admin users see the Admin Dashboard
   - Regular users see the User Dashboard

### Protected Routes

- `/dashboard` - Requires authentication (User or Admin)
- `/admin` - Requires Admin role
- `/person` - Requires authentication (User or Admin)

### API Endpoints

#### Authentication Endpoints

- `POST /api/auth/login` - Login
  - Body: `{ "usernameOrEmail": "string", "password": "string" }`
  - Returns: JWT token and user info

- `POST /api/auth/register` - Register new user
  - Body: `{ "username": "string", "email": "string", "password": "string", "confirmPassword": "string" }`
  - Returns: JWT token and user info

- `GET /api/auth/me` - Get current user (requires authentication)
  - Headers: `Authorization: Bearer <token>`
  - Returns: Current user info

- `POST /api/auth/validate` - Validate token (requires authentication)
  - Headers: `Authorization: Bearer <token>`

#### Protected Endpoints

All `/api/people/*` endpoints now require authentication:
- Headers: `Authorization: Bearer <token>`

## Security Features

### Backend
- ✅ JWT token-based authentication
- ✅ BCrypt password hashing
- ✅ Role-based authorization
- ✅ Secure token validation
- ✅ Password strength requirements (min 6 characters)
- ✅ Email validation
- ✅ Username/Email uniqueness checks

### Frontend
- ✅ Token storage in localStorage
- ✅ Automatic token injection in API requests
- ✅ Protected route components
- ✅ Role-based UI rendering
- ✅ Automatic logout on token expiration
- ✅ Secure logout (clears tokens)

## Default Admin Credentials

**⚠️ IMPORTANT:** Create your admin user after setup!

To create an admin user:
1. Register a user via the API or frontend
2. Update the role in the database:
   ```sql
   UPDATE Users SET Role = 'Admin' WHERE Username = 'your_username'
   ```

## Testing

### Test Admin Access
1. Create/Login as admin user
2. Navigate to `/admin` - Should show Admin Dashboard
3. Navigate to `/person` - Should have full CRUD access

### Test User Access
1. Create/Login as regular user
2. Navigate to `/dashboard` - Should show User Dashboard
3. Navigate to `/admin` - Should redirect to `/dashboard`
4. Navigate to `/person` - Should have view access (if implemented)

## Troubleshooting

### "JWT Key not configured" Error
- Ensure `appsettings.json` has the `Jwt:Key` setting
- Key must be at least 32 characters for HS256 algorithm

### "Invalid token" Error
- Token may have expired (default: 1 hour)
- Logout and login again
- Check token is being sent in Authorization header

### "Unauthorized" Error
- User may not have the required role
- Check user's role in database
- Verify JWT token contains correct role claim

### Database Connection Issues
- Ensure SQL Server is running
- Check connection string in `appsettings.json` or User Secrets
- Verify Users table exists

## Next Steps

1. **Add Password Reset:** Implement forgot password functionality
2. **Add Email Verification:** Send verification emails on registration
3. **Add Refresh Tokens:** Implement token refresh mechanism
4. **Add 2FA:** Two-factor authentication for enhanced security
5. **Add Session Management:** Track active sessions
6. **Add Audit Logging:** Log all authentication events

---

**Security Note:** Always use HTTPS in production and store JWT keys securely (e.g., Azure Key Vault, AWS Secrets Manager).
