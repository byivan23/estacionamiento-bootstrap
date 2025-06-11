const express = require('express');
const router = express.Router();
const Registro = require('../models/Registro');

// ruta para guardar nuevo registro
router.post('/', async (req, res) => {
  try {
    const nuevo = new Registro(req.body);
    await nuevo.save();
    res.status(201).json({ message: 'Registro guardado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar el registro' });
  }
});

// ruta para obtener todos los registros
router.get('/', async (req, res) => {
    try {
      const registros = await Registro.find().sort({ createdAt: -1 }); // Últimos primero
      res.json(registros);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener registros' });
    }
  });

  // ruta para eliminar registros en modo admin
  router.delete('/:id', async (req, res) => {
    try {
      await Registro.findByIdAndDelete(req.params.id);
      res.json({ message: 'Registro eliminado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar registro' });
    }
  });
  
  //ruta para editar admin
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
