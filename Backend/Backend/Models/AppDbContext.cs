using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {

    }

    public DbSet<Person> People { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<ApiLog> ApiLogs { get; set; }
    public DbSet<ErrorLog> ErrorLogs { get; set; }
}
