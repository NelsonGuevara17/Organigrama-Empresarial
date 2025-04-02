using Microsoft.AspNetCore.Mvc;

namespace OrganigramaEmployees.Controllers
{
    public class OrganigramaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Manage()
        {
            // Verificar si el usuario está autenticado
            if (string.IsNullOrEmpty(HttpContext.Session.GetString("UsuarioId")))
            {
                return RedirectToAction("Index", "Login");
            }

            // Renderizar la vista Manage
            return View();
        }

        public IActionResult Login()
        {
            return RedirectToAction("Manage");
        }
    }
}
