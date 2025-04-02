using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrganigramaEmployees.Data; // Cambia "YourNamespace" por el namespace de tu proyecto

namespace OrganigramaEmployees.Controllers
{
    public class LoginController : Controller
    {
        private readonly OrganigramaContext _context;

        public LoginController(OrganigramaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View("~/Views/Organigrama/Login.cshtml"); // Ruta explícita de la vista
        }


        [HttpPost]
        public async Task<IActionResult> Index(string correo, string contraseña)
        {
            // Verificar si los campos están vacíos
            if (string.IsNullOrEmpty(correo) || string.IsNullOrEmpty(contraseña))
            {
                ViewBag.Error = "Por favor, completa todos los campos.";
                return View("~/Views/Organigrama/Login.cshtml"); // Ruta explícita de la vista
            }

            // Depuración: Imprimir valores ingresados
            Console.WriteLine($"Correo ingresado: {correo}, Contraseña ingresada: {contraseña}");

            // Verificar el usuario usando SQL en bruto con crypt()
            var usuario = await _context.usuarios
                .FromSqlInterpolated($@"
            SELECT * 
            FROM usuarios 
            WHERE correo = {correo} AND contraseña = crypt({contraseña}, contraseña)")
                .FirstOrDefaultAsync();

            if (usuario == null)
            {
                ViewBag.Error = "Correo o contraseña incorrectos.";
                return View("~/Views/Organigrama/Login.cshtml"); // Ruta explícita
            }

            // Establecer sesión para el usuario
            HttpContext.Session.SetString("UsuarioId", usuario.id.ToString());
            HttpContext.Session.SetString("NombreUsuario", usuario.nombre);

            return RedirectToAction("Manage", "Organigrama");
        }

        [HttpPost]
        public IActionResult Logout()
        {
            Console.WriteLine("Método Logout ejecutado"); // Agregar esto para verificar
            HttpContext.Session.Clear();
            return RedirectToAction("Index", "Login");
        }



    }
}
