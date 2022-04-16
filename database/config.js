const mongoose = require('mongoose');

const dbConnection = async () => {

        try {
            // console.log('init db config joder')
           await mongoose.connect(process.env.DB_CNN);

            console.log('DB Online');
        } catch (error) {
            console.log(error);
            throw new Error('Error en la base de datos - Hable con el Admin');
        }
}


// exportar
module.exports ={
    dbConnection
}