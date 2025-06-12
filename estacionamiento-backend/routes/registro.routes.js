const express = require('express');
const router = express.Router();
const Registro = require('../models/Registro');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

// Ruta para crear el directorio 'tickets' si no existe
const ticketsDir = path.join(__dirname, 'tickets');

// Verifica si el directorio 'tickets' existe, si no, lo crea
if (!fs.existsSync(ticketsDir)) {
  fs.mkdirSync(ticketsDir, { recursive: true });
}

// Ruta para guardar un nuevo registro y generar el ticket en PDF
router.post('/', async (req, res) => {
  const { placa, tipo, color, accion } = req.body;

  try {
    // Crear el nuevo registro
    const nuevoRegistro = new Registro({
      placa,
      tipo,
      color,
      accion
    });

    await nuevoRegistro.save();

    // Crear un nuevo documento PDF
    const doc = new PDFDocument();
    
    // Define el nombre del archivo PDF
    const filePath = path.join(__dirname, 'tickets', `${placa}-${Date.now()}.pdf`);
    
    // Pipe the document to a file
    doc.pipe(fs.createWriteStream(filePath));

    // Agregar contenido al PDF
    doc.fontSize(18).text(`Ticket de Estacionamiento`, { align: 'center' });
    doc.fontSize(14).text(`Placa: ${placa}`);
    doc.text(`Tipo: ${tipo}`);
    doc.text(`Color: ${color}`);
    doc.text(`Acción: ${accion}`);
    doc.text(`Fecha de Entrada: ${new Date().toLocaleString()}`);

    // Cerrar el documento
    doc.end();

    // Enviar la respuesta con el mensaje y la ruta del ticket generado
    res.status(201).json({
      message: 'Registro agregado y ticket generado con éxito',
      ticket: filePath // Este es el enlace al archivo PDF generado
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el registro y generar el ticket' });
  }
});

// Ruta para servir el ticket PDF
router.get('/ticket/:ticketName', (req, res) => {
  const ticketName = req.params.ticketName;
  const filePath = path.join(__dirname, 'tickets', ticketName);

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