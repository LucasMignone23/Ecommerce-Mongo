import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

export const getCart = async (req, res) => {
  const cart = await Cart.findById(req.params.id).populate("products.product");
  res.json({ status: "success", payload: cart });
};

export const addToCart = async (req, res) => {
  const { id } = req.params;
  const { productId, quantity } = req.body;

  let cart = await Cart.findById(id);
  if (!cart) {
    cart = new Cart({ products: [] });
  }

  const productIndex = cart.products.findIndex((item) => item.product.toString() === productId);

  if (productIndex > -1) {
    cart.products[productIndex].quantity += quantity;
  } else {
    cart.products.push({ product: productId, quantity });
  }

  await cart.save();
  res.json(cart);
};

export const removeFromCart = async (req, res) => {
  const { id, productId } = req.params;
  const cart = await Cart.findById(id);

  if (!cart) {
    return res.status(404).json({ message: "Carrito no encontrado" });
  }

  cart.products = cart.products.filter((item) => item.product.toString() !== productId);

  await cart.save();
  return res.json({ status: "success", cart: cart });  // Devolvemos el carrito actualizado
};

export const clearCart = async (req, res) => {
  const { id } = req.params;
  const cart = await Cart.findById(id);

  if (!cart) {
    return res.status(404).json({ message: "Carrito no encontrado" });
  }

  cart.products = [];  // Limpiar los productos del carrito
  await cart.save();
  return res.json({ status: "success", cart: cart });  // Devolvemos el carrito vacío
};
