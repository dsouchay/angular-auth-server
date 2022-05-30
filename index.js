const { application } = require("express");
const express = require('express');
const cors = require('cors');
const path = require('path');


const { dbConnection } = require("./db/config");
require('dotenv').config();
// Crear el servidor / aplicacion de express
const app = express();
//Conexion a la BD
dbConnection();
//Directorio Público
app.use(express.static('public'));
//Middelware express, funcion que se ejecuta cdo el interprete pasa evaluando determinadas lineas de código
//Cors
app.use(cors());
//lectura y parseo del body
app.use(express.json());
//Rutas
app.use('/api/auth', require('./routes/auth'));

//Manejar demás rutas
app.get('*', (req,res)=>{
  res.sendFile(path.resolve(path.resolve(__dirname,'public/index.html')));

})


app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${ process.env.PORT }`);
})