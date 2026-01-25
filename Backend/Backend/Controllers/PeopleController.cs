using Backend.DTOs;
using Backend.Exceptions;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Policy = "UserOrAdmin")] // Require authentication for all endpoints
public class PeopleController : ControllerBase
{
    // POST /api/people {body}
    // GET /api/people
    // GET /api/people/2
    // PUT /api/people/2 {body}
    // DELETE /api/people/2 
    private readonly IPersonService _personService;

    public PeopleController(IPersonService personService)
    {
        _personService = personService;
    }

    [HttpPost]  // POST /api/people
    public async Task<IActionResult> AddPerson([FromBody] CreatePersonDTO createPersonDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(
                "Validation failed", 
                ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()));
        }

        var createdPerson = await _personService.CreatePersonAsync(createPersonDto);
        return CreatedAtRoute("GetPerson", new { id = createdPerson.Id }, 
            ApiResponse<PersonDTO>.SuccessResponse(createdPerson, "Person created successfully"));
    }

    [HttpGet]  // GET /api/people
    public async Task<IActionResult> GetPeople()
    {
        var people = await _personService.GetAllPeopleAsync();
        return Ok(ApiResponse<IEnumerable<PersonDTO>>.SuccessResponse(people));
    }

    [HttpGet("{id:int}", Name = "GetPerson")]  // GET /api/people/1
    public async Task<IActionResult> GetPerson(int id)
    {
        var person = await _personService.GetPersonByIdAsync(id);

        if (person == null)
        {
            throw new NotFoundException($"Person with Id {id} not found");
        }

        return Ok(ApiResponse<PersonDTO>.SuccessResponse(person));
    }

    [HttpPut("{id:int}")]  // PUT /api/people/1
    public async Task<IActionResult> UpdatePerson(int id, [FromBody] UpdatePersonDTO updatePersonDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(
                "Validation failed", 
                ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()));
        }

        if (id != updatePersonDto.Id)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse("Id in URL and body do not match"));
        }

        var updated = await _personService.UpdatePersonAsync(id, updatePersonDto);

        if (!updated)
        {
            throw new NotFoundException($"Person with Id {id} not found");
        }

        return NoContent();
    }

    [HttpDelete("{id:int}")]  // Delete /api/people/1
    public async Task<IActionResult> DeletePerson(int id)
    {
        var deleted = await _personService.DeletePersonAsync(id);

        if (!deleted)
        {
            throw new NotFoundException($"Person with Id {id} not found");
        }

        return NoContent();
    }
}

// server app: http://localhost:3000
// client app (js app) : http://localhost:5173 => CORS
