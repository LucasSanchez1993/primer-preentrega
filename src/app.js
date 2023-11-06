
const express = require ('express');
const productsRouter=require('./routes/products.router')

const PORT = 8080;

const app = express();

app.use('/api/products', productsRouter)


app.get('/bienvenida',(req, res)=>{

    res.setHeader("Content-Type","text/html")
    res.send("<h2 style='color:orange;'>Hola profe!!!</h2>")
})


const server = app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});
