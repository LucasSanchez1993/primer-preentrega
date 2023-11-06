const fs = require('fs');

class CartManager {
    constructor(rutaArchivo) {
        this.path = rutaArchivo;
        this.carts = [];

        if (fs.existsSync(this.path)) {
            const fileData = fs.readFileSync(this.path, 'utf-8');
            this.carts = JSON.parse(fileData);
        }
    }

    getCarts(){
        return this.carts;
    }
    addCarts(cart){
        this.carts.push(cart);
    }
    getCartsbyId(cartId){
        return this.carts.find(cart => cart.id === cartId);
    }
    getCartsProducts(cartId){
        const cart = this.getCartsbyId(cartId);
    return cart ? cart.products : [];
    }
    addProductsToCart(cartId, products){
        const cart = this.getCartsbyId(cartId);
    if (cart) {
        cart.products = cart.products.concat(products);
    }
    }
    deleteProductInCart(cartId, productId){
        const cart = this.getCartsbyId(cartId);
    if (cart) {
        cart.products = cart.products.filter(product => product.id !== productId);
    }
    }
    emptyCart(cartId){
        const cart = this.getCartsbyId(cartId);
        if (cart) {
            cart.products = [];
    }
}
}

module.exports=CartManager

