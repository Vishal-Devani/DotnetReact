namespace Backend.DTOs;

public class ErrorLogDTO
{
    public int Id { get; set; }
    public string? HttpMethod { get; set; }
    public string? Path { get; set; }
    public string? QueryString { get; set; }
    public string? IpAddress { get; set; }
    public int? UserId { get; set; }
    public string? Username { get; set; }
    public DateTime ErrorTime { get; set; }
    public string ErrorType { get; set; } = string.Empty;
    public string ErrorMessage { get; set; } = string.Empty;
    public string? StackTrace { get; set; }
    public string? Controller { get; set; }
    public string? Action { get; set; }
    public int? StatusCode { get; set; }
    public string? RequestBody { get; set; }
    public string? UserAgent { get; set; }
    public string? InnerException { get; set; }
}
