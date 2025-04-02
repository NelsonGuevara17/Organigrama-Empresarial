// Cargar empleados en el dropdown al iniciar la página
document.addEventListener("DOMContentLoaded", loadEmployeeDropdown);
document.getElementById("saveButton").style.display = "block"
document.getElementById("updateButton").style.display = "none"
document.getElementById("deleteButton").style.display = "none"
document.getElementById("id").readOnly = false;
document.getElementById("formTitle").innerHTML = "Registrar Nuevo Miembro"

function loadEmployeeDropdown() {
    fetch('/api/employees')
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar la lista de empleados");
            return response.json();
        })
        .then(data => {
            const employeeDropdown = document.getElementById('employeeDropdown');
            employeeDropdown.innerHTML = '<option value="">-- Selecciona un Empleado --</option>';

            data.forEach(employee => {
                const option = document.createElement('option');
                option.value = employee.id;
                option.textContent = `${employee.name}`;
                employeeDropdown.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar el dropdown de empleados:", error));
}

// Cargar datos del empleado seleccionado en el formulario
document.getElementById('employeeDropdown').addEventListener('change', function () {
    document.getElementById("saveButton").style.display = "none"
    document.getElementById("updateButton").style.display = "block"
    document.getElementById("deleteButton").style.display = "block"
    document.getElementById("id").readOnly = true;
    document.getElementById("formTitle").innerHTML = "Actualizar Datos"
    const selectedId = this.value;
    if (selectedId) {
        fetch(`/api/employees/${selectedId}`)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("Empleado no encontrado");
                    } else {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }
                }
                return response.json();
            })
            .then(employee => loadEmployeeToForm(employee))
            .catch(error => {
                console.error("Error al cargar el empleado seleccionado:", error);
                alert(error.message);
                resetForm();
            });
    } else {
        resetForm();
    }

});

// Mostrar datos del empleado en el formulario
function loadEmployeeToForm(employee) {
    document.getElementById("id").value = employee.id;
    document.getElementById("name").value = employee.name;
    document.getElementById("role").value = employee.role;
    document.getElementById("mail").value = employee.mail;
    document.getElementById("phone").value = employee.phone;
    document.getElementById("pid").value = employee.pid;
    document.getElementById("img").value = employee.img;
    document.getElementById("estate").value = employee.estate;
}

// Guardar nuevo empleado (POST)
document.getElementById('saveButton').addEventListener('click', function () {
    const newEmployeeData = getEmployeeFormData();

    // Verificar si los campos necesarios están completos antes de hacer el POST
    if (!newEmployeeData.name || !newEmployeeData.role || !newEmployeeData.mail || !newEmployeeData.estate) {
        Swal.fire({
            icon: 'error', // Ícono de error
            title: 'Error',
            text: "Por favor, completa todos los campos obligatorios para crear un nuevo empleado.", // Mensaje de error
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployeeData)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(`Error en la creación: ${JSON.stringify(errorData.errors)}`);
                });
            }
            return response.json();
        })
        .then(data => {
            Swal.fire({
                icon: 'success', 
                title: '¡Éxito!',
                text: "Empleado creado correctamente", 
                confirmButtonText: 'Aceptar'
            });
            resetForm();  
            loadEmployeeDropdown();  
        })
        .catch(error => {
            console.error("Error al crear el empleado:", error);
            alert(error.message);
        });
});

