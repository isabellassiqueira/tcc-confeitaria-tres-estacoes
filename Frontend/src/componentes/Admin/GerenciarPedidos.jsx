import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GerenciarPedidos.css";

const API_URL = "http://localhost:3000/api/pedidos"; // ajuste conforme backend
const STATUS_OPTIONS = ["Pendente", "Em andamento", "Concluído", "Cancelado"];
const ITEMS_PER_PAGE = 5;

// Função para mapear status para cores
const statusColors = {
  "Pendente": "bg-yellow-200 text-yellow-800",
  "Em andamento": "bg-blue-200 text-blue-800",
  "Concluído": "bg-green-200 text-green-800",
  "Cancelado": "bg-red-200 text-red-800"
};

export default function GerenciarPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({ open: false, pedidoId: null });

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await axios.get(API_URL);
        const pedidosFormatados = res.data.map(p => ({
          ...p,
          total: Number(p.total) || 0,
          itens: Array.isArray(p.itens) ? p.itens : []
        }));
        setPedidos(pedidosFormatados);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar pedidos.");
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  // Atualizar status
  const atualizarStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/${id}`, { status });
      setPedidos(prev =>
        prev.map(p => (p.id === id ? { ...p, status } : p))
      );
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar status.");
    }
  };

  // Abrir modal de confirmação
  const abrirModal = (id) => setModal({ open: true, pedidoId: id });

  // Fechar modal
  const fecharModal = () => setModal({ open: false, pedidoId: null });

  // Deletar pedido
  const deletarPedido = async () => {
    try {
      await axios.delete(`${API_URL}/${modal.pedidoId}`);
      setPedidos(prev => prev.filter(p => p.id !== modal.pedidoId));
      fecharModal();
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar pedido.");
    }
  };

  // Filtrar pedidos
  const filteredPedidos = pedidos.filter(p =>
    p.usuarioNome?.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter ? p.status === statusFilter : true)
  );

  // Paginação
  const totalPages = Math.ceil(filteredPedidos.length / ITEMS_PER_PAGE);
  const displayedPedidos = filteredPedidos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) return <p>Carregando pedidos...</p>;
  if (error) return <p>{error}</p>;

  return (
<div className="gerenciar-pedidos">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Pedidos</h1>

      {/* Filtros */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por cliente..."
          className="border px-3 py-1 rounded flex-1"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border px-3 py-1 rounded"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">Todos os status</option>
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Tabela */}
      <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Cliente</th>
            <th className="px-4 py-2 border">Produtos</th>
            <th className="px-4 py-2 border">Total</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Ações</th>
          </tr>
        </thead>
        <tbody>
          {displayedPedidos.map(pedido => (
            <tr key={pedido.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{pedido.id}</td>
              <td className="px-4 py-2 border">{pedido.usuarioNome || pedido.usuarioId}</td>
              <td className="px-4 py-2 border">
                {pedido.itens.length > 0
                  ? pedido.itens.map(item => (
                      <div key={item.produtoId}>
                        {item.nome} x {item.quantidade}
                      </div>
                    ))
                  : "Nenhum item"}
              </td>
              <td className="px-4 py-2 border">R$ {pedido.total.toFixed(2)}</td>
              <td className="px-4 py-2 border">
                <select
                  className={`border px-2 py-1 rounded ${statusColors[pedido.status] || ""}`}
                  value={pedido.status}
                  onChange={e => atualizarStatus(pedido.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => abrirModal(pedido.id)}
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-3 py-1 border rounded">
          {currentPage} / {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Próximo
        </button>
      </div>

      {/* Modal de confirmação */}
      {modal.open && (
        <div className="modal-overlay">
  <div className="modal-box">
    <h2>Confirmar exclusão</h2>
    <p>Deseja realmente deletar este pedido?</p>
    <div className="flex">
      <button onClick={fecharModal} className="btn btn-cancelar">Cancelar</button>
      <button onClick={deletarPedido} className="btn btn-deletar">Deletar</button>
    </div>
  </div>

        </div>
      )}
    </div>
  );
}
