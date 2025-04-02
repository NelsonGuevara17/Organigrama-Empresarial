using Microsoft.EntityFrameworkCore;
using OrganigramaEmployees.Models;

namespace OrganigramaEmployees.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
           : base(options)
        {
        }

        // Define las tablas (entidades)
        public DbSet<Usuario> usuarios { get; set; }
    }
}
