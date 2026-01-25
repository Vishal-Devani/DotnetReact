using Backend.Models;
using Backend.Services;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;
using System.Security.Claims;
using System.Text;

namespace Backend.Middleware;

public class ApiLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ApiLoggingMiddleware> _logger;

    public ApiLoggingMiddleware(
        RequestDelegate next,
        ILogger<ApiLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Skip logging for Swagger UI and static files
        var path = context.Request.Path.Value?.ToLower() ?? "";
        if (path.StartsWith("/swagger") || 
            path.StartsWith("/_framework") ||
            path.StartsWith("/css") ||
            path.StartsWith("/js") ||
            path.StartsWith("/lib") ||
            path == "/" ||
            path == "/favicon.ico")
        {
            await _next(context);
            return;
        }

        var stopwatch = Stopwatch.StartNew();
        var requestTime = DateTime.UtcNow;

        // Capture request body
        string? requestBody = null;
        if (context.Request.ContentLength > 0 && 
            context.Request.ContentType?.Contains("application/json") == true)
        {
            context.Request.EnableBuffering();
            using var reader = new StreamReader(context.Request.Body, Encoding.UTF8, leaveOpen: true);
            requestBody = await reader.ReadToEndAsync();
            context.Request.Body.Position = 0;
        }

        // Capture original response body stream
        var originalBodyStream = context.Response.Body;

        // Create new memory stream for response
        using var responseBody = new MemoryStream();
        context.Response.Body = responseBody;

        try
        {
            await _next(context);
        }
        finally
        {
            stopwatch.Stop();
            var responseTime = DateTime.UtcNow;
            var responseTimeMs = stopwatch.ElapsedMilliseconds;

            // Get response body
            responseBody.Seek(0, SeekOrigin.Begin);
            var responseBodyText = await new StreamReader(responseBody).ReadToEndAsync();
            responseBody.Seek(0, SeekOrigin.Begin);

            // Copy response back to original stream
            await responseBody.CopyToAsync(originalBodyStream);

            // Get user information
            var userId = context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            var username = context.User?.FindFirstValue(ClaimTypes.Name);

            // Get controller and action from route data
            var routeData = context.Request.RouteValues;
            var controller = routeData.ContainsKey("controller") 
                ? routeData["controller"]?.ToString() 
                : null;
            var action = routeData.ContainsKey("action") 
                ? routeData["action"]?.ToString() 
                : null;

            // Create API log entry
            var apiLog = new ApiLog
            {
                HttpMethod = context.Request.Method,
                Path = context.Request.Path.Value ?? "",
                QueryString = context.Request.QueryString.HasValue 
                    ? context.Request.QueryString.Value 
                    : null,
                IpAddress = GetClientIpAddress(context),
                UserId = userId != null && int.TryParse(userId, out var uid) ? uid : null,
                Username = username,
                RequestTime = requestTime,
                ResponseTime = responseTime,
                StatusCode = context.Response.StatusCode,
                ResponseTimeMs = responseTimeMs,
                RequestBody = TruncateString(requestBody, 5000),
                ResponseBody = TruncateString(responseBodyText, 5000),
                UserAgent = context.Request.Headers["User-Agent"].ToString(),
                Controller = controller,
                Action = action
            };

            // Log asynchronously (don't await to avoid blocking)
            // Create a scope for the background task to resolve scoped services
            _ = Task.Run(async () =>
            {
                try
                {
                    // Create a scope to resolve scoped services
                    using var scope = context.RequestServices.CreateScope();
                    var loggingService = scope.ServiceProvider.GetRequiredService<ILoggingService>();
                    await loggingService.LogApiRequestAsync(apiLog);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to log API request");
                }
            });
        }
    }

    private static string? TruncateString(string? value, int maxLength)
    {
        if (string.IsNullOrEmpty(value))
            return value;

        return value.Length > maxLength 
            ? value.Substring(0, maxLength) + "..." 
            : value;
    }

    private static string? GetClientIpAddress(HttpContext context)
    {
        // Check for forwarded IP (when behind proxy/load balancer)
        var forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrEmpty(forwardedFor))
        {
            var ips = forwardedFor.Split(',');
            return ips[0].Trim();
        }

        var realIp = context.Request.Headers["X-Real-IP"].FirstOrDefault();
        if (!string.IsNullOrEmpty(realIp))
        {
            return realIp;
        }

        return context.Connection.RemoteIpAddress?.ToString();
    }
}
