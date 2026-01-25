# User Secrets Setup Guide

## Why User Secrets?

User Secrets allow you to store sensitive configuration data (like connection strings) outside of your source code. This prevents accidentally committing secrets to version control.

## Setup Instructions

### 1. Initialize User Secrets

Run this command in the `Backend/Backend` directory:

```bash
dotnet user-secrets init
```

### 2. Add Connection String

```bash
dotnet user-secrets set "ConnectionStrings:Default" "Server=VISHAL-PC\SQLEXPRESS01;Database=Project1;Integrated Security=true;TrustServerCertificate=true;"
```

### 3. Update appsettings.json

Remove the connection string from `appsettings.json` (or leave it as a fallback for production):

```json
{
  "ConnectionStrings": {
    "Default": ""  // Empty - will use User Secrets in development
  }
}
```

### 4. Verify

To view your secrets:

```bash
dotnet user-secrets list
```

## Notes

- User Secrets are only available in **Development** environment
- For **Production**, use:
  - Environment Variables
  - Azure Key Vault
  - AWS Secrets Manager
  - Or other secure secret management solutions

## Alternative: Environment Variables

If you prefer environment variables:

**Windows (PowerShell):**
```powershell
$env:ConnectionStrings__Default = "Server=VISHAL-PC\SQLEXPRESS01;Database=Project1;Integrated Security=true;TrustServerCertificate=true;"
```

**Linux/Mac:**
```bash
export ConnectionStrings__Default="Server=VISHAL-PC\SQLEXPRESS01;Database=Project1;Integrated Security=true;TrustServerCertificate=true;"
```

Note: Use double underscore `__` for nested configuration keys.
