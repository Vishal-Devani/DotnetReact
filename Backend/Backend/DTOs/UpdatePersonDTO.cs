using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public class UpdatePersonDTO
{
    [Required]
    public int Id { get; set; }

    [Required]
    [MaxLength(30)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string LastName { get; set; } = string.Empty;
}
