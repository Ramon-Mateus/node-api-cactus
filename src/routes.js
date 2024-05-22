const { Router } = require("express");

const findManyClientesController = require("./controllers/client/findManyClientes");
const findByIdClientesController = require("./controllers/client/findUniqueCliente");

const routes = Router();

//rota para buscar todos os clientes
routes.get("/findManyCliente", findManyClientesController.handle);
routes.get("/findUniqueCliente/:id", findByIdClientesController.handle);

module.exports = routes;
