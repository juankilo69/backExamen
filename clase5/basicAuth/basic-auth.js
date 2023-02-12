
module.exports = basicAuth

async function basicAuth(req,res,next){
    console.log(req.headers.authorization)
    if(req.headers.authorization){
        const base64Auth = req.headers.authorization.split(" ")[1]
        console.log(base64Auth)
        const authDes = Buffer.from(base64Auth,"base64").toString("ascii")
        console.log(authDes)
        const [ username, password ] = authDes.split(":")
        /*const username = authDes.split(":")[0]
        const password = authDes.split(":")[1]*/
        console.log(username)
        console.log(password)

        //"compare" con usuarios de la BBDD
        if(username == "admin" && password == "admin"){
            next()
        }else{
            res.status(401).json({ msg:"Credenciales inválidas" })
        }


        
    }
    
}