const express = require("express");
const router = express.Router();
const pedidosController = require("../controllers/pedidosController");

// Listar pedidos do usuário
router.get("/usuario/:usuarioId", pedidosController.listarPedidosPorUsuario);

// Listar todos os pedidos (Admin)
router.get("/", pedidosController.listarTodosPedidos);

// Finalizar pedido (reaproveitando criarPedido)
router.post("/finalizar", pedidosController.criarPedido);

// Atualizar status
router.put("/:id", pedidosController.atualizarStatusPedido);

// Deletar pedido
router.delete("/:id", pedidosController.deletarPedido);


module.exports = router;
