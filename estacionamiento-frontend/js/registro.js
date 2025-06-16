document.getElementById('registroForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const placa = document.getElementById('placa').value;
  const tipo = document.getElementById('tipo').value;
  const color = document.getElementById('color').value;
  const accion = document.getElementById('accion').value;

  try {
    const res = await fetch('https://estacionamiento-bootstrap.onrender.com/api/registros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ placa, tipo, color, accion })
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `${placa}-ticket.pdf`;
      downloadLink.textContent = 'Descargar Ticket';
      document.getElementById('mensaje').innerHTML = 'Registro exitoso. ';
      document.getElementById('mensaje').appendChild(downloadLink);
      document.getElementById('registroForm').reset();
    } else {
      const data = await res.json();
      document.getElementById('mensaje').innerHTML = `❌ ${data.error}`;
    }
  } catch (error) {
    document.getElementById('mensaje').innerHTML = `❌ Error de conexión al servidor`;
  }
});