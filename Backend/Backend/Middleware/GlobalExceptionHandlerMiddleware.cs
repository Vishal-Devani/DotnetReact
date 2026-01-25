using Backend.DTOs;
using Backend.Exceptions;
using Backend.Models;
using Backend.Services;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace Backend.Middleware;

public class GlobalExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

    public GlobalExceptionHandlerMiddleware(
        RequestDelegate next, 
        ILogger<GlobalExceptionHandlerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        var response = exception switch
        {
            NotFoundException => new ApiResponse<object>
            {
                Success = false,
                Message = exception.Message,
                Errors = new List<string> { exception.Message }
            },
            ArgumentException => new ApiResponse<object>
            {
                Success = false,
                Message = "Invalid request",
                Errors = new List<string> { exception.Message }
            },
            InvalidOperationException => new ApiResponse<object>
            {
                Success = false,
                Message = "Operation failed",
                Errors = new List<string> { exception.Message }
            },
            _ => new ApiResponse<object>
            {
                Success = false,
                Message = "An error occurred while processing your request",
                Errors = new List<string> { "Internal server error" }
            }
        };

        context.Response.StatusCode = exception switch
        {
            NotFoundException => (int)HttpStatusCode.NotFound,
            ArgumentException => (int)HttpStatusCode.BadRequest,
            InvalidOperationException => (int)HttpStatusCode.BadRequest,
            _ => (int)HttpStatusCode.InternalServerError
        };

        var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        // Log error to database asynchronously
        // Create a scope for the background task to resolve scoped services
        _ = Task.Run(async () =>
        {
            try
            {
                // Create a scope to resolve scoped services
                using var scope = context.RequestServices.CreateScope();
                await LogErrorToDatabaseAsync(context, exception, scope.ServiceProvider);
            }
            catch (Exception logEx)
            {
                _logger.LogError(logEx, "Failed to log error to database");
            }
        });

        await context.Response.WriteAsync(jsonResponse);
    }

    private async Task LogErrorToDatabaseAsync(HttpContext context, Exception exception, IServiceProvider serviceProvider)
    {
        try
        {
            // Resolve logging service from provided scope
            var loggingService = serviceProvider.GetRequiredService<ILoggingService>();

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

            // Capture request body if available
            string? requestBody = null;
            if (context.Request.ContentLength > 0 &&
                context.Request.ContentType?.Contains("application/json") == true)
            {
                try
                {
                    context.Request.EnableBuffering();
                    using var reader = new StreamReader(context.Request.Body, Encoding.UTF8, leaveOpen: true);
                    requestBody = await reader.ReadToEndAsync();
                    context.Request.Body.Position = 0;
                }
                catch
                {
                    // Ignore errors reading request body
                }
            }

            var errorLog = new ErrorLog
            {
                HttpMethod = context.Request.Method,
                Path = context.Request.Path.Value ?? "",
                QueryString = context.Request.QueryString.HasValue
                    ? context.Request.QueryString.Value
                    : null,
                IpAddress = GetClientIpAddress(context),
                UserId = userId != null && int.TryParse(userId, out var uid) ? uid : (int?)null,
                Username = username,
                ErrorTime = DateTime.UtcNow,
                ErrorType = exception.GetType().Name,
                ErrorMessage = TruncateString(exception.Message, 2000),
                StackTrace = TruncateString(exception.StackTrace, 10000),
                Controller = controller,
                Action = action,
                StatusCode = context.Response.StatusCode,
                RequestBody = TruncateString(requestBody, 5000),
                UserAgent = context.Request.Headers["User-Agent"].ToString(),
                InnerException = exception.InnerException != null
                    ? TruncateString(exception.InnerException.ToString(), 1000)
                    : null
            };

            await loggingService.LogErrorAsync(errorLog);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while logging exception to database");
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
