const express = require("express")
const app = express()
const port = process.env.port || 3000
const cookieParser = require("cookie-parser") //npm i cookie-parser
const session = require("express-session") //npm i express-session
const path = require("path")

const sessionOptions = { 
    secret: "passwordforsession"
}
app.use(session(sessionOptions))

app.use(cookieParser("passwordforcookies"))

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(express.urlencoded({extended:true}))

app.get("/",(req,res)=>{

    if(req.session.count){
        req.session.count++
    }else{
        req.session.count=1
    }

    res.status(200).send(`Visita número ${req.session.count}`)
})

app.get("/register",(req,res)=>{
    const { username = "Anonymous", color = "white", colorCookie = "black" } = req.query
    req.session.username = username
    req.session.color = color
    res.cookie("colorCookie", colorCookie, { signed: true })
    res.redirect("/greet")
})

app.get("/greet",(req,res)=>{
    const { username, color } = req.session
    const { colorCookie } = req.signedCookies
    //res.send(`Bienvenido ${username}. Tus colores favoritos son ${color} y ${colorCookie}`)

    res.locals.username = username
    res.locals.color = color
    res.locals.colorCookie = colorCookie

    res.render("greet.ejs")    
})

app.get("/addCookie",(req,res)=>{
    res.cookie("ejemplo","Nueva cookie")    
    res.cookie("ejemplo2","Nueva cookie 2")    
    res.cookie("ejemplo3","Nueva cookie 3")
    res.cookie("ejemploFirmado","Nueva cookie 4", { signed: true })
    res.send("Cookie Añadida")
})

app.get("/showCookies",(req,res)=>{
    //res.send(req.cookies)
    res.send(req.signedCookies)
})

//-------------------
app.listen(port, ()=>{
    console.log(`Escuchando en ${port}`);
})