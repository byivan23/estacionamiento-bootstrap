document.getElementById('registroForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const placa = document.getElementById('placa').value;
  const tipo = document.getElementById('tipo').value;
  const color = document.getElementById('color').value;
  const accion = document.getElementById('accion').value;

  const mensaje = document.getElementById('mensaje');

  try {
    const res = await fetch('https://estacionamiento-bootstrap.onrender.com/api/registros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ placa, tipo, color, accion })
    });

    const data = await res.json();

    if (res.ok) {
      mensaje.innerHTML = `<div class="alert alert-success">✅ ${data.message}</div>`;
      document.getElementById('registroForm').reset();

      // Crear el enlace de descarga del ticket PDF
      const downloadLink = document.createElement('a');
      downloadLink.href = `https://estacionamiento-bootstrap.onrender.com/api/registros/ticket/${placa}-${Date.now()}.pdf`;
      downloadLink.download = `${placa}-ticket.pdf`;
      downloadLink.textContent = 'Descargar Ticket';
      document.getElementById('mensaje').appendChild(downloadLink);
      
    } else {
      mensaje.innerHTML = `<div class="alert alert-danger">❌ ${data.error}</div>`;
    }
  } catch (error) {
    console.error('Error:', error);
    mensaje.innerHTML = `<div class="alert alert-danger">❌ Error de conexión al servidor</div>`;
  }
});