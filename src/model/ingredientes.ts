import {Schema, model } from 'mongoose'

// Definimos el Schema
const ingredienteSchema = new Schema({
    idIngr: Number,
    nombreIng: String,
    precioCompra: Number,
    fechaCaducidad: Date
})

// La colección de la BD (Plural siempre)
export const Ingredientes = model('ingredientes', ingredienteSchema)
