const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  async execute(id) {
    try {
      let cliente = await prisma.clientes.findUnique({
        where: {
          id: id
        }
      });
      if(cliente !== null) {
        cliente = JSON.stringify(cliente, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        );
      }
      return cliente;
    } catch (error) {
      error.path = "src/models/findUniqueClientes.js";
      throw error;
      // ... tratamento de erros ...
    } finally {
      await prisma.$disconnect(); // desconecta o Prisma Client do banco de dados
    }
  },
};
