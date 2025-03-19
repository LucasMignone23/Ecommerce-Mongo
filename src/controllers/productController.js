import Product from "../models/productModel.js";

/**export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, name, category, sort } = req.query;
    
    let filter = {};

    if (name) filter.name = new RegExp(name, "i"); // Filtrar por nombre (insensible a mayúsculas/minúsculas)
    if (category) filter.category = category; // Filtrar por categoría exacta

    const products = await Product.find(filter)
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .sort(sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {});

    res.json({ status: "success", payload: products });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};**/

export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, name, category, sort } = req.query;
    
    let filter = {};

    if (name) filter.name = new RegExp(name, "i"); // Filtrar por nombre (insensible a mayúsculas/minúsculas)
    if (category) filter.category = category; // Filtrar por categoría exacta

    // Calcular el total de productos que cumplen el filtro
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    // Obtener los productos con paginación y ordenamiento
    const products = await Product.find(filter)
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .sort(sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {});

    res.json({ 
      status: "success", 
      payload: products, 
      totalProducts, 
      totalPages, 
      currentPage: Number(page) 
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.json({ status: "success", payload: product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.json({ status: "success", payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.json({ status: "success", message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
