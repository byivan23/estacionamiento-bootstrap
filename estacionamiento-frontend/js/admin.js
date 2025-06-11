async function cargarRegistros() {
  try {
    const res = await fetch("https://estacionamiento-bootstrap.onrender.com/api/registros");
    const registros = await res.json();

    const tbody = document.querySelector("#tablaRegistros tbody");
    tbody.innerHTML = "";

    registros.forEach((registro, index) => {
      const fila = document.createElement("tr");

      const hora = new Date(registro.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });

      fila.innerHTML = `
        <td>${registro.placa}</td>
        <td>${registro.tipo}</td>
        <td>${registro.color}</td>
        <td>${registro.accion}</td>
        <td>${hora}</td>
        <td>
          <div class="btn-group">
            <button class="btn btn-outline-primary btn-sm" onclick="editarRegistro('${registro._id}')">
              <i class="bi bi-pencil"></i> Editar
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="eliminarRegistro('${registro._id}')">
              <i class="bi bi-trash"></i> Eliminar
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(fila);
    });

  } catch (error) {
    console.error("❌ Error al cargar registros:", error);
  }
}

function editarRegistro(id) {
  // Buscar el registro actual por ID
  fetch(`https://estacionamiento-bootstrap.onrender.com/api/registros`)
    .then(res => res.json())
    .then(registros => {
      const registro = registros.find(r => r._id === id);
      if (!registro) return alert("Registro no encontrado");

      // Mostrar formulario con valores actuales
      const nuevaPlaca = prompt("Editar placa:", registro.placa);
      const nuevoTipo = prompt("Editar tipo:", registro.tipo);
      const nuevoColor = prompt("Editar color:", registro.color);
      const nuevaAccion = prompt("Editar acción (entrada/salida):", registro.accion);

      if (nuevaPlaca && nuevoTipo && nuevoColor && nuevaAccion) {
        // Enviar al backend
        fetch(`https://estacionamiento-bootstrap.onrender.com/api/registros/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            placa: nuevaPlaca,
            tipo: nuevoTipo,
            color: nuevoColor,
            accion: nuevaAccion
          })
        })
          .then(res => res.json())
          .then(data => {
            alert(data.message || "Registro actualizado");
            cargarRegistros(); // refrescar tabla
          })
          .catch(err => {
            console.error("❌ Error al actualizar:", err);
          });
      }
    });
}

async function eliminarRegistro(id) {
  if (confirm("¿Seguro que deseas eliminar este registro?")) {
    try {
      const res = await fetch(`https://estacionamiento-bootstrap.onrender.com/api/registros/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      alert(data.message || "Registro eliminado");
      cargarRegistros();
    } catch (error) {
      console.error("❌ Error al eliminar registro:", error);
    }
  }
}

cargarRegistros();
