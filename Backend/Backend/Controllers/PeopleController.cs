using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PeopleController : ControllerBase
{
    // POST /api/people {body}
    // GET /api/people
    // GET /api/people/2
    // PUT /api/people/2 {body}
    // DELETE /api/people/2 
    private readonly AppDbContext _context;

    public PeopleController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]  // POST /api/people
    public async Task<IActionResult> AddPerson([FromBody] CreatePersonDTO createPersonDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _context.Database
                .SqlQuery<PersonDTO>(
                    $"EXEC sp_CreatePerson @FirstName={createPersonDto.FirstName}, @LastName={createPersonDto.LastName}")
                .ToListAsync();

            var createdPerson = result.FirstOrDefault();
            
            if (createdPerson == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to create person");
            }

            return CreatedAtRoute("GetPerson", new { id = createdPerson.Id }, createdPerson);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    [HttpGet]  // GET /api/people
    public async Task<IActionResult> GetPeople()
    {
        try
        {
            var people = await _context.Database
                .SqlQuery<PersonDTO>($"EXEC sp_GetAllPeople")
                .ToListAsync();

            return Ok(people);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    [HttpGet("{id:int}", Name = "GetPerson")]  // GET /api/people/1
    public async Task<IActionResult> GetPerson(int id)
    {
        try
        {
            var result = await _context.Database
                .SqlQuery<PersonDTO>(
                    $"EXEC sp_GetPersonById @Id={id}")
                .ToListAsync();

            var person = result.FirstOrDefault();

            if (person == null)
            {
                return NotFound();
            }

            return Ok(person);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    [HttpPut("{id:int}")]  // PUT /api/people/1
    public async Task<IActionResult> UpdatePerson(int id, [FromBody] UpdatePersonDTO updatePersonDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != updatePersonDto.Id)
            {
                return BadRequest("Id in url and body mismatches");
            }

            // Check if person exists
            var existingPerson = await _context.Database
                .SqlQuery<PersonDTO>(
                    $"EXEC sp_GetPersonById @Id={id}")
                .ToListAsync();

            if (existingPerson.FirstOrDefault() == null)
            {
                return NotFound();
            }

            // Execute update stored procedure
            var rowsAffected = await _context.Database.ExecuteSqlAsync(
                $"EXEC sp_UpdatePerson @Id={updatePersonDto.Id}, @FirstName={updatePersonDto.FirstName}, @LastName={updatePersonDto.LastName}");

            if (rowsAffected == 0)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    [HttpDelete("{id:int}")]  // Delete /api/people/1
    public async Task<IActionResult> DeletePerson(int id)
    {
        try
        {
            // Check if person exists
            var existingPerson = await _context.Database
                .SqlQuery<PersonDTO>(
                    $"EXEC sp_GetPersonById @Id={id}")
                .ToListAsync();

            if (existingPerson.FirstOrDefault() == null)
            {
                return NotFound();
            }

            // Execute delete stored procedure
            var rowsAffected = await _context.Database.ExecuteSqlAsync(
                $"EXEC sp_DeletePerson @Id={id}");

            if (rowsAffected == 0)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }
}

// server app: http://localhost:3000
// client app (js app) : http://localhost:5173 => CORS
