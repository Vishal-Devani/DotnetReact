# Separate Admin & User Authentication Guide

## Overview

The application now supports **separate admin and user authentication** with the following features:
- ✅ Separate login pages for admin and user
- ✅ Both can be logged in simultaneously in the same browser
- ✅ Separate logout functionality
- ✅ Admin routes under `/admin/*`
- ✅ User routes under `/dashboard`
- ✅ Separate token storage

## Route Structure

### User Routes
- `/login` - User login/register page
- `/dashboard` - User dashboard
- `/about` - About page (public)
- `/` - Home page (public)

### Admin Routes (All under `/admin/*`)
- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin dashboard
- `/admin/person` - Person management (admin only)

## Authentication Flow

### User Login
1. Navigate to `/login`
2. Enter username/email and password
3. System validates user has "User" role
4. Token stored as `userToken` in localStorage
5. Redirected to `/dashboard`

### Admin Login
1. Navigate to `/admin/login`
2. Enter username/email and password
3. System validates user has "Admin" role
4. Token stored as `adminToken` in localStorage
5. Redirected to `/admin/dashboard`

### Simultaneous Sessions
- Both admin and user can be logged in at the same time
- Each session uses a separate token
- Navbar shows both sessions when both are active
- Separate logout buttons for each session

## Token Storage

### User Session
- Token: `localStorage.getItem('userToken')`
- User Data: `localStorage.getItem('user')`

### Admin Session
- Token: `localStorage.getItem('adminToken')`
- User Data: `localStorage.getItem('adminUser')`

## API Token Selection

The API client automatically selects the correct token:
- Admin routes (`/admin/*`) → Uses `adminToken`
- User routes → Uses `userToken`
- Based on current URL path

## Components

### AuthContext
- `isUserAuthenticated()` - Check if user is logged in
- `isAdminAuthenticated()` - Check if admin is logged in
- `login(username, password, role)` - Login with role validation
- `logoutAdmin()` - Logout admin only
- `logoutUser()` - Logout user only
- `logout(type)` - Logout specific or all sessions

### ProtectedRoute
- `requireAdmin={true}` - Requires admin authentication
- `requireUser={true}` - Requires user authentication
- Default: Allows either admin or user

### Navbar
- Shows user session info (blue badge)
- Shows admin session info (purple badge with shield icon)
- Separate logout buttons for each session
- Different styling for admin vs user routes

## Usage Examples

### Login as User
```javascript
const { login } = useAuth();
const result = await login('user@example.com', 'password', 'user');
if (result.success) {
    // Redirect to /dashboard
}
```

### Login as Admin
```javascript
const { login } = useAuth();
const result = await login('admin@example.com', 'password', 'admin');
if (result.success) {
    // Redirect to /admin/dashboard
}
```

### Check Authentication
```javascript
const { isUserAuthenticated, isAdminAuthenticated } = useAuth();

if (isUserAuthenticated()) {
    // User is logged in
}

if (isAdminAuthenticated()) {
    // Admin is logged in
}
```

### Logout
```javascript
const { logoutAdmin, logoutUser } = useAuth();

// Logout admin only
logoutAdmin();

// Logout user only
logoutUser();

// Logout both
logout('all');
```

## Security Features

1. **Role Validation**: Login validates user role matches requested role
2. **Separate Tokens**: Admin and user tokens are stored separately
3. **Route Protection**: Admin routes require admin authentication
4. **Token Selection**: API automatically uses correct token based on route
5. **Separate Sessions**: Each session is independent

## Navigation

### User Navigation
- Home
- About
- Dashboard (if logged in as user)
- Login (if not logged in)

### Admin Navigation
- Home
- About
- Admin Dashboard (if logged in as admin)
- Admin Person Management (if logged in as admin)
- Admin Login (if not logged in as admin)

### Combined Navigation
When both are logged in:
- Shows both user and admin menu items
- Shows both session badges
- Shows separate logout buttons

## Testing

### Test User Login
1. Navigate to `/login`
2. Login with user credentials
3. Should redirect to `/dashboard`
4. Navbar shows user badge

### Test Admin Login
1. Navigate to `/admin/login`
2. Login with admin credentials
3. Should redirect to `/admin/dashboard`
4. Navbar shows admin badge with shield icon

### Test Simultaneous Sessions
1. Login as user at `/login`
2. Login as admin at `/admin/login` (in same browser)
3. Navbar should show both badges
4. Each logout button only logs out that specific session

### Test Route Protection
1. Try accessing `/admin/dashboard` without admin login → Redirects to `/admin/login`
2. Try accessing `/dashboard` without user login → Redirects to `/login`
3. Admin cannot access user routes with admin token (and vice versa)

## Troubleshooting

### Issue: Wrong token being used
**Solution:** Check API interceptor - it should detect route from URL path

### Issue: Both sessions logging out together
**Solution:** Ensure using `logoutAdmin()` or `logoutUser()` separately, not `logout()`

### Issue: Admin can't access admin routes
**Solution:** Verify admin token is stored as `adminToken` in localStorage

### Issue: User redirected to admin login
**Solution:** Check ProtectedRoute - ensure `requireUser={true}` for user routes

---

**Status:** ✅ **Separate Admin & User Authentication Fully Implemented!**

Both admin and user can now be logged in simultaneously with separate sessions and logout functionality.
