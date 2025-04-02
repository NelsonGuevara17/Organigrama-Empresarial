
using System.ComponentModel.DataAnnotations;

namespace OrganigramaEmployees.Models
{
    public class Usuario
    {
        public int id { get; set; }

        [Required]
        [StringLength(50)]
        public string nombre { get; set; }

        [Required]
        [EmailAddress]
        public string correo { get; set; }

        [Required]
        public string contraseña { get; set; } 

    }
}
