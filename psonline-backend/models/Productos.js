const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    imagen: { type: String, required: true },
    categoria: { type: String },
    talla: { type: String },
    creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Producto", productoSchema);