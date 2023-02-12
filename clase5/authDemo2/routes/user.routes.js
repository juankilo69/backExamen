const UserController = require("../controllers/user.controller")
const express = require("express")
const router = express.Router()

const requireLogin = (req,res,next) => {
    //console.log(req.session.userLogued)
    if(req.session.userLogued){
        next()
    }else{
        res.status(401).json({"err":"Usuario no logueado"})
    }    
}

const requireAdmin = (req,res,next) => {
    if(req.session.userLogued && req.session.userLogued.profile == "ADMIN"){
        next()
    }else{
        res.status(401).json({"err":"Usuario no administrador"})
    }
}

//Cargar la vista de registro
router.get("/", UserController.showRegister)
//Crear/Registrar usuario
router.post("/", UserController.register)

//Cargar la vista de login
router.get("/login", UserController.showLogin)
//Autenticar
router.post("/login",UserController.login)

//Cargar la vista de Usuarios
router.get("/list",requireLogin, UserController.showList)
router.get("/secret",requireAdmin, UserController.showSecret)

module.exports = router