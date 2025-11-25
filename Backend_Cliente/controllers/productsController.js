const db = require("../db");
const fs = require("fs");
const path = require("path");

/* ====== LISTAR PRODUTOS ====== */
async function listProducts(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT id, nome AS name, descricao AS description, preco AS price, imagem AS image, tipo FROM produtos ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar produtos:", err);
    res.status(500).json({ message: "Erro ao listar produtos" });
  }
}

/* ====== ADICIONAR PRODUTO ====== */
async function addProduct(req, res) {
  try {
    const { name, description, price, tipo } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !price || !tipo) {
      return res.status(400).json({ message: "Nome, tipo e preço são obrigatórios." });
    }

    const numericPrice = parseFloat(price);

    const [result] = await db.query(
      "INSERT INTO produtos (nome, descricao, preco, imagem, tipo) VALUES (?, ?, ?, ?, ?)",
      [name, description, numericPrice, imagePath, tipo]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      description,
      price: numericPrice,
      image: imagePath,
      tipo,
    });
  } catch (err) {
    console.error("Erro ao adicionar produto:", err);
    res.status(500).json({ message: "Erro ao adicionar produto" });
  }
}

/* ====== BUSCAR PRODUTO POR ID ====== */
async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT id, nome AS name, descricao AS description, preco AS price, imagem AS image, tipo FROM produtos WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao buscar produto:", err);
    res.status(500).json({ message: "Erro ao buscar produto" });
  }
}

/* ====== EDITAR PRODUTO ====== */
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, tipo } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Verifica se o produto existe
    const [existing] = await db.query("SELECT imagem FROM produtos WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    // Remove imagem antiga se uma nova for enviada
    if (imagePath && existing[0].imagem) {
      const oldImagePath = path.resolve("." + existing[0].imagem);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const [result] = await db.query(
      `UPDATE produtos 
       SET nome = ?, descricao = ?, preco = ?, tipo = ?, imagem = COALESCE(?, imagem)
       WHERE id = ?`,
      [name, description, parseFloat(price), tipo, imagePath, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Produto não encontrado para atualização" });
    }

    res.json({
      message: "Produto atualizado com sucesso",
      id,
      name,
      description,
      price: parseFloat(price),
      tipo,
      image: imagePath || existing[0].imagem,
    });
  } catch (err) {
    console.error("Erro ao atualizar produto:", err);
    res.status(500).json({ message: "Erro ao atualizar produto" });
  }
}

/* ====== DELETAR PRODUTO ====== */
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    // Verifica se o produto existe e recupera imagem
    const [rows] = await db.query("SELECT imagem FROM produtos WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    // Deleta imagem associada, se existir
    if (rows[0].imagem) {
      const imagePath = path.resolve("." + rows[0].imagem);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Deleta produto
    await db.query("DELETE FROM produtos WHERE id = ?", [id]);

    res.json({ message: "Produto deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar produto:", err);
    res.status(500).json({ message: "Erro ao deletar produto" });
  }
}

module.exports = {
  listProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};

