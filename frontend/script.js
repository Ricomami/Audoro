const form=document.querySelector("#formAuditorio");
const tabla = document.querySelector("#tablaAuditorios tbody");

// Backend URL
const URL_BACKEND = "http://localhost:3000/auditorios";

// CREAR O ACTUALIZAR
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.querySelector("#auditorioId")?.value; // campo oculto
    const nombre = document.querySelector("#nombre").value;
    const capacidad = document.querySelector("#capacidad").value;
    const ubicacion = document.querySelector("#ubicacion").value;

    try {
        let res;
        if (id) {
            // Si hay id → actualizar
            res = await fetch(`${URL_BACKEND}/actualizar/${id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({nombre, capacidad, ubicacion})
            });
        } else {
            // Si no hay id → crear nuevo
            res = await fetch(`${URL_BACKEND}/crear`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({nombre, capacidad, ubicacion})
            });
        }

        const data = await res.json();
        alert(data.msg);
        form.reset();
        document.querySelector("#auditorioId")?.remove(); // quitar hidden input
        resetBoton();

        cargarAuditorios();
    } catch (err) {
        console.error(err);
    }
});

// LEER
async function cargarAuditorios(){
    try{
        const res = await fetch(`${URL_BACKEND}/leer`);
        const data = await res.json();

        tabla.innerHTML = "";

        data.forEach(auditorio =>{
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="px-6 py-4">${auditorio.id_auditorio}</td>
                <td class="px-6 py-4">${auditorio.nombre}</td>
                <td class="px-6 py-4">${auditorio.capacidad}</td>
                <td class="px-6 py-4">${auditorio.ubicacion}</td>
                <td class="px-6 py-4">
                    <button class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600" 
                        onclick='llenarFormulario(${JSON.stringify(auditorio)})'>
                        Editar
                    </button>
                </td>
                <td class="px-6 py-4">
                    <button class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700" 
                        onclick='eliminarAuditorio(${auditorio.id_auditorio})'>
                        Eliminar
                    </button>
                </td>
            `;
            tabla.appendChild(row);
        });
    } catch (err){
        console.error(err);
    }
}

// LLENAR FORMULARIO PARA EDITAR
function llenarFormulario(auditorio) {
    document.getElementById("nombre").value = auditorio.nombre;
    document.getElementById("capacidad").value = auditorio.capacidad;
    document.getElementById("ubicacion").value = auditorio.ubicacion;

    let inputHidden = document.getElementById("auditorioId");
    if (!inputHidden) {
        inputHidden = document.createElement("input");
        inputHidden.type = "hidden";
        inputHidden.id = "auditorioId";
        inputHidden.name = "id";
        form.appendChild(inputHidden);
    }
    inputHidden.value = auditorio.id_auditorio;

    const btn = form.querySelector("button[type='submit']");
    btn.innerText = "Actualizar Auditorio";
    btn.classList.remove("bg-blue-600");
    btn.classList.add("bg-green-600");
}

// RESET BOTON DESPUÉS DE EDITAR
function resetBoton() {
    const btn = form.querySelector("button[type='submit']");
    btn.innerText = "Crear Auditorio";
    btn.classList.remove("bg-green-600");
    btn.classList.add("bg-blue-600");
}

// ELIMINAR
async function eliminarAuditorio(id) {
    if(!confirm("¿Seguro que quieres eliminar este auditorio?")) return;

    try {
        const res = await fetch(`${URL_BACKEND}/eliminar/${id}`, { method: "DELETE" });
        const data = await res.json();
        alert(data.msg);
        cargarAuditorios();
    } catch (err) {
        console.error(err);
    }
}

cargarAuditorios();