/* 
path: api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');


const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

// crear usuario
router.post('/new',[
    check('nombre',' El nombre es Obligatorio').not().isEmpty(),
    check('password',' La contraseña es Obligatorio').not().isEmpty(),
    check('email',' El correo electronico es Obligatorio').isEmail(),
    validarCampos
], crearUsuario);


//login
router.post('/',[
    check('email',' El correo electronico es Obligatorio').isEmail(),
    check('password',' La contraseña es Obligatorio').not().isEmpty(),
    
], login );

// Renovar Token

router.get('/renew', validarJWT, renewToken );









module.exports = router;
