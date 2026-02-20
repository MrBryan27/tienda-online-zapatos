require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors"); // ✅ Agregado para permitir conexión con el HTML
const { v2: cloudinary } = require("cloudinary");

const app = express();

// ✅ MIDDLEWARES
app.use(cors()); 
app.use(express.json());

// ✅ CONFIGURAR CLOUDINARY
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔹 CONECTAR MONGO
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Mongo conectado correctamente"))
    .catch(err => console.error("❌ Error de conexión:", err));

// 🔹 MODELO (Asegúrate que la carpeta sea 'models' y el archivo 'Productos.js')
const Producto = require("./models/Productos");

// 🔹 RUTA POST: AGREGAR PRODUCTO
app.post("/api/productos", upload.single("imagen"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No se subió ninguna imagen" });

        const stream = cloudinary.uploader.upload_stream(
            { folder: "psonline" },
            async (error, result) => {
                if (error) return res.status(500).json({ error: "Error en Cloudinary" });

                const nuevoProducto = new Producto({
                    nombre: req.body.nombre,
                    precio: Number(req.body.precio),
                    categoria: req.body.categoria,
                    talla: req.body.talla,
                    imagen: result.secure_url
                });

                await nuevoProducto.save();
                res.status(201).json(nuevoProducto);
            }
        );
        stream.end(req.file.buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 RUTA GET: OBTENER TODOS
app.get("/api/productos", async (req, res) => {
    try {
        const productos = await Producto.find().sort({ creadoEn: -1 });
        res.json(productos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 RUTA DELETE: ELIMINAR
app.delete("/api/productos/:id", async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.json({ mensaje: "Producto eliminado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));