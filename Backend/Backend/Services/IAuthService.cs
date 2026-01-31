using Backend.DTOs;

namespace Backend.Services;

public interface IAuthService
{
    Task<AuthResponseDTO> LoginAsync(LoginDTO loginDto);
    Task<AuthResponseDTO> RegisterAsync(RegisterDTO registerDto);
    Task<bool> ValidateTokenAsync(string token);
    Task<UserDTO?> GetUserByIdAsync(int userId);
    Task<IEnumerable<UserDTO>> GetAllUsersAsync();
    Task<bool> UpdateUserStatusAsync(int userId, bool isActive);
}
