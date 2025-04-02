using Microsoft.EntityFrameworkCore;
using OrganigramaEmployees.Data;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSession(); 

// Configuración de la conexión a PostgreSQL
builder.Services.AddDbContext<OrganigramaContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection")));

// Agregar servicios de controladores con vistas
// Habilitar Razor Runtime Compilation solo en entorno de desarrollo
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddControllersWithViews()
        .AddRazorRuntimeCompilation(); 
}
else
{
    builder.Services.AddControllersWithViews();
}

var app = builder.Build();

app.UseSession();

// Middleware para redireccionar HTTP a HTTPS
app.UseHttpsRedirection();

// Middleware para servir archivos estáticos (si tienes archivos en wwwroot)
app.UseStaticFiles();

// Middleware de autorización
app.UseAuthorization();
app.UseAuthentication(); 

// Configurar enrutamiento de controladores con vistas
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Organigrama}/{action=Index}/{id?}");

// Mapear controladores
app.MapControllers();

app.Run();
