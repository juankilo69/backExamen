const express = require("express")
const app = express()
const jwt = require("jsonwebtoken") //npm i jsonwebtoken
const port = 3000
const claveJWT = "klasjdfñlkajsdfñlkajsdñlf"
const path = require("path")
const session = require("express-session")

const usuarioBBDD = {
    user:"admin",
    pwd:"admin"
}

//EJS
app.set("views",path.join(__dirname, "views"))
app.set("view engine", "ejs")
//Paso de datos BODY
app.use(express.urlencoded({extended:true}))
//Session
app.use(session({secret:"mipwddesession"}))

function extractToken(req){
    console.log(req.headers.authorization)
    if(req.headers.authorization && req.headers.authorization.split(" ")[0] == "Bearer"){
        //Bearer kalñsdjkfalñksdjflñaksjdflñkajsdflñkajsdñfkl
        return req.headers.authorization.split(" ")[1]        
    }else if (req.session && req.session.token){
        return req.session.token
    } else if (req.query && req.query.token){
        return req.query.token
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



app.get("/",(req,res)=>{
    res.status(200).json({msg:"Home Page sin autenticar"})
})

app.get("/login",(req,res)=>{
    const { msg="" } = req.query    
    res.render("login.ejs", { msg })
})

app.post("/login",(req,res)=>{    
    const { usuario, pwd } = req.body

    if(usuario == usuarioBBDD.user && pwd == usuarioBBDD.pwd){
        //Usuario existente en BBDD
        const token = jwt.sign({check:true},claveJWT,{
            expiresIn: 1440 //min --> 24h
        })
        req.session.token = token
        console.log(token)
        //res.status(200).json({ token: token })
        res.redirect("/paises")
    }else{
        res.status(401).json({ msg: "Usuario y/o contraseña incorrectos"})
    }
})

app.post("/logout",(req,res)=>{
    const token = extractToken(req)
    if(token){
        jwt.sign(token,claveJWT,{ expiresIn: 1}, (logout,err)=>{
            if(logout){
                if(req.session && req.session.token){
                    req.session.destroy() //Eliminar todo el objeto session
                    //req.session.token = null
                }                
                //res.status(200).json({msg:"Desconectado con éxito"})
                res.redirect("/login?msg=Desconectado con éxito")
            }else{
                res.status(500).json({msg:err})
            }
        })
    }else{
        res.status(401).json({msg:"No existe el token"})
    }
})

app.get("/paises", requireJWT, (req,res) => {
    const paises = ["Spain","USA","UK"]
    //res.status(200).json(paises)
    res.render("paises.ejs", { paises })
})

//----------------
app.listen(port,()=>{
    console.log("Escuchando en... " + port)
})