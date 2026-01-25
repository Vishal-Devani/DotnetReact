using Backend.DTOs;
using Backend.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace Backend.Services;

public class PersonService : IPersonService
{
    private readonly AppDbContext _context;
    private readonly ILogger<PersonService> _logger;

    public PersonService(AppDbContext context, ILogger<PersonService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<PersonDTO> CreatePersonAsync(CreatePersonDTO createPersonDto)
    {
        try
        {
            // Use parameterized queries to prevent SQL injection
            var firstNameParam = new SqlParameter("@FirstName", SqlDbType.NVarChar) { Value = createPersonDto.FirstName };
            var lastNameParam = new SqlParameter("@LastName", SqlDbType.NVarChar) { Value = createPersonDto.LastName };

            var result = await _context.Database
                .SqlQueryRaw<PersonDTO>(
                    "EXEC sp_CreatePerson @FirstName, @LastName",
                    firstNameParam, lastNameParam)
                .ToListAsync();

            var createdPerson = result.FirstOrDefault();
            
            if (createdPerson == null)
            {
                _logger.LogError("Failed to create person: {FirstName} {LastName}", 
                    createPersonDto.FirstName, createPersonDto.LastName);
                throw new InvalidOperationException("Failed to create person");
            }

            _logger.LogInformation("Person created successfully: Id={Id}, Name={FirstName} {LastName}", 
                createdPerson.Id, createdPerson.FirstName, createdPerson.LastName);

            return createdPerson;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating person: {FirstName} {LastName}", 
                createPersonDto.FirstName, createPersonDto.LastName);
            throw;
        }
    }

    public async Task<IEnumerable<PersonDTO>> GetAllPeopleAsync()
    {
        try
        {
            var people = await _context.Database
                .SqlQueryRaw<PersonDTO>("EXEC sp_GetAllPeople")
                .ToListAsync();

            _logger.LogInformation("Retrieved {Count} people", people.Count);
            return people;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all people");
            throw;
        }
    }

    public async Task<PersonDTO?> GetPersonByIdAsync(int id)
    {
        try
        {
            // Use parameterized query to prevent SQL injection
            var idParam = new SqlParameter("@Id", SqlDbType.Int) { Value = id };

            var result = await _context.Database
                .SqlQueryRaw<PersonDTO>(
                    "EXEC sp_GetPersonById @Id",
                    idParam)
                .ToListAsync();

            var person = result.FirstOrDefault();

            if (person == null)
            {
                _logger.LogWarning("Person not found: Id={Id}", id);
            }
            else
            {
                _logger.LogInformation("Retrieved person: Id={Id}", id);
            }

            return person;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving person: Id={Id}", id);
            throw;
        }
    }

    public async Task<bool> UpdatePersonAsync(int id, UpdatePersonDTO updatePersonDto)
    {
        try
        {
            // Check if person exists first
            var existingPerson = await GetPersonByIdAsync(id);
            if (existingPerson == null)
            {
                _logger.LogWarning("Person not found for update: Id={Id}", id);
                return false;
            }

            // Use parameterized queries to prevent SQL injection
            var idParam = new SqlParameter("@Id", SqlDbType.Int) { Value = updatePersonDto.Id };
            var firstNameParam = new SqlParameter("@FirstName", SqlDbType.NVarChar) { Value = updatePersonDto.FirstName };
            var lastNameParam = new SqlParameter("@LastName", SqlDbType.NVarChar) { Value = updatePersonDto.LastName };

            var rowsAffected = await _context.Database.ExecuteSqlRawAsync(
                "EXEC sp_UpdatePerson @Id, @FirstName, @LastName",
                idParam, firstNameParam, lastNameParam);

            if (rowsAffected == 0)
            {
                _logger.LogWarning("No rows affected when updating person: Id={Id}", id);
                return false;
            }

            _logger.LogInformation("Person updated successfully: Id={Id}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating person: Id={Id}", id);
            throw;
        }
    }

    public async Task<bool> DeletePersonAsync(int id)
    {
        try
        {
            // Check if person exists first
            var existingPerson = await GetPersonByIdAsync(id);
            if (existingPerson == null)
            {
                _logger.LogWarning("Person not found for deletion: Id={Id}", id);
                return false;
            }

            // Use parameterized query to prevent SQL injection
            var idParam = new SqlParameter("@Id", SqlDbType.Int) { Value = id };

            var rowsAffected = await _context.Database.ExecuteSqlRawAsync(
                "EXEC sp_DeletePerson @Id",
                idParam);

            if (rowsAffected == 0)
            {
                _logger.LogWarning("No rows affected when deleting person: Id={Id}", id);
                return false;
            }

            _logger.LogInformation("Person deleted successfully: Id={Id}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting person: Id={Id}", id);
            throw;
        }
    }
}
