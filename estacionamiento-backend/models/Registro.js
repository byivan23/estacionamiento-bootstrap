const mongoose = require('mongoose');

const registroSchema = new mongoose.Schema({
  placa: String,
  tipo: String,
  color: String,
  accion: String,
  hora: {
    type: String,
    default: () => {
      const ahora = new Date();
      return ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
}, {
  timestamps: true // Esto agrega createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Registro', registroSchema);
