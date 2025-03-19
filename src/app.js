import express from "express";
import { engine } from "express-handlebars";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import viewRoutes from "./routes/viewRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session'; // Asegúrate de importar express-session

dotenv.config();
connectDB();

const app = express();

// Configuración de la sesión
app.use(session({
  secret: 'mi-secreto', // Cambia esto por algo más seguro
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Asegúrate de cambiar a 'true' si estás usando HTTPS
}));

// Obtener el directorio actual para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Handlebars
app.engine("handlebars", engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(process.cwd(), 'public')));

// Rutas de la API y vistas
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/", viewRoutes);

export default app;
