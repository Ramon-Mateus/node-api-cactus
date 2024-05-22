const logger = require("../../custom/logger");
const findUniqueCliente = require("../../models/findUniqueCliente");

module.exports = {
  async handle(req, res) {
    const { id } = req.params;
    try {
        const client = await findUniqueCliente.execute(id);
        
        if(client === null) {
            logger.info("declined not found client");
            res.status(404).json({ error: "Client not found"});
        } else {
            logger.info("successfully found client");
            res.status(200).json(client);
        }
    } catch (error) {
        if (!error.path) {
            //informa o caminho do erro se não tiver
            error.path = "src/controllers/client/findUniqueClientesController.js";
        }
        throw error;
    }
  },
};
