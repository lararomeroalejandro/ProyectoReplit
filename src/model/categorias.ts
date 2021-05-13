import {Schema, model } from 'mongoose'

// Definimos el Schema
const categoriaSchema = new Schema({
    idCategoria: String,
    nombreCat: String,
    precioAñadido: Number
})

// La colección de la BD (Plural siempre)
export const Categorias = model('categorias', categoriaSchema)