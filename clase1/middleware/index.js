const express = require("express")
const app = express()
const morgan = require("morgan") //npm i morgan
const verificar = require("./middlewares/verificar.mw")
const logger = require("./logger")
const fs = require("fs")


/*app.use("/secreto",morgan('combined', {
    stream: fs.createWriteStream('./access.log', {flags: 'a'})
}));*/
const anyadirMorgan = morgan('combined', {
    stream: fs.createWriteStream('./access.log', {flags: 'a'})    
})

//app.use(morgan('combined'))

/*function verificar(req, res, next){
    const { pass } = req.query
    if(pass==="2daw"){
        next()
    }else{
        res.send("NO TIENES PERMISOS DE ACCESO")
    }
}*/

app.use(function(req,res,next){
    req.requestTime = Date.now()
    console.log(req.requestTime)
    next()
})

app.use("/adios",function(req,res,next){
    console.log("HAS ENTRADO EN LA RUTA 'ADIOS'")
    next()
})

//app.use("/secreto",verificar)

app.get("/",(req,res)=>{
    res.send("HOLA")
    logger.access.debug("Se ha accedido a la ruta raíz")
})

app.get("/adios",(req,res)=>{
    res.send("ADIOS")
    logger.access.info("Se ha intentado acceder a la ruta ADIOS")
})

app.get("/secreto", verificar, (req,res)=>{
    res.send("ESTE ES EL LISTADO SECRETO")
})

app.listen(3000, ()=>{
    console.log("Escuchando");
    logger.access.debug("Escuchando en puerto 3000")
})