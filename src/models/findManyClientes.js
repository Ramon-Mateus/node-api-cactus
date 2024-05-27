const { PrismaClient } = require("@prisma/client");
const { query } = require("express");

const prisma = new PrismaClient();

module.exports = {
  async execute(page, search, city, idReq) {
    const pageIndex = parseInt(page) || 0;

    const andSQL = [
      search ? { nomeCliente: { contains: search.toUpperCase() } } : {},
      city ? { cidadeCliente: city } : {},
      idReq ? { id: idReq } : {}
    ]

    const andSQLWithStatusTrue = [...andSQL, { statusCliente: true }];
    const andSQLWithStatusFalse = [...andSQL, { statusCliente: false }];

    try {
      let [clientes, total, clientesOnline, clientesOffline, cidades, avgs ] = await Promise.all([
        prisma.clientes.findMany({
          where: {
            AND: andSQL
          },
        take: 10,
        skip: pageIndex * 10
        }),
        prisma.clientes.count({
          where: {
            AND: andSQL
          },
        }),
        prisma.clientes.count({
          where: {
            AND: andSQLWithStatusTrue
          }
        }),
        prisma.clientes.count({
          where: {
            AND: andSQLWithStatusFalse
          }
        }),
        prisma.clientes.findMany({
          select: {
            cidadeCliente: true
          },
          distinct: ['cidadeCliente']
        }),
        prisma.clientes.aggregate({
          _avg: {
            valorPlano: true,
            consumoDownload: true,
            consumoUpload: true
          },
          where : {
            AND: andSQL
          }
        })
      ]);
      clientes = JSON.stringify(clientes, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      );
      return { clientes, total, clientesOnline, clientesOffline, cidades, avgs };
    } catch (error) {
      error.path = "src/models/findManyClientes.js";
      throw error;
      // ... tratamento de erros ...
    } finally {
      await prisma.$disconnect(); // desconecta o Prisma Client do banco de dados
    }
  },
};
