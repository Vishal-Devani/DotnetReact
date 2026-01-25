using Backend.DTOs;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Policy = "AdminOnly")] // Only admins can view logs
public class LogsController : ControllerBase
{
    private readonly ILoggingService _loggingService;
    private readonly ILogger<LogsController> _logger;

    public LogsController(ILoggingService loggingService, ILogger<LogsController> logger)
    {
        _loggingService = loggingService;
        _logger = logger;
    }

    [HttpGet("api-logs")]
    public async Task<IActionResult> GetApiLogs(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        [FromQuery] string? filter = null)
    {
        try
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 50;

            var logs = await _loggingService.GetApiLogsAsync(page, pageSize, filter);
            var logsDto = logs.Select(log => new ApiLogDTO
            {
                Id = log.Id,
                HttpMethod = log.HttpMethod,
                Path = log.Path,
                QueryString = log.QueryString,
                IpAddress = log.IpAddress,
                UserId = log.UserId,
                Username = log.Username,
                RequestTime = log.RequestTime,
                ResponseTime = log.ResponseTime,
                StatusCode = log.StatusCode,
                ResponseTimeMs = log.ResponseTimeMs,
                RequestBody = log.RequestBody,
                ResponseBody = log.ResponseBody,
                UserAgent = log.UserAgent,
                Controller = log.Controller,
                Action = log.Action
            }).ToList();

            return Ok(ApiResponse<List<ApiLogDTO>>.SuccessResponse(logsDto));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving API logs");
            return StatusCode(500, ApiResponse<object>.ErrorResponse("An error occurred while retrieving API logs"));
        }
    }

    [HttpGet("api-logs/{id}")]
    public async Task<IActionResult> GetApiLogById(int id)
    {
        try
        {
            var log = await _loggingService.GetApiLogByIdAsync(id);
            if (log == null)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("API log not found"));
            }

            var logDto = new ApiLogDTO
            {
                Id = log.Id,
                HttpMethod = log.HttpMethod,
                Path = log.Path,
                QueryString = log.QueryString,
                IpAddress = log.IpAddress,
                UserId = log.UserId,
                Username = log.Username,
                RequestTime = log.RequestTime,
                ResponseTime = log.ResponseTime,
                StatusCode = log.StatusCode,
                ResponseTimeMs = log.ResponseTimeMs,
                RequestBody = log.RequestBody,
                ResponseBody = log.ResponseBody,
                UserAgent = log.UserAgent,
                Controller = log.Controller,
                Action = log.Action
            };

            return Ok(ApiResponse<ApiLogDTO>.SuccessResponse(logDto));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving API log: {Id}", id);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("An error occurred while retrieving API log"));
        }
    }

    [HttpGet("error-logs")]
    public async Task<IActionResult> GetErrorLogs(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        [FromQuery] string? filter = null)
    {
        try
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 50;

            var logs = await _loggingService.GetErrorLogsAsync(page, pageSize, filter);
            var logsDto = logs.Select(log => new ErrorLogDTO
            {
                Id = log.Id,
                HttpMethod = log.HttpMethod,
                Path = log.Path,
                QueryString = log.QueryString,
                IpAddress = log.IpAddress,
                UserId = log.UserId,
                Username = log.Username,
                ErrorTime = log.ErrorTime,
                ErrorType = log.ErrorType,
                ErrorMessage = log.ErrorMessage,
                StackTrace = log.StackTrace,
                Controller = log.Controller,
                Action = log.Action,
                StatusCode = log.StatusCode,
                RequestBody = log.RequestBody,
                UserAgent = log.UserAgent,
                InnerException = log.InnerException
            }).ToList();

            return Ok(ApiResponse<List<ErrorLogDTO>>.SuccessResponse(logsDto));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving error logs");
            return StatusCode(500, ApiResponse<object>.ErrorResponse("An error occurred while retrieving error logs"));
        }
    }

    [HttpGet("error-logs/{id}")]
    public async Task<IActionResult> GetErrorLogById(int id)
    {
        try
        {
            var log = await _loggingService.GetErrorLogByIdAsync(id);
            if (log == null)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("Error log not found"));
            }

            var logDto = new ErrorLogDTO
            {
                Id = log.Id,
                HttpMethod = log.HttpMethod,
                Path = log.Path,
                QueryString = log.QueryString,
                IpAddress = log.IpAddress,
                UserId = log.UserId,
                Username = log.Username,
                ErrorTime = log.ErrorTime,
                ErrorType = log.ErrorType,
                ErrorMessage = log.ErrorMessage,
                StackTrace = log.StackTrace,
                Controller = log.Controller,
                Action = log.Action,
                StatusCode = log.StatusCode,
                RequestBody = log.RequestBody,
                UserAgent = log.UserAgent,
                InnerException = log.InnerException
            };

            return Ok(ApiResponse<ErrorLogDTO>.SuccessResponse(logDto));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving error log: {Id}", id);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("An error occurred while retrieving error log"));
        }
    }
}
