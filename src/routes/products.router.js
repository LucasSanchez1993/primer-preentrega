const ProductManager = require('../manager/ProductManager');

const path = require('path')

const Router = require('express').Router;

function getProducts() {
    if (fs.existsSync(prodManager)) {
        return JSON.parse(fs.readFileSync(prodManager, 'utf-8'))
    } else {
        return []
    }
}

function saveProducts(products) {
    fs.writeFileSync(prodManager, JSON.stringify(products, null, 5))
}

const router = Router()

let prodManager = new ProductManager(path.join(__dirname, '..', 'data', 'products.json'));
prodManager.addProduct('arroz', 'blanco', 1000, 'img1', 1, 50);
prodManager.addProduct('leche', 'entera', 500, 'img2', 2, 30);
prodManager.addProduct('azucar', 'blanca', 1100, 'img3', 3, 45);

console.log("Hola");
console.log("Estos son los productos:", prodManager.getProducts());
console.log("Mi producto con ID 2 es:", prodManager.getProductById(2));

prodManager.updateProduct(1, 'garbanzo');
prodManager.deleteProduct(2);


router.get('/', (req, res) => {

    // agregue aquí debajo el prodManager.getProducts
    let products = prodManager.getProducts()
    let resultado = products

    if (req.query.limit) {
        resultado = resultado.slice(0, req.query.limit)
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ filtros: req.query, resultado });
})

router.get('/:id', (req, res) => {

    let id = req.params.id;
    id = parseInt(id);
    if (isNaN(id)) {

        return res.send('Error, ingrese un número entero');
    }

    let resultado = prodManager.getProductById(id);

    res.setHeader('Content-Type', 'application/json');

    res.status(200).json({ resultado });
});

router.post('/', (req, res) => {
    let { title, description, price, thumbnail, code, stock } = req.params

    if (!title || !description || !price || !code || !stock) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Title, description, price, code, stock son datos obligatorios` })
    }

    let products = getProducts()
    let existe = products.find(product => product.title === title && product.code === code)
    if (existe) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El Producto ${title} ${code} ya existe en BD` })
    }

    let id = 1
    if (products.length > 0) {
        id = products[products.length - 1].id + 1
    }

    let newProduct = {
        id, title, description, price, thumbnail, code, stock
    }

    products.push(newProduct)

    saveProducts(products);

    res.setHeader('Content-Type', 'application/json');
    return res.status(201).json({ newProduct });

})

router.put('/:id', (req, res) => {
    let { id } = req.body
    id = parseInt(id)
    if (isNaN(id)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Indique un id numérico` })
    }

    let products = getProducts()
    let indiceProducts = products.findIndex(product => product.id === id)
    if (indiceProducts === -1) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No existen producto con id ${id}` })
    }

    let propiedadesPermitidas = ["title", "descripton", "price", "thumbnail", "code", "stock"]
    let propiedadesQueLlegan = Object.keys(req.body)
    console.log(propiedadesQueLlegan)
    let valido = propiedadesQueLlegan.every(propiedad => propiedadesPermitidas.includes(propiedad))
    if (!valido) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No se aceptan algunas propiedades`, propiedadesPermitidas })
    }

    let productModificado = {
        ...products[indiceProducts],
        ...req.body,
        id
    }

    products[indiceProducts] = productModificado

    saveProducts(products)

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        productModificado
    });

})

router.delete('/:id', (req, res) => {
    let { id } = req.params

    id = parseInt(id)
    if (isNaN(id)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Indique un id numérico` })
    }

    let products = getProducts()
    let indiceProducts = products.findIndex(product => product.id === id)
    if (indiceProducts === -1) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No existen producto con id ${id}` })
    }

    let ProductoEliminado = products.splice(indiceProducts,1)

    saveProducts(usuarios)
    
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        ProductoEliminado
    });
})

module.exports = router

