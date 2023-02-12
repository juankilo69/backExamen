const logger = require("../logger")

function verificar(req, res, next){
    const { pass } = req.query
    if(pass==="2daw"){
        next()
    }else{
        logger.error.fatal("Contraseña incorrecta")
        res.send("NO TIENES PERMISOS DE ACCESO")        
    }
}

module.exports = verificar