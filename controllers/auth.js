const { response } = require('express');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async(req, res = response) => {
  const { email, name, password } = req.body;
  try {
    //Verificar que no exista el email
    const usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario ya existe con ese email'
      });
    }
    console.log(req);

    //Crear usuario con el modelo
    const dbUser = new Usuario(req.body);
    //Hashear la contraseña
    const salt = bcrypt.genSaltSync();
    dbUser.password = bcrypt.hashSync( password, salt);
    console.log(dbUser);

    //General el JWT
    const token = await generarJWT(dbUser.id, name);


    //Crear usuario en BD
    await dbUser.save();
    //Generar respuesta exitosa
    return res.status(201).json({
      ok: true,
      name,
      uid: dbUser.id,
      token
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
  return res.json({
    ok: true,
    msg: 'Crear usuario /new'
  });
}
const loginUsuario = async(req, res) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped()
    })
  }
  const { email, password } = req.body;
try {

  const dbUser = await Usuario.findOne({ email });

  if ( !dbUser ){
    return res.status(400).json({
      ok: false,
      msg: 'El correo no existe'
    });
  }
//Confirmar si el password hace match

const validPassword = bcrypt.compareSync(password,dbUser.password);
if (!validPassword){
  return res.status(400).json({
    ok: false,
    msg: 'El password no es válido'
  });
}

//Generar el JWT

const token = await generarJWT(dbUser.id , dbUser.name);

//Respuesta del servicio
res.json({

  ok: true,
  uid: dbUser.id,
  name: dbUser.name,
  token
});


} catch (error){
  console.log(error);
  return res.status(500).json({
    ok: false,
    msg: 'Hable con el administrador'
  })
}

}
const revalidarToken = async (req, res) => {

  const { name, uid } = req || {};

  const newToken = await generarJWT(uid,name);

  return res.json({
    ok: true,
    msg: 'Renew',
    name,
    uid,
    token:newToken
  });
}
module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken
}