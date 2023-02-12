const UserModel = require("../models/user")
const bcrypt = require("bcrypt") //npm i bcrypt

const usuarios = ["mike","juanki","montero","carmen","shyne"]

exports.showSecret = function(req,res){    
    res.render("secret.ejs")
}

exports.showList = function(req,res){
    //res.locals.userLogued = req.session.userLogued
    res.render("users.ejs", {usuarios, userLogued:req.session.userLogued})
}

exports.showLogin = function(req,res){
    res.render("login.ejs")
}

exports.showRegister = function(req,res){
    res.render("register.ejs")
}

exports.register = async function(req,res){
    const newUser = new UserModel(req.body)    
    newUser.password = await bcrypt.hash(newUser.password, 12)
    await UserModel.create(newUser,function(userCreated,err){
        if(err){
            res.status(500).json(err)
        }else{
            res.status(200).json(userCreated)
        }
    })
}

exports.login = async function(req,res){
    const { username, password } = req.body   

    const pwd_textoPlano = password
    let userFoundData = null

    await UserModel.findByUsername(username,function(userFound,err){
        if(err){
            res.status(500).json(err)
        }else{
            userFoundData = userFound
        }
    })

    if(userFoundData){
        const validado = await bcrypt.compare(pwd_textoPlano,userFoundData.password)
        if(validado){
            req.session.userLogued = userFoundData
            res.status(200).json(userFoundData)
        }else{
            res.status(401).json({"err":"Usuario y/o contraseña no correctos"})
        }
    }

}