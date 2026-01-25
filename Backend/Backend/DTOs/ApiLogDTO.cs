namespace Backend.DTOs;

public class ApiLogDTO
{
    public int Id { get; set; }
    public string HttpMethod { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public string? QueryString { get; set; }
    public string? IpAddress { get; set; }
    public int? UserId { get; set; }
    public string? Username { get; set; }
    public DateTime RequestTime { get; set; }
    public DateTime? ResponseTime { get; set; }
    public int? StatusCode { get; set; }
    public long? ResponseTimeMs { get; set; }
    public string? RequestBody { get; set; }
    public string? ResponseBody { get; set; }
    public string? UserAgent { get; set; }
    public string? Controller { get; set; }
    public string? Action { get; set; }
}
