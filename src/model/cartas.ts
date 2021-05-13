import {Schema, model } from 'mongoose'

// Definimos el Schema
const cartaSchema = new Schema({
    nombre: String,
    kcal: Number,
    nutricion: {
      carbo: Number, 
      proteina: Number, 
      grasas: Number
      },
    ingredientes: [
      {idIngr: Number, 
      cantidad: Number}
    ],
    productoEstrella: Boolean,
    idCategoria: Number
})

// La colección de la BD (Plural siempre)
export const Cartas = model('cartas', cartaSchema)