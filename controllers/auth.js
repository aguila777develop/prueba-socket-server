const { response } = require('express');
// const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { json } = require('express/lib/response');



const crearUsuario = async (req, res = response ) => {
// validacion del correo que no se repita

const { email, password } = req.body;

try {

    // VALIDACION SI EXISTE EL EMAIL EN LA DB
    const existeEmail = await Usuario.findOne({ email});
    if(existeEmail){
        return res.status(400).json({
            ok:false,
            msg:'El correo ya esta registrado'
        });
    }

    const usuario = new Usuario( req.body);

    // Encriptamos la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

// para grabar en la base de datos
    await usuario.save();

    // Generar mi JWT
    const token = await generarJWT( usuario.id );

    res.json({
        ok:true,
        usuario,
        token
        // body: req.body
    });

} catch (error) {
    console.log(error);
    res.status(500).json({
        ok:false,
        msg: 'Hable con el administrador'
    });
    
}

}


// Login
const login = async ( req, res = response ) => {

    const { email, password } = req.body;

   try {

    // VALIDACION SI EXISTE EL EMAIL EN LA DB
    const usuarioDB = await Usuario.findOne({ email});
    if(!usuarioDB){
        return res.status(404).json({
            ok:false,
            msg:'Credenciales Incorrectas vueva a intentar'
        });
    }
    // validamos el password introducido con el de la DB
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);

    if(!validPassword){
        return res.status(400).json({
            ok:false,
            msg:'Credenciales son Incorrectas'
        });
    }

    // Si todo esta OK hay q generar el JWT
    const token = await generarJWT(usuarioDB.id);

    res.json({
        ok:true,
        usuario: usuarioDB,
        token
        // body: req.body
    });



   } catch (error) {
       console.log(error);
       return res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
    })
   }

}

const renewToken = async ( req, res= response) =>{


    const uid = req.uid;

    // generar un nuevo JWT
    const token = await generarJWT(uid);

    const usuario  = await Usuario.findById(uid);
    res.json({
        ok: true,
        usuario,
        token
//        uid: req.uid
    })
}


module.exports = {
    crearUsuario,
    login,
    renewToken
}