export interface CartaIng {
  nombre: string,
  kcal: number,
  nutricion: {
      carbo: number, 
      proteina: number, 
      grasas: number
  },
  ingredientes: [{
    idIngr: number,
    cantidad: number
  }],
  productoEstrella: boolean,
  idCategoria: number,
  composicion: [{
    idIngr: number,
    nombreIng: string,
    precioCompra: number,
    fechaCaducidad: Date
  }]
}

export interface Composicion {
  idIngr: number,
  nombreIng: string,
  precioCompra: number,
  fechaCaducidad: Date
}

export interface CantIngredientes {
  idIngr: number,
  cantidad: number
}