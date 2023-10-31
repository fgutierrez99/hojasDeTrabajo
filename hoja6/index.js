const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 80;

// Conectar a la base de datos
mongoose.connect('mongodb+srv://userUMG:123@cluster0.ifyymt4.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Definir el esquema del modelo
const dataSchema = new mongoose.Schema({
  Indicator: String,
  Group: String,
  State: String,
  Subgroup: String,
  Phase: Number,
  TimePeriod: Number,
  TimePeriodLabel: String,
  TimePeriodStartDate: String,
  TimePeriodEndDate: String,
  Value: Number,
  LowCI: Number,
  HighCI: Number,
  ConfidenceInterval: String,
});

// Crear el modelo
const DataModel = mongoose.model('Data', dataSchema);

app.use(express.json());

// Rutas CRUD

// Crear un nuevo registro
app.post('/api/data', async (req, res) => {
  try {
    const newData = new DataModel(req.body);
    const savedData = await newData.save();
    res.json(savedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los registros
app.get('/api/data', async (req, res) => {
  try {
    const allData = await DataModel.find();
    res.json(allData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un registro por ID
app.get('/api/data/:id', async (req, res) => {
  try {
    const data = await DataModel.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un registro por ID
app.put('/api/data/:id', async (req, res) => {
  try {
    const updatedData = await DataModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un registro por ID
app.delete('/api/data/:id', async (req, res) => {
  try {
    await DataModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Registro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
