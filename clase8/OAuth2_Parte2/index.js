require('dotenv').config(); //Poder usar variables de entorno en archivo ".env"
const config = require("./config.json") //Poder usar otras variables de configuración en JSON
const express = require("express")
const app = express()
const path = require("path")
const axios = require("axios") //npm i axios@0.21
const session = require("express-session")
const port = process.env.PORT || config.port_app
const clientID = process.env.GITHUB_CLIENT_ID
const clientSecret = process.env.GITHUB_SECRET

app.use(session({secret:process.env.SESSION_SECRET}))

app.set("views",path.join(__dirname,"views"))
app.set("view engine", "ejs")

app.use(express.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    const token = extractToken(req)    
    console.log("token: " + token);
    
    console.log(req.session.login)
    res.locals.login = req.session.login || "<Anónimo>"    
    res.locals.token = token
    res.render("index.ejs")
})

app.get("/auth",(req,res)=>{
    res.redirect(
        `https://github.com/login/oauth/authorize?client_id=${clientID}`
    )
})

app.get("/oauth-callback",async(req,res)=>{
    //console.log(req.query)
    const { code } = req.query
    const body = {
        client_id: clientID,
        client_secret: clientSecret,
        code: code
    }
    let access_token = null
    const opts = { headers: { accept: "application/json" }}
    await axios
        .post("https://github.com/login/oauth/access_token",body,opts)
        .then((_res)=>_res.data.access_token)        
        .then((token)=>{                        
            req.session.token = token
            access_token = token
        })
        .catch((err)=>{
            res.status(500).json({err:err.message})
        })
    
    if(access_token != null){
        console.log("access-token: " + access_token)
        const user = await axiosGitUser(access_token, req, res)
        console.log(user.login)        
        req.session.login = user.login
        req.session.gitHubId = user.id
        console.log("token session: " + req.session.token);        
        //res.redirect("/?token=" + access_token)
        res.redirect("/")
    }else{
        res.status(500).json({err:"No hay token"})
    }
})      

//Obtener información del usuario
async function axiosGitUser(token){   
    const request = await axios("https://api.github.com/user", {
        headers: {
          Authorization: "token " + token
        }
      });
      return await request.data;
}

function extractToken (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'token') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    } else if (req.session && req.session.token){
        return req.session.token
    }
    return null;
  }

function requireToken(req,res,next){
    const token = extractToken(req)
    const gitHubId = req.session.gitHubId || "sin ID de GitHub"    
    if(token && consultarID_BBDD(gitHubId)){
        next()
    }else{
        res.status(404).json({msg:"No estás autorizado " + gitHubId})
    }
}

function consultarID_BBDD(gitHubId){
    //OPCIONAL - Por si queremos tener un registro de usuarios de GitHub autorizados en nuestra BBDD
    if(gitHubId == "123556622"){
        return true
    }else{
        return false
    }
}

app.get("/datos", requireToken, (req,res)=>{
    res.status(200).json({msg:`AUTORIZADO CON GITHUB ID: ${req.session.gitHubId}!`})
})

//--------------------------------------------
app.listen(port,()=>{
    console.log("Escuchando... " + port)
})
