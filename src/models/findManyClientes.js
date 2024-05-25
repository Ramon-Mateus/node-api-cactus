const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  async execute(req) {
    const pageIndex = parseInt(req) || 0;

    try {
      let [clientes, total] = await Promise.all([
        prisma.clientes.findMany({
        take: 10,
        skip: pageIndex * 10
      }),
      prisma.clientes.count()
    ]);
      
      clientes = JSON.stringify(clientes, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      );
      return { clientes, total };
    } catch (error) {
      error.path = "src/models/findManyClientes.js";
      throw error;
      // ... tratamento de erros ...
    } finally {
      await prisma.$disconnect(); // desconecta o Prisma Client do banco de dados
    }
  },
};
