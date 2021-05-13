import {Ingredientes} from './model/ingredientes'
import {Categorias} from './model/categorias'
import {Cartas} from './model/cartas'
import {CartaIng, Composicion, CantIngredientes} from './model/interfaces'
import { db } from './database/database'
import {Request, Response} from 'express'
import express from 'express'
const app = express()
const port = 3000

/* Especifica si un plato es recomendable para perder peso, o si no lo es */
const fun1 = async (req: Request, res: Response) => {
    await db.conectarBD()
    .then( 
      async (mensaje) => {
        console.log(mensaje)
        let array: Array<CartaIng>
        const query = await Cartas.aggregate([
          {
            $project: {
              _id: 0,
              nombre: 1,
              kcal: 1,
            }
          }
        ])
    
    array = query
    let numCal: number = 0
    let plato: CartaIng
    let perderP: string

    interface respuesta {
          nombrePlato: string,
          calorias: number,
          perderPeso: string
        }    

    let resultado: Array<respuesta> = []

    for (plato of array) {
      numCal = plato.kcal
      
      if (numCal < 600) {
        perderP = "Es recomendable para perder peso"
      } else {
        perderP = "No es recomendable para perder peso"
      }
      
      resultado.push({
        nombrePlato: plato.nombre,
        calorias: numCal,
        perderPeso: perderP
      })
    }
    res.json(resultado)

    })
    .catch(
      (mensaje) => {
        res.send(mensaje)
        console.log(mensaje)
    })
    db.desconectarBD()
  }

/* Muestro los ingredientes caducados filtrados por su identificador */
const fun2 = async (req: Request, res: Response) => {
          const valor: number = parseInt(req.params.id)
    await db.conectarBD()
    .then( 
      async (mensaje) => {
        console.log(mensaje)
        let array: Array<Composicion>
        const query = await Ingredientes.aggregate([
         {
            $match: {
              "idIngr": valor
            }
          },{
            $project: {
              _id: 0,
              idIngr: 1,
              nombreIng:1,
              fechaCaducidad: 1
            }
          }
        ])

      array = query
      let ingred: Composicion
      let caducidad: Date
      let hoy= new Date(2021, 4, 25)
      let c: boolean
      

      interface respuesta {
        id: number,
        nombre: string,
        fechaCad: Date,
        caducado: boolean
        
      }

      let resultado: Array<respuesta> = []

      for (ingred of array) {
        caducidad = ingred.fechaCaducidad
        c = true

        if (caducidad > hoy) {
          c = false
        }

        resultado.push({
        id: ingred.idIngr,
        nombre: ingred.nombreIng,
        fechaCad: ingred.fechaCaducidad,
        caducado: c
      })
      }

    res.json(resultado)

    })
    .catch(
      (mensaje) => {
        res.send(mensaje)
        console.log(mensaje)
    })
    db.desconectarBD()
  }

/* Calcula el peso total de cada plato */
const fun3 = async (req: Request, res: Response) => {
    const valor = req.params.dep
    await db.conectarBD()
    .then( 
      async (mensaje) => {
        console.log(mensaje)
        let array: Array<CartaIng>
        const query: any = await Cartas.aggregate([
            {
              $lookup: {
                from: "ingredientes",
                localField: "ingredientes.idIngr",
                foreignField: "idIngr",
                as: "composicion"
              }
            },{
              $project: {
                _id: 0,
                nombre: 1,
                composicion: 1,
                ingredientes: 1  
              }
            }
          ])

        array = query
        let cantFinal: number = 0
        let plato: CartaIng
        let ingred: Composicion
        let cantidades: CantIngredientes
        
        interface respuesta {
          nombre: string,
          peso: number,
        }

        let resultado: Array<respuesta> = []

        //Recorro el array de platos
        for (plato of array) {
          cantFinal = 0

          for (cantidades of plato.ingredientes) {
            cantFinal += cantidades.cantidad
          }
          resultado.push({
            nombre: plato.nombre,
            peso: cantFinal
          })
        }
        res.json(resultado)
        
    }).catch(
      (mensaje) => {
        res.send(mensaje)
        console.log(mensaje)
    })
    db.desconectarBD()
  }


/*Calcula el peso del plato */
const fun0 = async (req: Request, res: Response) => {
   res.send("Bienvenido al proyecto, para obtener información sobre el proyecto te invito a consultar el archivo README.md y la documentación")
 }



app.get('/dieta', fun1)
app.get('/caducados/:id', fun2)
app.get('/peso', fun3)
app.get('/', fun0)


app.listen(process.env.PORT || port, () => {
  console.log(`Listening...`)
})
