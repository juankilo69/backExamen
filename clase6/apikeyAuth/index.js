const { generateApiKey } = require("generate-api-key") //npm i generate-api-key
const express = require("express")
const app = express()
const port = 3000
const maxUsos = 10

let users = []
const paises = ["Spain","UK","USA","Italy"]
//---------------------------------
const crearUsuario = (username) => {    
    const hoy = new Date().toISOString().split("T")[0]
    let usuarioNuevo = {
        _id: Date.now(),
        username: username,
        api_key: generateApiKey(),
        uso: [{
            fecha:hoy,
            cont:0
        }]        
    }
    users.push(usuarioNuevo)
    return usuarioNuevo
}

/*
    {
        username: "Mike",
        api_key: "askjdflajsdñflkajsdñlf"
        uso: [
            {
                fecha: 2023-25-01,
                cont: 7
            },
            {
                fecha: 2023-26-01,
                cont: 8
            },
            {
                fecha: 2023-27-01,
                cont: 1
            }
        ]

    }
*/

const requireApiKey = (req,res,next) => {
    const apiKey = req.header("x-api-key")
    console.log(apiKey)
    const userFound = users.find((u) => u.api_key == apiKey)
    if(userFound){
        const fechaServidor = new Date().toISOString().split("T")[0]
        const indexUsoHoy = userFound.uso.findIndex((dia) => dia.fecha == fechaServidor)
        if(indexUsoHoy >= 0){
            if(userFound.uso[indexUsoHoy].cont >= maxUsos){
                //Si hemos superado el día de HOY el número de peticiones
                res.status(429).json({msg:"Demasiadas peticiones hoy"})
            }else{
                //Si no hemos superado el día de HOY. Incrementamos
                userFound.uso[indexUsoHoy].cont++
                next()
            }
        }else{
            //Nuevo día
            userFound.uso.push({fecha:fechaServidor, cont:1})
            next()
        }        
    }else{
        res.status(401).json({msg:"No estás autorizado. Sin API KEY"})
    }
}

app.use(express.urlencoded({ extended:true}))

//--------------------------------
app.get("/",(req,res)=>{
    res.status(200).json({msg:"Home Page"})
})

app.get("/users",(req,res)=>{
    res.status(200).json(users)
})

app.get("/paises",requireApiKey,(req,res)=>{
    res.status(200).json(paises)
})

app.post("/register", (req,res)=>{
    const { username } = req.body
    const usuarioNuevo = crearUsuario(username)
    if(usuarioNuevo){
        res.status(201).json(usuarioNuevo)
    }else{
        res.status(500).json({msg:"Error creando el usuario"})
    }
})


//------------
app.listen(port, ()=>{
    console.log("Escuchando... " + port)
})