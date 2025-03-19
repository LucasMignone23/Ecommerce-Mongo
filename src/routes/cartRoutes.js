import express from "express";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

const router = express.Router();

// Ruta para agregar un producto al carrito
router.post("/:cartId/add", async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await Cart.findById(req.params.cartId);
    const product = await Product.findById(productId);

    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

    // Verifica si el producto ya está en el carrito
    const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
    if (productIndex >= 0) {
      // Si el producto ya está en el carrito, actualiza la cantidad
      cart.products[productIndex].quantity += parseInt(quantity);
    } else {
      // Si el producto no está en el carrito, agrégalo
      cart.products.push({ product: productId, quantity: parseInt(quantity) });
    }

    await cart.save();
    res.redirect(`/cart/${cart._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar producto al carrito');
  }
});

// Ruta para eliminar un producto del carrito (usando DELETE)
router.delete("/:cartId/product/:productId", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }
    cart.products = cart.products.filter(item => item.product.toString() !== req.params.productId);
    await cart.save();
    res.json({ status: "success", cart });  // Responde con el carrito actualizado
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar producto del carrito');
  }
});

// Ruta para vaciar el carrito (usando DELETE)
router.delete("/:cartId", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }
    cart.products = [];
    await cart.save();
    res.json({ status: "success", cart });  // Responde con el carrito vacío
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al vaciar el carrito');
  }
});

  

export default router;
