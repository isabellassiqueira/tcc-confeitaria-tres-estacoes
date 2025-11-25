import React, { useEffect, useState } from "react";
import "./ListarUsuarios.css";

const API_URL = "http://localhost:3000/api/users";

export default function ListarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // filtros
  const [busca, setBusca] = useState("");
  const [filtroRole, setFiltroRole] = useState("todos");

  // ordenação
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // modal de edição
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const buscarDados = async () => {
    try {
      const resposta = await fetch(API_URL);
      const data = await resposta.json();
      setUsuarios(data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarDados();
  }, []);

  /* ======== FILTROS ======== */
  const usuariosFiltrados = usuarios
    .filter((u) => {
      const termo = busca.toLowerCase();
      return (
        u.nome.toLowerCase().includes(termo) ||
        u.email.toLowerCase().includes(termo)
      );
    })
    .filter((u) => {
      if (filtroRole === "todos") return true;
      return u.role === filtroRole;
    });

  /* ======== ORDENAÇÃO ======== */
  const ordenarPor = (campo) => {
    const novaDirecao =
      sortField === campo && sortDirection === "asc" ? "desc" : "asc";

    setSortField(campo);
    setSortDirection(novaDirecao);

    const ordenado = [...usuariosFiltrados].sort((a, b) => {
      if (a[campo] < b[campo]) return novaDirecao === "asc" ? -1 : 1;
      if (a[campo] > b[campo]) return novaDirecao === "asc" ? 1 : -1;
      return 0;
    });

    setUsuarios(ordenado);
  };

  /* ======== MODAL ======== */
  const abrirModal = (usuario) => {
    setUsuarioEditando(usuario);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setUsuarioEditando(null);
  };

  const salvarEdicao = async () => {
    try {
      await fetch(`${API_URL}/${usuarioEditando.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioEditando),
      });

      alert("Usuário atualizado!");
      fecharModal();
      buscarDados();
    } catch (error) {
      alert("Erro ao salvar.");
    }
  };

  if (loading) return <div>Carregando usuários...</div>;

  return (
    <div className="usuarios-container">
      <h2>Gerenciar Usuários</h2>

      {/* ==== FILTROS ==== */}
      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

      </div>

      {/* ===== LISTA ===== */}
      <table className="usuarios-table">
        <thead>
          <tr>
            <th onClick={() => ordenarPor("id")}>ID</th>
            <th onClick={() => ordenarPor("nome")}>Nome</th>
            <th onClick={() => ordenarPor("email")}>Email</th>
            <th onClick={() => ordenarPor("role")}>Role</th>
          </tr>
        </thead>

        <tbody>
          {usuariosFiltrados.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>
              <td>{usuario.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== MODAL ===== */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar Usuário</h3>

            <label>Nome:</label>
            <input
              type="text"
              value={usuarioEditando.nome}
              onChange={(e) =>
                setUsuarioEditando({ ...usuarioEditando, nome: e.target.value })
              }
            />

            <label>Email:</label>
            <input
              type="email"
              value={usuarioEditando.email}
              onChange={(e) =>
                setUsuarioEditando({ ...usuarioEditando, email: e.target.value })
              }
            />

            <label>Role:</label>
            <select
              value={usuarioEditando.role}
              onChange={(e) =>
                setUsuarioEditando({ ...usuarioEditando, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className="modal-buttons">
              <button className="btn-save" onClick={salvarEdicao}>
                Salvar
              </button>
              <button className="btn-cancel" onClick={fecharModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
