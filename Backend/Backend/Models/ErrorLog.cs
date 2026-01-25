using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class ErrorLog
{
    public int Id { get; set; }

    [MaxLength(10)]
    public string? HttpMethod { get; set; }

    [MaxLength(500)]
    public string? Path { get; set; }

    [MaxLength(1000)]
    public string? QueryString { get; set; }

    [MaxLength(50)]
    public string? IpAddress { get; set; }

    public int? UserId { get; set; }

    [MaxLength(100)]
    public string? Username { get; set; }

    public DateTime ErrorTime { get; set; } = DateTime.UtcNow;

    [MaxLength(500)]
    public string ErrorType { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string ErrorMessage { get; set; } = string.Empty;

    public string? StackTrace { get; set; }

    [MaxLength(100)]
    public string? Controller { get; set; }

    [MaxLength(100)]
    public string? Action { get; set; }

    public int? StatusCode { get; set; }

    [MaxLength(5000)]
    public string? RequestBody { get; set; }

    [MaxLength(1000)]
    public string? UserAgent { get; set; }

    [MaxLength(1000)]
    public string? InnerException { get; set; }
}
