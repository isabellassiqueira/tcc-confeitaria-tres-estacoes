const db = require("../db");

/* ================================
   CRIAR PEDIDO
================================ */
async function criarPedido(req, res) {
  try {
    const { usuarioId, itens, total } = req.body;

    if (!usuarioId) return res.status(400).json({ error: "usuarioId é obrigatório" });
    if (!itens || itens.length === 0) return res.status(400).json({ error: "Carrinho vazio" });

    // Cria pedido
    const [pedidoResult] = await db.query(
      "INSERT INTO pedidos (usuarioId, total, criado_em) VALUES (?, ?, NOW())",
      [usuarioId, total]
    );
    const pedidoId = pedidoResult.insertId;

    // Insere itens
    for (const item of itens) {
      await db.query(
        `INSERT INTO pedido_itens (pedidoId, produtoId, quantidade, preco)
         VALUES (?, ?, ?, ?)`,
        [pedidoId, item.id, item.quantidade, item.preco]
      );
    }

    res.status(201).json({ message: "Pedido criado com sucesso", pedidoId });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ error: "Erro ao criar pedido" });
  }
}

/* ================================
   LISTAR PEDIDOS DO USUÁRIO
================================ */
async function listarPedidosPorUsuario(req, res) {
  const { usuarioId } = req.params;

  try {
    const [pedidos] = await db.query(
      "SELECT * FROM pedidos WHERE usuarioId = ? ORDER BY criado_em DESC",
      [usuarioId]
    );

    if (pedidos.length === 0) return res.json([]);

    const pedidoIds = pedidos.map(p => p.id);
    const [itens] = await db.query(
      `SELECT pi.pedidoId, pi.quantidade, pi.preco, p.id AS produtoId, p.nome, p.imagem
       FROM pedido_itens pi
       JOIN produtos p ON pi.produtoId = p.id
       WHERE pi.pedidoId IN (${pedidoIds.join(",")})`
    );

    const itensPorPedido = {};
    itens.forEach(item => {
      if (!itensPorPedido[item.pedidoId]) itensPorPedido[item.pedidoId] = [];
      itensPorPedido[item.pedidoId].push({
        id: item.produtoId,
        nome: item.nome,
        quantidade: item.quantidade,
        preco: item.preco,
        imagem: item.imagem
      });
    });

    const pedidosComProdutos = pedidos.map(pedido => ({
      id: pedido.id,
      usuarioId: pedido.usuarioId,
      total: pedido.total,
      status: pedido.status,
      criado_em: pedido.criado_em,
      products: itensPorPedido[pedido.id] || []
    }));

    res.json(pedidosComProdutos);

  } catch (error) {
    console.error("Erro ao carregar pedidos:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
}

// Listar todos os pedidos (Admin)
async function listarTodosPedidos(req, res) {
  try {
    // Buscar pedidos com usuário
const [pedidos] = await db.query(`
  SELECT p.id, p.usuarioId, u.nome AS usuarioNome, p.total, p.status
  FROM pedidos p
  JOIN users u ON u.id = p.usuarioId
  ORDER BY p.id DESC
`);


    // Buscar itens de cada pedido
    for (let pedido of pedidos) {
      const [itens] = await db.query(`
        SELECT pi.produtoId, pr.nome, pi.quantidade
        FROM pedido_itens pi
        JOIN produtos pr ON pr.id = pi.produtoId
        WHERE pi.pedidoId = ?
      `, [pedido.id]);

      pedido.itens = itens;
    }

    res.json(pedidos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar pedidos" });
  }
}

// Atualizar status do pedido
async function atualizarStatusPedido(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ error: "Status é obrigatório" });

  try {
    const [result] = await db.query(
      "UPDATE pedidos SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Pedido não encontrado" });

    res.json({ message: "Status atualizado com sucesso", status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
}

// Deletar pedido
async function deletarPedido(req, res) {
  const { id } = req.params;

  try {
    // Deletar itens do pedido primeiro (chave estrangeira)
    await db.query("DELETE FROM pedido_itens WHERE pedidoId = ?", [id]);

    // Deletar o pedido
    const [result] = await db.query("DELETE FROM pedidos WHERE id = ?", [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Pedido não encontrado" });

    res.json({ message: "Pedido deletado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar pedido" });
  }
}

module.exports = {
  atualizarStatusPedido,
  deletarPedido,
  listarTodosPedidos,
  criarPedido,
  listarPedidosPorUsuario,
};
