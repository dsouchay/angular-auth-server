const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middelwares/validar-campos');
const { validarJWT } = require('../middelwares/validar-jwt');
const router = Router();
//Crear nuevo usuario
router.post('/new', [
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'El email es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatorio').isLength({ min: 6 }),
  validarCampos
], crearUsuario);
//Login de Usuario
router.post('/', [
  check('email', 'El email es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatorio').isLength({ min: 6 }),
], loginUsuario);
//Validar y revalidar token
router.get('/renew', validarJWT,revalidarToken);
//Exporto así porque es node que no está con typescript, puedo exportar variables, objetos,...
module.exports = router;