const express = require("express")
const app = express()
const path = require("path")
const axios = require("axios") //npm i axios@0.21
const session = require("express-session")
const port = process.env.PORT || 3000
const clientID = "41d457574425db8c97c1"
const clientSecret = "b4f3ce7b6526d9f8e0eb7f8173c795e86c0ce65b"

app.use(session({secret:"contraseñasession"}))

app.set("views",path.join(__dirname,"views"))
app.set("view engine", "ejs")

app.use(express.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.render("index.ejs")
})

app.get("/auth",(req,res)=>{
    res.redirect(
        `https://github.com/login/oauth/authorize?client_id=${clientID}`
    )
})

app.get("/oauth-callback",(req,res)=>{
    //console.log(req.query)
    const { code } = req.query
    const body = {
        client_id: clientID,
        client_secret: clientSecret,
        code: code
    }
    const opts = { headers: { accept: "application/json" }}
    axios
        .post("https://github.com/login/oauth/access_token",body,opts)
        .then((_res)=>_res.data.access_token)        
        .then((token)=>{
            console.log(token)
            res.redirect("/?token=" + token)
        })
        .catch((err)=>{
            res.status(500).json({err:err.message})
        })
})      

//--------------------------------------------
app.listen(port,()=>{
    console.log("Escuchando... " + port)
})
