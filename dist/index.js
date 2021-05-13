"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ingredientes_1 = require("./model/ingredientes");
const cartas_1 = require("./model/cartas");
const database_1 = require("./database/database");
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const port = 3000;
/*
const fun1 = async (req: Request, res: Response) => {
    await db.conectarBD()
    .then(

        async (mensaje) => {
          const query = await Ingredientes.find(
            {},{_id: 0, idIngr: 1, nombreIng: 1, precioCompra: 1, fechaCaducidad: 1})

          res.json(query)
    })
    .catch(

      (mensaje) => {
        res.send(mensaje)
        console.log(mensaje)

    })
    db.desconectarBD()
  }

const fun2 = async (req: Request, res: Response) => {
    await db.conectarBD()
    .then(

        async (mensaje) => {
          const query = await Categorias.find(
            {},{_id: 0, idCategoria: 1, nombreCat: 1, precioAñadido: 1})

          res.json(query)
    })
    .catch(

      (mensaje) => {
        res.send(mensaje)
        console.log(mensaje)

    })
    db.desconectarBD()
  }

const fun3 = async (req: Request, res: Response) => {
    await db.conectarBD()
    .then(

        async (mensaje) => {
          const query = await Cartas.find(
            {},{_id: 0, nombre: 1, kcal: 1, nutricion: 1,
            ingredientes:1, productoEstrella:1, idCategoria:1})

          res.json(query)
    })
    .catch(

      (mensaje) => {
        res.send(mensaje)
        console.log(mensaje)

    })
    db.desconectarBD()
  }

const fun4 = async (req: Request, res: Response) => {
    await db.conectarBD()
    .then(
      async (mensaje) => {
        console.log(mensaje)
        const query = await Cartas.aggregate([
            {
                $lookup: {
                    from: "ingredientes",
                    localField: "ingredientes.idIngr",
                    foreignField: "idIngr",
                    as: "composicion"
                }
            }
        ])
        res.json(query)
    })
    .catch(
      (mensaje) => {
        res.send(mensaje)
        console.log(mensaje)
    })
    db.desconectarBD()
  }
*/
/* Especifica si un plato es recomendable para perder peso, o si no lo es */
const fun1 = (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield database_1.db.conectarBD()
        .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
        console.log(mensaje);
        let array;
        const query = yield cartas_1.Cartas.aggregate([
            {
                $project: {
                    _id: 0,
                    nombre: 1,
                    kcal: 1,
                }
            }
        ]);
        array = query;
        let numCal = 0;
        let plato;
        let perderP;
        let resultado = [];
        for (plato of array) {
            numCal = plato.kcal;
            if (numCal < 600) {
                perderP = "Es recomendable para perder peso";
            }
            else {
                perderP = "No es recomendable para perder peso";
            }
            resultado.push({
                nombrePlato: plato.nombre,
                calorias: numCal,
                perderPeso: perderP
            });
        }
        res.json(resultado);
    }))
        .catch((mensaje) => {
        res.send(mensaje);
        console.log(mensaje);
    });
    database_1.db.desconectarBD();
});
/* Muestro los ingredientes caducados filtrados por su identificador */
const fun2 = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const valor = parseInt(req.params.id);
    yield database_1.db.conectarBD()
        .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
        console.log(mensaje);
        let array;
        const query = yield ingredientes_1.Ingredientes.aggregate([
            {
                $match: {
                    "idIngr": valor
                }
            }, {
                $project: {
                    _id: 0,
                    idIngr: 1,
                    nombreIng: 1,
                    fechaCaducidad: 1
                }
            }
        ]);
        array = query;
        let ingred;
        let caducidad;
        let hoy = new Date(2021, 4, 25);
        let c;
        let resultado = [];
        for (ingred of array) {
            caducidad = ingred.fechaCaducidad;
            c = true;
            if (caducidad > hoy) {
                c = false;
            }
            resultado.push({
                id: ingred.idIngr,
                nombre: ingred.nombreIng,
                fechaCad: ingred.fechaCaducidad,
                caducado: c
            });
        }
        res.json(resultado);
    }))
        .catch((mensaje) => {
        res.send(mensaje);
        console.log(mensaje);
    });
    database_1.db.desconectarBD();
});
const fun3 = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const valor = req.params.dep;
    yield database_1.db.conectarBD()
        .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
        console.log(mensaje);
        let array;
        const query = yield cartas_1.Cartas.aggregate([
            {
                $lookup: {
                    from: "ingredientes",
                    localField: "ingredientes.idIngr",
                    foreignField: "idIngr",
                    as: "composicion"
                }
            }, {
                $project: {
                    _id: 0,
                    nombre: 1,
                    composicion: 1,
                    ingredientes: 1
                }
            }
        ]);
        array = query;
        let cantFinal = 0;
        let plato;
        let ingred;
        let cantidades;
        let resultado = [];
        //Recorro el array de platos
        for (plato of array) {
            cantFinal = 0;
            for (cantidades of plato.ingredientes) {
                cantFinal += cantidades.cantidad;
            }
            resultado.push({
                nombre: plato.nombre,
                peso: cantFinal
            });
        }
        res.json(resultado);
    })).catch((mensaje) => {
        res.send(mensaje);
        console.log(mensaje);
    });
    database_1.db.desconectarBD();
});
/*Calcula el peso del plato */
const fun0 = (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.send("Bienvenido al proyecto, para obtener información sobre como ejecutar las consultas, consulta el archivo README.md");
});
app.get('/dieta', fun1);
app.get('/caducados/:id', fun2);
app.get('/ola', fun3);
app.get('/', fun0);
app.listen(port, () => {
    console.log(`Listening...`);
});
