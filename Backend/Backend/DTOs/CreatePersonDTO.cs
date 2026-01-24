using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public class CreatePersonDTO
{
    [Required]
    [MaxLength(30)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string LastName { get; set; } = string.Empty;
}
