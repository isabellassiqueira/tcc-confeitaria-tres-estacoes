const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const SECRET = "segredo-super-seguro";

/* ================================
   LISTAR USUÁRIOS (ADM)
================================ */
async function listarUsuarios(req, res) {
  try {
    const [rows] = await db.query("SELECT id, nome, email, telefone, role FROM users");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
}

/* ================================
   CADASTRAR USUÁRIO
================================ */
async function register(req, res) {
  const { nome, email, senha, telefone } = req.body;

  try {
    // Verificar email duplicado
    const [usuarios] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (usuarios.length > 0) {
      return res.status(409).json({ message: "Email já cadastrado" });
    }

    // Criar hash da senha
    const senha_hash = await bcrypt.hash(senha, 10);

    // Inserir novo usuário
    await db.query(
      "INSERT INTO users (nome, email, telefone, senha_hash) VALUES (?, ?, ?, ?)",
      [nome, email, telefone, senha_hash]
    );

    res.status(201).json({ message: "Usuário cadastrado com sucesso" });
  } catch (erro) {
    console.error("Erro ao cadastrar usuário:", erro);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
}

/* ================================
   LOGIN
================================ */
async function login(req, res) {
  const { email, senha } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const usuario = rows[0];

    // Comparar senha com senha_hash
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaCorreta) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
        role: usuario.role,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

/* ================================
   ATUALIZAR MEU PERFIL (USER)
================================ */
async function atualizarMeuPerfil(req, res) {
  const { id } = req.params;
  const { nome, email, senha, telefone } = req.body;

  try {
    let query = "UPDATE users SET nome = ?, email = ?, telefone = ? ";
    let params = [nome, email, telefone];

    if (senha) {
      const senha_hash = await bcrypt.hash(senha, 10);
      query += ", senha_hash = ? ";
      params.push(senha_hash);
    }

    query += " WHERE id = ?";
    params.push(id);

    await db.query(query, params);

    const [usuarioAtualizado] = await db.query(
      "SELECT id, nome, email, telefone, role FROM users WHERE id = ?",
      [id]
    );

    res.status(200).json({ user: usuarioAtualizado[0] });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ error: "Erro ao salvar alterações" });
  }
}

/* ================================
   EDITAR QUALQUER USUÁRIO (ADM)
================================ */
async function editarUsuarioAdmin(req, res) {
  const { id } = req.params;
  const { nome, email, role, senha, telefone } = req.body;

  try {
    let query = "UPDATE users SET nome = ?, email = ?, telefone = ?, role = ? ";
    let params = [nome, email, telefone, role];

    if (senha) {
      const senha_hash = await bcrypt.hash(senha, 10);
      query += ", senha_hash = ? ";
      params.push(senha_hash);
    }

    query += " WHERE id = ?";
    params.push(id);

    await db.query(query, params);

    res.json({ message: "Usuário atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao editar usuário (ADM):", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

/* ================================
   DELETAR USUÁRIO
================================ */
async function deletarUsuario(req, res) {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "Usuário removido com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ error: "Erro interno ao deletar." });
  }
}

module.exports = {
  register,
  login,
  listarUsuarios,
  atualizarMeuPerfil,
  editarUsuarioAdmin,
  deletarUsuario,
};
