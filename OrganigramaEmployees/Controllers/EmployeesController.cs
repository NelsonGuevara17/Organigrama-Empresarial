using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrganigramaEmployees.Data;
using OrganigramaEmployees.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OrganigramaEmployees.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly OrganigramaContext _context;

        public EmployeesController(OrganigramaContext context)
        {
            _context = context;
        }

        // GET: api/employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            try
            {
                var employees = await _context.employees
                    .Select(e => new Employee
                    {
                        Id = e.Id,
                        Pid = e.Pid ?? "ROOT",  // Asigna "ROOT" si el pid es null solo en la respuesta JSON
                        Name = e.Name,
                        Role = e.Role,
                        Mail = e.Mail,
                        Img = e.Img,
                        Phone = e.Phone,
                        Date = e.Date,
                        Estate = e.Estate
                    })
                    .ToListAsync();
                return Ok(employees);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // GET: api/employees/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(string id)
        {
            try
            {
                var employee = await _context.employees.FindAsync(id);

                if (employee == null)
                {
                    return NotFound(); // Devuelve un 404 si el empleado no existe
                }

                return Ok(employee); // Devuelve el empleado en formato JSON
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // POST: api/employees
        [HttpPost]
        public async Task<ActionResult<Employee>> PostEmployee(Employee employee)
        {
            try
            {
                _context.employees.Add(employee);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // PUT: api/employees/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployee(string id, Employee employee)
        {
            if (id != employee.Id)
            {
                return BadRequest("El ID proporcionado no coincide con el ID del empleado.");
            }

            _context.Entry(employee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }

            return NoContent();
        }

        // DELETE: api/employees/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(string id)
        {
            try
            {
                var employee = await _context.employees.FindAsync(id);
                if (employee == null)
                {
                    return NotFound();
                }

                _context.employees.Remove(employee);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        // Método auxiliar para verificar si un empleado existe por ID
        private bool EmployeeExists(string id)
        {
            return _context.employees.Any(e => e.Id == id);
        }

        // GET: api/employees/nextid/{prefix}
        [HttpGet("nextid/{prefix}")]
        public async Task<ActionResult<string>> GetNextId(string prefix)
        {
            if (string.IsNullOrWhiteSpace(prefix))
            {
                return BadRequest("El prefijo no puede estar vacío.");
            }

            try
            {
                // Contar los empleados cuyo ID comienza con el prefijo dado
                var count = await _context.employees
                    .Where(e => EF.Functions.Like(e.Id, $"{prefix}%"))
                    .CountAsync();

                // Generar el siguiente ID
                var nextId = $"{prefix}{count + 1}";

                return Ok(nextId); // Devolver el siguiente ID
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

    }
}
