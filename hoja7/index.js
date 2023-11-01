const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 80;
const SECRET_KEY = '123'; // Reemplaza con una clave segura en un entorno de producción

// Conexión a MongoDB
mongoose.connect('mongodb+srv://userUMG:123@cluster0.ifyymt4.mongodb.net/hoja7', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conectado a MongoDB');
});

// Definir el esquema del modelo
const usuarioSchema = new mongoose.Schema({
  usuario: String,
  clave: String,
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

// Middleware para el análisis del cuerpo de la solicitud
app.use(bodyParser.json());

// Endpoint para el inicio de sesión (POST)
app.post('/proyecto/login/:DPI', async (req, res) => {
  const { usuario, clave } = req.body;
  const DPI = req.params.DPI;

  // Verificar las credenciales en MongoDB
  const usuarioEncontrado = await Usuario.findOne({ usuario, clave, DPI });

  if (usuarioEncontrado) {
    // Generar un token JWT
    const token = jwt.sign({ usuario: usuarioEncontrado.usuario }, SECRET_KEY);
    res.json({ token });
  } else {
    res.status(401).json({ mensaje: 'Credenciales inválidas' });
  }
});

// Middleware para verificar el token en las solicitudes GET
app.use((req, res, next) => {
  const token = req.headers.token;

  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ mensaje: 'Token inválido' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).json({ mensaje: 'Token no proporcionado' });
  }
});

// Endpoint para obtener datos (GET)
app.get('/proyecto/data', (req, res) => {
  const usuario = req.decoded.usuario;

  // Obtener datos desde MongoDB
  Usuario.findOne({ usuario }, (err, data) => {
    if (err) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    } else {
      res.json(data);
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
