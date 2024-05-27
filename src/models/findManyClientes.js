const { PrismaClient } = require("@prisma/client");
const { query } = require("express");

const prisma = new PrismaClient();

module.exports = {
  async execute(page, search, city, idReq) {
    const pageIndex = parseInt(page) || 0;

    try {
      let [clientes, total, clientesOnline, clientesOffline, cidades ] = await Promise.all([
        prisma.clientes.findMany({
          where: {
            AND: [
              search ? { nomeCliente: { contains: search.toUpperCase() } } : {},
              city ? { cidadeCliente: city } : {},
              idReq ? { id: idReq } : {}
            ]
          },
        take: 10,
        skip: pageIndex * 10
        }),
        prisma.clientes.count({
          where: {
            AND: [
              search ? { nomeCliente: { contains: search.toUpperCase() } } : {},
              city ? { cidadeCliente: city } : {},
              idReq ? { id: idReq } : {}
            ]
          },
        }),
        prisma.clientes.count({
          where: {
            AND: [
              { statusCliente: true },
              search ? { nomeCliente: { contains: search.toUpperCase() } } : {},
              city ? { cidadeCliente: city } : {},
              idReq ? { id: idReq } : {}
            ]
          }
        }),
        prisma.clientes.count({
          where: {
            AND: [
              { statusCliente: false },
              search ? { nomeCliente: { contains: search.toUpperCase() } } : {},
              city ? { cidadeCliente: city } : {},
              idReq ? { id: idReq } : {}
            ]
          }
        }),
        prisma.clientes.findMany({
          select: {
            cidadeCliente: true
          },
          distinct: ['cidadeCliente']
        })
      ]);
      clientes = JSON.stringify(clientes, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      );
      return { clientes, total, clientesOnline, clientesOffline, cidades };
    } catch (error) {
      error.path = "src/models/findManyClientes.js";
      throw error;
      // ... tratamento de erros ...
    } finally {
      await prisma.$disconnect(); // desconecta o Prisma Client do banco de dados
    }
  },
};
