const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 80;


app.use(bodyParser.json());

const ciudadanos = [];//almacenamiento en consula

function validateCiudadanoData(data) {
    if (!data.nombres || !data.apellidos || !data.dpi || !data.fechaNacimiento || !data.estadoCivil) {
        return false;
    }

    const validDpi = /^\d{13}$/.test(data.dpi);
    const validFechaNacimiento = /^\d{4}-\d{2}-\d{2}$/.test(data.fechaNacimiento);

    return (
        validDpi &&
        validFechaNacimiento &&
        data.nombres.length <= 100 &&
        data.apellidos.length <= 100 &&
        data.estadoCivil.length <= 50
    );
}//se validan los datos

app.post('/api/registro/ciudadanos', (req, res) => {
    const ciudadanoData = req.body;
    if (validateCiudadanoData(ciudadanoData)) {
        ciudadanos.push(ciudadanoData);
        res.status(201).json({ message: 'Ciudadano registrado exitosamente.' });
    } else {
        res.status(400).json({ error: 'Datos de ciudadano inválidos.' });
    }
});//creamos al ciudadano

app.put('/api/registro/ciudadanos/:dpi', (req, res) => {
    const dpi = req.params.dpi;
    const ciudadanoData = req.body;
    const index = ciudadanos.findIndex(ciudadano => ciudadano.dpi === dpi);

    if (index !== -1 && validateCiudadanoData(ciudadanoData)) {
        ciudadanos[index] = { ...ciudadanoData, dpi };
        res.json({ message: 'Datos de ciudadano actualizados exitosamente.' });
    } else {
        res.status(400).json({ error: 'No se encontró el ciudadano o los datos son inválidos.' });
    }
});//actualizamos por dpi

app.delete('/api/registro/ciudadanos/:dpi', (req, res) => {
    const dpi = req.params.dpi;
    const index = ciudadanos.findIndex(ciudadano => ciudadano.dpi === dpi);

    if (index !== -1) {
        ciudadanos.splice(index, 1);
        res.json({ message: 'Ciudadano eliminado exitosamente.' });
    } else {
        res.status(404).json({ error: 'No se encontró el ciudadano.' });
    }
});//eliminamos por dpi

app.get('/api/registro/ciudadanos/:dpi', (req, res) => {
    const dpi = req.params.dpi;
    const ciudadano = ciudadanos.find(ciudadano => ciudadano.dpi === dpi);

    if (ciudadano) {
        res.json(ciudadano);
    } else {
        res.status(404).json({ error: 'No se encontró el ciudadano.' });
    }
});//consultamos por dpi

app.get('/api/registro/ciudadanos', (req, res) => {
    res.json(ciudadanos);
});//consultamos todos los cuidadanos

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});//ejecutamos el puerto 80 en consola
