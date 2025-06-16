const express = require('express');
const router = express.Router();
const Registro = require('../models/Registro');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

// Ruta para crear el directorio 'tickets' si no existe
const ticketsDir = path.join(__dirname, '../tickets');
if (!fs.existsSync(ticketsDir)) {
  fs.mkdirSync(ticketsDir, { recursive: true });
}

// Ruta para guardar un nuevo registro y generar el ticket en PDF
router.post('/', async (req, res) => {
  const { placa, tipo, color, accion } = req.body;

  try {
    const nuevoRegistro = new Registro({ placa, tipo, color, accion });
    await nuevoRegistro.save();

    // ------------- BLOQUE DE DISEÑO MEJORADO DEL TICKET PDF -----------------
    const doc = new PDFDocument({
      size: "A5", // Más pequeño, tipo ticket
      margins: { top: 40, bottom: 40, left: 40, right: 40 },
      autoFirstPage: true
    });

    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      let pdfData = Buffer.concat(buffers);

      res.writeHead(201, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${placa}-ticket.pdf`,
      });
      res.end(pdfData);
    });

    // Si tienes un logo, descomenta y pon la ruta adecuada:
    // try {
      // doc.image("img/logo.png", doc.page.width/2 - 40, 15, { width: 80 });
    // } catch {}

    // Nombre del estacionamiento
    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .fillColor('#007BFF') // azul institucional
      .text("ESTACIONAMIENTO PALMA", { align: "center" })
      .moveDown(0.5);

    // Línea divisora
    doc
      .moveTo(40, 70)
      .lineTo(doc.page.width - 40, 70)
      .strokeColor("#007BFF")
      .lineWidth(2)
      .stroke();

    // Datos principales del ticket
    doc
      .moveDown(1.5)
      .font("Helvetica")
      .fontSize(14)
      .fillColor('black')
      .text(`Placa: ${placa}`)
      .text(`Tipo: ${tipo}`)
      .text(`Color: ${color}`)
      .text(`Acción: ${accion}`)
      .text(`Fecha de Entrada: ${new Date().toLocaleString()}`)
      .moveDown(2);

    // Línea divisora
    doc
      .moveTo(40, doc.y)
      .lineTo(doc.page.width - 40, doc.y)
      .strokeColor("#007BFF")
      .lineWidth(1)
      .stroke()
      .moveDown(1);

    // Pie de página
    doc
      .font("Helvetica-Oblique")
      .fontSize(12)
      .fillColor('gray')
      .text("¡Gracias por su visita!", { align: "center" });

    doc.end();
    // ------------- FIN BLOQUE DISEÑO MEJORADO -------------------------------

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el registro o generar el ticket' });
  }
});

// Ruta para servir el ticket PDF
router.get('/ticket/:ticketName', (req, res) => {
  const ticketName = req.params.ticketName;
  const filePath = path.join(__dirname, '../tickets', ticketName);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error al descargar el ticket:', err);
      res.status(500).send('No se pudo encontrar el ticket');
    }
  });
});

// Ruta para obtener todos los registros
router.get('/', async (req, res) => {
  try {
    const registros = await Registro.find().sort({ createdAt: -1 }); 
    res.json(registros);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener registros' });
  }
});

// Ruta para eliminar registros en modo admin
router.delete('/:id', async (req, res) => {
  try {
    await Registro.findByIdAndDelete(req.params.id);
    res.json({ message: 'Registro eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar registro' });
  }
});

// Ruta para editar registro en modo admin
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;

    const registroActualizado = await Registro.findByIdAndUpdate(id, datosActualizados, {
      new: true,
    });

    res.json({ message: "Registro actualizado", registro: registroActualizado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar el registro" });
  }
});

module.exports = router;
