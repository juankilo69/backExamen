const { application } = require("express")
const express = require("express")
const { hasUncaughtExceptionCaptureCallback } = require("process")
const app = express()
const port = process.env.port || 3000
const AppError = require("./AppError")

function verificar(req,res,next){
    const { pass } = req.query
    if(pass==="2daw"){
        next()
    }
    //res.send("Contraseña errónea")
    throw new AppError("Contraseña errónea", 401)
}

app.get("/",(req,res)=>{
    res.send("Hola")
})

app.get("/error",(req,res)=>{
    hola.hello()
})

app.get("/secreto", verificar, (req,res)=>{
    res.send("LISTA SECRETA")
})

app.get("/admin", (req,res)=>{    
    throw new AppError("No eres Administrador", 403)
})

//Controlar rutas no existentes
app.use((req,res)=>{
    throw new AppError("Ruta no existente", 404)
})

//Middleware para el trato general de errores
app.use((err,req,res,next)=>{
    const { status = 500, message = "FALLO GENERAL"} = err
    console.log("FALLO GENERAL");
    res.status(status).send(message)
})

//------------------------------------------------------
app.listen(port, ()=>{
    console.log(`Escuchando en ${port}`)
})