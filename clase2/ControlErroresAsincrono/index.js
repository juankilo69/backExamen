const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const AppError = require("./AppError")

const Product = require('./models/product');

mongoose.connect('mongodb://127.0.0.1:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))



const categories = ['fruit', 'vegetable', 'dairy'];

function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(e => next(e))
    }
}

app.get('/products', wrapAsync(async (req, res, next) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category })
        res.render('products/index', { products, category })
    } else {
        const products = await Product.find({})
        res.render('products/index', { products, category: 'All' })
    }
}))

app.get('/products/new', (req, res) => {
    //throw new AppError("No estás autorizado", 401)
    res.render('products/new', { categories })
})

app.post('/products', wrapAsync(async (req, res, next) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`)
}))

app.get('/products/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    if(!product){
        //return next(new AppError("Producto no encontrado", 404))
        throw new AppError("Producto no encontrado", 404)
    }
    res.render('products/show', { product })
}))

app.get('/products/:id/edit', wrapAsync(async (req, res, next) => {
    //try{
        //let { id } = req.params;
        //id = "63becee71ed25d304447b200123213132"
        const { id } = req.params
        const product = await Product.findById(id);
        if(!product){
            throw new AppError("Producto no encontrado", 404)
        }
        res.render('products/edit', { product, categories })    
    /*} catch(e){
        next(e)
    }*/
}))

app.put('/products/:id', wrapAsync(async (req, res,next) => {
    const { id } = req.params;
    req.body.category = "aaaaaa"
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${product._id}`);
}))

app.delete('/products/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
}))

//Middleware de tratamiento general de errores
app.use((err,req,res,next)=>{
    let { status = 500, message = "FALLO GENERAL"} = err
    console.log(err.name);
    if(err.name === "CastError"){
        status = 905
    } else if (err.name === "ValidationError"){
        status = 400
    }

    
    res.status(status).send(message)
    //res.render("error.ejs", { err })
    //throw new AppError(message,405)
})

//-----------------------------
app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})


