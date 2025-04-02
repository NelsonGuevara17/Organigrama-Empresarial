using Microsoft.EntityFrameworkCore;
using OrganigramaEmployees.Models;

namespace OrganigramaEmployees.Data
{
    public class OrganigramaContext : DbContext
    {
        public OrganigramaContext(DbContextOptions<OrganigramaContext> options) : base(options) { }

        public DbSet<Employee> employees { get; set; }
        public DbSet<Usuario> usuarios { get; set; }

    }
}
