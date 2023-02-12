const express = require("express") //npm i express
const app = express()
const path = require("path") //npm i path
const userRouters = require("./routes/user.routes")
const port = process.env.PORT || 3000
const session = require("express-session")
const mongoose = require("mongoose")

//MW Session
app.use(session({ secret:"pwdsession" }))


//Aceptar BODY con JSON
app.use(express.urlencoded({extended:true}))
app.use(express.json())
//Vistas
app.set("views",path.join(__dirname,"views"))
app.set("view engine", "ejs") //npm i ejs

//MVC - utilizar las rutas
app.use("/users",userRouters)

//MW - Manejador de errores general

//Levantar el server
app.listen(port,()=>{
    console.log("Escuchando en puerto..." + port)    
    mongoose.set("strictQuery", false)
    mongoose.connect("mongodb://127.0.0.1:27017/loginDemo")
    .then(()=>{
        console.log("Conectado a MongoDB")
    })
    .catch(err => {
        console.log("ERROR. Desc: " + err)
    })
})



