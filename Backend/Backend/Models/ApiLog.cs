using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class ApiLog
{
    public int Id { get; set; }

    [MaxLength(10)]
    public string HttpMethod { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Path { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? QueryString { get; set; }

    [MaxLength(50)]
    public string? IpAddress { get; set; }

    public int? UserId { get; set; }

    [MaxLength(100)]
    public string? Username { get; set; }

    public DateTime RequestTime { get; set; } = DateTime.UtcNow;

    public DateTime? ResponseTime { get; set; }

    public int? StatusCode { get; set; }

    public long? ResponseTimeMs { get; set; }

    [MaxLength(5000)]
    public string? RequestBody { get; set; }

    [MaxLength(5000)]
    public string? ResponseBody { get; set; }

    [MaxLength(1000)]
    public string? UserAgent { get; set; }

    [MaxLength(100)]
    public string? Controller { get; set; }

    [MaxLength(100)]
    public string? Action { get; set; }
}
