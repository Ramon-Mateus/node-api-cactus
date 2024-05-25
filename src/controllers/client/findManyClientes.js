const logger = require("../../custom/logger");
const findManyClientes = require("../../models/findManyClientes");

module.exports = {
  async handle(req, res) {
    try {
      const { pageIndex } = req.query
      const clients = await findManyClientes.execute(pageIndex);

      logger.info("successfully found clients");
      res.status(200).json(clients);
    } catch (error) {
      if (!error.path) {
        //informa o caminho do erro se não tiver
        error.path = "src/controllers/client/findManyClientesController.js";
      }
      throw error;
    }
  },
};
