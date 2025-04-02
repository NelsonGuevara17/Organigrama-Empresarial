using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrganigramaEmployees.Data; // Cambia el namespace si es necesario
using OrganigramaEmployees.Models;
using System.Linq;
using System.Threading.Tasks;

namespace OrganigramaEmployees.Controllers
{
    public class ManageController : Controller
    {
        private readonly OrganigramaContext _context;

        public ManageController(OrganigramaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString("UsuarioId")))
            {
                return RedirectToAction("Index", "Login");
            }

            var employees = await _context.employees.ToListAsync();
            return View(employees);
        }
    }
}