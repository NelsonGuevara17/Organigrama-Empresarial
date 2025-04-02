const interval = setInterval(() => {
    const labelElement = document.querySelector('.boc-input label');
    if (labelElement) {
        labelElement.textContent = "Busqueda Específica"; 
        clearInterval(interval); 
    }
}, 100); 


// Función para inicializar el organigrama
function initOrgChart(data) {
    const chart = new OrgChart(document.getElementById("tree"), {
        nodes: data.map(employee => ({
            id: employee.id,
            pid: employee.pid,
            name: employee.name,
            role: employee.role,
            mail: employee.mail,
            img: employee.img,
            phone: employee.phone,
            date: employee.date,
            estate: employee.estate
        })),
        layout: OrgChart.tree,
        scaleInitial: 0.7,
        nodeBinding: {
            field_0: "name",
            field_1: "role",
            field_2: "mail",
            img_0: "img"
        },
        collapse: { level: 3 }
    });

    document.getElementById("exportButton").addEventListener("click", function () {
        Swal.fire({
            title: '¿Quieres exportar el organigrama a PDF?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, exportar',
            cancelButtonText: 'Cancelar',

        }).then((result) => {
            if (result.isConfirmed) {
                chart.exportPDF();
                Swal.fire('Exportación en proceso!', '', 'success');
            }
        });
    });
}

// Solicitar datos de la API y pasar al organigrama
fetch('/api/employees')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => initOrgChart(data))
    .catch(error => console.error("Error al cargar los datos:", error));




document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        "name": "Nombre",
        "role": "Rol",
        "mail": "Correo",
        "img": "Imagen",
        "phone": "Teléfono",
        "date": "Fecha",
        "estate": "Estado"
    };

    // Función para traducir etiquetas
    const translateLabels = () => {
        const labels = document.querySelectorAll('label');
        labels.forEach(label => {
            const text = label.textContent.trim();
            if (translations[text]) {
                label.textContent = translations[text];
            }
        });
    };

    translateLabels();

    const observer = new MutationObserver(() => {
        translateLabels();
    });

    observer.observe(document.body, {
        childList: true, 
        subtree: true    
    });
});

