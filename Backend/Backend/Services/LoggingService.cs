using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class LoggingService : ILoggingService
{
    private readonly AppDbContext _context;
    private readonly ILogger<LoggingService> _logger;

    public LoggingService(AppDbContext context, ILogger<LoggingService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task LogApiRequestAsync(ApiLog apiLog)
    {
        try
        {
            _context.ApiLogs.Add(apiLog);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // Log to console/file if database logging fails
            _logger.LogError(ex, "Failed to save API log to database");
        }
    }

    public async Task LogErrorAsync(ErrorLog errorLog)
    {
        try
        {
            _context.ErrorLogs.Add(errorLog);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // Log to console/file if database logging fails
            _logger.LogError(ex, "Failed to save error log to database");
        }
    }

    public async Task<List<ApiLog>> GetApiLogsAsync(int page = 1, int pageSize = 50, string? filter = null)
    {
        var query = _context.ApiLogs.AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter))
        {
            query = query.Where(log =>
                log.Path.Contains(filter) ||
                log.HttpMethod.Contains(filter) ||
                (log.Username != null && log.Username.Contains(filter)) ||
                (log.IpAddress != null && log.IpAddress.Contains(filter))
            );
        }

        return await query
            .OrderByDescending(log => log.RequestTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<List<ErrorLog>> GetErrorLogsAsync(int page = 1, int pageSize = 50, string? filter = null)
    {
        var query = _context.ErrorLogs.AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter))
        {
            query = query.Where(log =>
                log.ErrorType.Contains(filter) ||
                log.ErrorMessage.Contains(filter) ||
                (log.Path != null && log.Path.Contains(filter)) ||
                (log.Username != null && log.Username.Contains(filter))
            );
        }

        return await query
            .OrderByDescending(log => log.ErrorTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<ApiLog?> GetApiLogByIdAsync(int id)
    {
        return await _context.ApiLogs.FindAsync(id);
    }

    public async Task<ErrorLog?> GetErrorLogByIdAsync(int id)
    {
        return await _context.ErrorLogs.FindAsync(id);
    }
}
