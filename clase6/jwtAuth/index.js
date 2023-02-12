const express = require("express")
const app = express()
const jwt = require("jsonwebtoken") //npm i jsonwebtoken
const port = 3000
const claveJWT = "klasjdfñlkajsdfñlkajsdñlf"

const usuarioBBDD = {
    user:"admin",
    pwd:"admin"
}

function extractToken(req){
    if(req.headers.authorization && req.headers.authorization.split(" ")[0] == "Bearer"){
        //Bearer kalñsdjkfalñksdjflñaksjdflñkajsdflñkajsdñfkl
        return req.headers.authorization.split(" ")[1]        
    }
    return null
}

const requireJWT = (req,res,next) => {
    const token = extractToken(req)
    if(token){
        jwt.verify(token, claveJWT, (err,token_decod) => {
            if(err){
                res.status(401).json({msg:err})        
            }else{ 
                console.log(token_decod)               
                next()
            }
        })
    }else{
        res.status(401).json({msg:"No existe el token"})
    }
}

app.use(express.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.status(200).json({msg:"Home Page sin autenticar"})
})

app.post("/login",(req,res)=>{
    const { usuario, pwd } = req.body

    if(usuario == usuarioBBDD.user && pwd == usuarioBBDD.pwd){
        //Usuario existente en BBDD
        const token = jwt.sign({check:true},claveJWT,{
            expiresIn: 1440 //min --> 24h
        })
        res.status(200).json({ token: token })
    }else{
        res.status(401).json({ msg: "Usuario y/o contraseña incorrectos"})
    }
})

app.get("/paises", requireJWT, (req,res) => {
    const paises = ["Spain","USA","UK"]
    res.status(200).json(paises)
})

//----------------
app.listen(port,()=>{
    console.log("Escuchando en... " + port)
})