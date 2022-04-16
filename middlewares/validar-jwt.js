

const jwt = require('jsonwebtoken');


const validarJWT = (req, res, next) => {
    // leer el Token del header

    const token = req.header('x-token');

    // console.log(token);
    if(!token){
        return res.status(401).json({
            ok:false,
            msg: 'No hay token en la peticion'
        });
    }

    try {
        const { uid } = jwt.verify( token, process.env.JWT_KEY);
        req.uid = uid;
        // validamos el token
               
        next();
    } catch (error) {
        return res.status(401).json({
            ok:false,
            msg: 'Token no valido'
        });
    }


}


module.exports = {
    validarJWT
}