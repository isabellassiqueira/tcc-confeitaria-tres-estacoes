import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MeusPedidos.css";
import { useAuth } from "../../context/AuthContext";

export default function MeusPedidos() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarPedidos = async () => {
    try {
      const resposta = await axios.get(
        `http://localhost:3000/api/pedidos/usuario/${user.id}`
      );
      setPedidos(resposta.data);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) carregarPedidos();
  }, [user]);

  if (loading) return <div className="loading">Carregando pedidos...</div>;
  if (pedidos.length === 0)
    return <p className="sem-pedidos">Você ainda não possui pedidos.</p>;

  return (
    <div>
      <h2>Meus Pedidos</h2>
    <div className="meus-pedidos-container">

      {pedidos.map((pedido) => (
        <div key={pedido.id} className="pedido-card">
          <div className="pedido-info">
            <p><strong>Pedido #{pedido.id}</strong></p>
            <p>Data: {new Date(pedido.criado_em).toLocaleDateString()}</p>
            <p>Total: R$ {Number(pedido.total || 0).toFixed(2)}</p>
            <p>Status: {pedido.status}</p>
          </div>

          <h4>Produtos:</h4>
          {pedido.products && pedido.products.length > 0 ? (
            <div className="produtos-lista">
              {pedido.products.map((product) => {
                const quantidade = Number(product.quantidade || 0);
                const preco = Number(product.preco || 0);

                return (
                  <div key={product.id} className="produto-item">
<img
  src={
    product.imagem
      ? `http://localhost:3000${product.imagem}`
      : "/placeholder.png"
  }
  alt={product.nome}
  className="produto-img"
/>


                    <div className="produto-detalhes">
                      <p className="produto-nome">{product.nome}</p>
                      <p>Qtd: {quantidade}</p>
                      <p>Preço: R$ {(preco * quantidade).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="sem-produtos">Nenhum produto neste pedido.</p>
          )}
        </div>
      ))}
    </div>
    </div>
  );
}
