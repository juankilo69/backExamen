const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        required: true,
        enum: ["ADMIN","USER"]
    }
})

const User = mongoose.model("User", userSchema)

//Registrar Usuarios
User.create = async function(newUser, result){
    await newUser.save()
    .then(function(data){
        result(data, null)
    }).catch(function(err){
        result(null, err)
    })
}

//Auxiliar para Login
User.findByUsername = async function(username_param, result){
    const userFound = await User.findOne({ username: username_param})
    if(userFound){
        result(userFound,null)
    }else{
        result(null, {"err":"No hay usuarios con ese username"})
    }
}

module.exports = User