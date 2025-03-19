import app from "./app.js";
import session from 'express-session';

const PORT = process.env.PORT || 3000;

// Configura las sesiones antes de las rutas
app.use(session({
  secret: 'mi-secreto', // Cambia esto por algo más seguro
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Si estás usando HTTP, es 'false'. Si usas HTTPS, cambia a 'true'
}));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