// Manejar envío del formulario para actualizar datos del empleado (PUT)
document.getElementById('employeeForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const employeeData = getEmployeeFormData();

    // Validar que el ID esté presente para evitar errores al actualizar
    if (!employeeData.id) {
        Swal.fire({
            icon: 'error',
            title: '¡Algo salió mal!',
            text: "Por favor, selecciona un empleado para actualizar.",
            confirmButtonColor: '#d33',
            confirmButtonText: 'Reintentar'
        });

        return;
    }

    fetch(`/api/employees/${employeeData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(`Error en la actualización: ${JSON.stringify(errorData.errors)}`);
                });
            }
            Swal.fire({
                icon: 'success', // Ícono de éxito
                title: '¡Éxito!',
                text: "Empleado actualizado correctamente", // Mensaje de éxito
                confirmButtonText: 'Aceptar'
            });
            resetForm();  // Limpiar el formulario después de actualizar
            loadEmployeeDropdown();  // Recargar el dropdown
        })
        .catch(error => {
            console.error("Error al actualizar el empleado:", error);
            alert(error.message);
        });
});

// Eliminar el empleado seleccionado (DELETE)
document.getElementById('deleteButton').addEventListener('click', function () {
    const id = document.getElementById("id").value;
    if (!id) {
        alert("Selecciona un empleado para eliminar");
        Swal.fire({
            icon: 'error', // Ícono de error
            title: 'Error',
            text: "Selecciona un empleado para eliminar", // Mensaje de error
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    fetch(`/api/employees/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) throw new Error("Error en la eliminación");

            Swal.fire({
                icon: 'success', // Ícono de éxito
                title: '¡Éxito!',
                text: "Empleado eliminado correctamente", // Mensaje de éxito
                confirmButtonText: 'Aceptar'
            });

            resetForm();  // Limpiar el formulario después de eliminar
            loadEmployeeDropdown();  // Recargar el dropdown
        })
        .catch(error => console.error("Error al eliminar el empleado:", error));
});

document.getElementById('buttonLimpiar').addEventListener('click', function () {
    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("role").value = "";
    document.getElementById("mail").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("pid").value = "";
    document.getElementById("img").value = "";
    document.getElementById("estate").value = "";

    document.getElementById("saveButton").style.display = "block"
    document.getElementById("updateButton").style.display = "none"
    document.getElementById("deleteButton").style.display = "none"

    document.getElementById("id").readOnly = false;

    document.getElementById("formTitle").innerHTML = "Registrar Nuevo Miembro"
});

// Obtener datos del formulario
function getEmployeeFormData() {
    return {
        id: document.getElementById("id").value,
        name: document.getElementById("name").value,
        role: document.getElementById("role").value,
        mail: document.getElementById("mail").value,
        phone: document.getElementById("phone").value,
        pid: document.getElementById("pid").value || null,
        img: document.getElementById("img").value,
        estate: document.getElementById("estate").value
    };
}

// Restablecer el formulario (sin cambiar el título)
function resetForm() {
    document.getElementById("employeeForm").reset();
}

// Función para cargar supervisores excluyendo a los Voluntarios
function loadSupervisors() {
    fetch('/api/employees') 
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar la lista de supervisores");
            }
            return response.json();
        })
        .then(data => {
            const supervisorDropdown = document.getElementById('pid');
            supervisorDropdown.innerHTML = '<option value="">-- Selecciona un Supervisor --</option>';

            // Filtrar empleados que NO tienen el cargo "Voluntario"
            const filteredEmployees = data.filter(employee => employee.role !== "Voluntario");

            // Agregar cada empleado filtrado como opción en el desplegable
            filteredEmployees.forEach(employee => {
                const option = document.createElement('option');
                option.value = employee.id; 
                option.textContent = `${employee.id} - ${employee.name}`; 
                supervisorDropdown.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar supervisores:", error));
}

// Llama a la función al cargar la página
document.addEventListener("DOMContentLoaded", loadSupervisors);


// Sincronizar el valor de la lista desplegable con el campo de texto
document.getElementById("idDropdown").addEventListener("change", function () {
    const selectedValue = this.value; 
    document.getElementById("id").value = selectedValue; 
});

// Detectar cambios en el dropdown de prefijos
document.getElementById('idDropdown').addEventListener('change', function () {
    const prefix = this.value; 

    // Si no hay prefijo seleccionado, limpiar el campo de texto del ID
    if (!prefix) {
        document.getElementById('id').value = ""; 
        return;
    }

    // Llamar al backend para obtener el próximo ID con base en el prefijo seleccionado
    fetch(`/api/employees/nextid/${prefix}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo generar el ID. Verifica tu conexión o el servidor.");
            }
            return response.text(); 
        })
        .then(nextId => {
            document.getElementById('id').value = nextId; 
        })
        .catch(error => {
            console.error("Error al generar el ID:", error);
            alert("Ocurrió un error al generar el ID automáticamente. Por favor, intenta nuevamente.");
        });
});
