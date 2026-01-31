using Backend.DTOs;
using Backend.Models;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BCrypt.Net;

namespace Backend.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly ILogger<AuthService> _logger;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext context, ILogger<AuthService> logger, IConfiguration configuration)
    {
        _context = context;
        _logger = logger;
        _configuration = configuration;
    }

    public async Task<AuthResponseDTO> LoginAsync(LoginDTO loginDto)
    {
        try
        {
            // Find user by username or email using Stored Procedure
            var users = await _context.Users
                .FromSqlRaw("EXEC sp_User_GetByUsernameOrEmail @p0", loginDto.UsernameOrEmail)
                .ToListAsync();
            
            var user = users.FirstOrDefault();

            if (user == null || !user.IsActive)
            {
                _logger.LogWarning("Login attempt with invalid credentials: {UsernameOrEmail}", loginDto.UsernameOrEmail);
                throw new UnauthorizedAccessException("Invalid username/email or password");
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                _logger.LogWarning("Login attempt with invalid password for user: {Username}", user.Username);
                throw new UnauthorizedAccessException("Invalid username/email or password");
            }

            // Update last login using Stored Procedure
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC sp_User_UpdateLastLogin @p0, @p1", 
                user.Id, 
                DateTime.UtcNow);

            // Generate tokens
            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            _logger.LogInformation("User logged in successfully: {Username}, Role: {Role}", user.Username, user.Role);

            return new AuthResponseDTO
            {
                Token = token,
                RefreshToken = refreshToken,
                User = new UserDTO
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role,
                    CreatedAt = user.CreatedAt
                },
                ExpiresAt = DateTime.UtcNow.AddHours(1) // Token expires in 1 hour
            };
        }
        catch (UnauthorizedAccessException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for: {UsernameOrEmail}", loginDto.UsernameOrEmail);
            throw new InvalidOperationException("An error occurred during login");
        }
    }

    public async Task<AuthResponseDTO> RegisterAsync(RegisterDTO registerDto)
    {
        try
        {
            // Hash password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password, BCrypt.Net.BCrypt.GenerateSalt());
            var createdAt = DateTime.UtcNow;
            var isActive = true;
            var role = "User";

            // Execute Stored Procedure to register user
            // We use SQL query to get the ID back or error code
            var result = await _context.Database.SqlQueryRaw<int>(
                "EXEC sp_User_Register @p0, @p1, @p2, @p3, @p4, @p5",
                registerDto.Username,
                registerDto.Email,
                passwordHash,
                role,
                createdAt,
                isActive
            ).ToListAsync();

            var newUserId = result.FirstOrDefault();

            if (newUserId == -1)
            {
                throw new InvalidOperationException("Username already exists");
            }
            if (newUserId == -2)
            {
                throw new InvalidOperationException("Email already exists");
            }

            // Construct user object for token generation (since we have all data)
            var user = new User
            {
                Id = newUserId,
                Username = registerDto.Username,
                Email = registerDto.Email,
                Role = role,
                CreatedAt = createdAt,
                IsActive = isActive
            };

            _logger.LogInformation("New user registered: {Username}, Email: {Email}", user.Username, user.Email);

            // Generate tokens
            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            return new AuthResponseDTO
            {
                Token = token,
                RefreshToken = refreshToken,
                User = new UserDTO
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role,
                    CreatedAt = user.CreatedAt
                },
                ExpiresAt = DateTime.UtcNow.AddHours(1)
            };
        }
        catch (InvalidOperationException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for: {Email}", registerDto.Email);
            throw new InvalidOperationException("An error occurred during registration");
        }
    }

    public Task<bool> ValidateTokenAsync(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured"));

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return Task.FromResult(true);
        }
        catch
        {
            return Task.FromResult(false);
        }
    }

    public async Task<UserDTO?> GetUserByIdAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null;

        return new UserDTO
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        };
    }

    private string GenerateJwtToken(User user)
    {
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured"));
        var issuer = _configuration["Jwt:Issuer"] ?? "Backend";
        var audience = _configuration["Jwt:Audience"] ?? "Backend";

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(1),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    public async Task<IEnumerable<UserDTO>> GetAllUsersAsync()
    {
        return await _context.Database.SqlQueryRaw<UserDTO>("EXEC sp_User_GetAll")
            .ToListAsync();
    }

    public async Task<bool> UpdateUserStatusAsync(int userId, bool isActive)
    {
        try
        {
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC sp_User_UpdateStatus @p0, @p1", 
                userId, 
                isActive);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user status for UserId: {UserId}", userId);
            return false;
        }
    }
}
