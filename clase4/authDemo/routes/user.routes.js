const UserController = require("../controllers/user.controller")
const express = require("express")
const router = express.Router()

//Cargar la vista de registro
router.get("/", UserController.showRegister)
//Crear/Registrar usuario
router.post("/", UserController.register)

//Cargar la vista de login
router.get("/login", UserController.showLogin)
//Autenticar
router.post("/login",UserController.login)

module.exports = router