import express from "express";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";

const router = express.Router();
// Ruta para la página de inicio (productos)
router.get("/", async (req, res) => {
  if (!req.session.cartId) {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    req.session.cartId = newCart._id; // Guardamos el cartId en la sesión
  }

  const products = await Product.find();
  res.render("products", { products, cartId: req.session.cartId });
});

// Ruta para la página de productos
router.get("/products", async (req, res) => {
  if (!req.session.cartId) {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    req.session.cartId = newCart._id; // Guardamos el cartId en la sesión
  }

  const products = await Product.find();
  res.render("products", { products, cartId: req.session.cartId });
});

// Ruta para los detalles del producto
router.get("/products/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

    if (!req.session.cartId) {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      req.session.cartId = newCart._id;
    }

    res.render("productDetail", { product, cartId: req.session.cartId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el producto');
  }
});

// Ruta para la vista de carrito
router.get("/cart/:id", async (req, res) => {
  const cartId = req.params.id;
  if (!cartId) {
    return res.status(404).send('Carrito no encontrado');
  }

  try {
    const cart = await Cart.findById(cartId).populate("products.product");
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }
    res.render("cart", { cart, cartId: cartId });  // Aquí pasamos cartId correctamente
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el carrito');
  }
});
// Ruta para eliminar un producto del carrito
router.delete("/api/carts/:cartId/product/:productId", async (req, res) => {
  const { cartId, productId } = req.params;
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    cart.products = cart.products.filter(item => item.product.toString() !== productId);
    await cart.save();
    res.json({ status: "success", cart });  // Responde correctamente con el carrito actualizado
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
});

// Ruta para vaciar el carrito
router.delete("/api/carts/:cartId", async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    cart.products = [];  // Vaciar el carrito
    await cart.save();
    res.json({ status: "success", cart });  // Responde correctamente con el carrito vacío
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al vaciar el carrito' });
  }
});

// Ruta para la página de administración
router.get("/admin", async (req, res) => {
  // Aquí puedes mostrar alguna información de administración, como todos los productos
  const products = await Product.find();
  res.render("admin", { products });
});

export default router;
