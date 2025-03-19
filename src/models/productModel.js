import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
});

const Product = mongoose.model("Product", productSchema);

export default Product;
