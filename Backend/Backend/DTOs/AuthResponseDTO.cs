namespace Backend.DTOs;

public class AuthResponseDTO
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public UserDTO User { get; set; } = new();
    public DateTime ExpiresAt { get; set; }
}


