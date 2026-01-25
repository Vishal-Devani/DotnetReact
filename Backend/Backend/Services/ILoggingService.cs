using Backend.Models;

namespace Backend.Services;

public interface ILoggingService
{
    Task LogApiRequestAsync(ApiLog apiLog);
    Task LogErrorAsync(ErrorLog errorLog);
    Task<List<ApiLog>> GetApiLogsAsync(int page = 1, int pageSize = 50, string? filter = null);
    Task<List<ErrorLog>> GetErrorLogsAsync(int page = 1, int pageSize = 50, string? filter = null);
    Task<ApiLog?> GetApiLogByIdAsync(int id);
    Task<ErrorLog?> GetErrorLogByIdAsync(int id);
}
