const CartManager = require('../manager/CartsManager')


const path = require('path')

const Router = require('express').Router;

function getCarts() {
    if (fs.existsSync(CartManager)) {
        return JSON.parse(fs.readFileSync(CartManager, 'utf-8'))
    } else {
        return []
    }
}

function saveCarts(carts) {
    fs.writeFileSync(CartManager, JSON.stringify(carts, null, 5))
}

const router = Router()

router.get('/:id', (req, res)=>{
    let id = req.params.id;
    id = parseInt(id);
    if (isNaN(id)) {

        return res.send('Error, ingrese un número entero');
    }

    let resultado = cartsManager.getCartsbyId(id);

    res.setHeader('Content-Type', 'application/json');

    res.status(200).json({ resultado });
})


module.exports = router