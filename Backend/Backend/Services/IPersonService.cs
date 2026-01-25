using Backend.DTOs;

namespace Backend.Services;

public interface IPersonService
{
    Task<PersonDTO> CreatePersonAsync(CreatePersonDTO createPersonDto);
    Task<IEnumerable<PersonDTO>> GetAllPeopleAsync();
    Task<PersonDTO?> GetPersonByIdAsync(int id);
    Task<bool> UpdatePersonAsync(int id, UpdatePersonDTO updatePersonDto);
    Task<bool> DeletePersonAsync(int id);
}
