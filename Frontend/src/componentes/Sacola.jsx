import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sacola.css";

const Sacola = ({ carrinho, setCarrinho, toggleCarrinho }) => {
  const navigate = useNavigate();

  const removerDoCarrinho = (id) => {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  };

  const alterarQuantidade = (id, delta) => {
    setCarrinho((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantidade: Math.max(1, item.quantidade + delta) }
          : item
      )
    );
  };

  const totalCarrinho = carrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );

  const irParaMinhaSacola = () => {
    toggleCarrinho();
    navigate("/minha-sacola");
  };

  return (
    <div className="carrinho-overlay" onClick={toggleCarrinho}>
<div className="carrinho-sidebar" onClick={(e) => e.stopPropagation()}>
  
  <button className="btn-fechar-sacola" onClick={toggleCarrinho}>
    ×
  </button>

  <h2 className="titulo-sacola">Sua Sacola</h2>


        {carrinho.length === 0 ? (
          <p className="carrinho-vazio">Sua sacola está vazia.</p>
        ) : (
          <ul className="carrinho-lista">
            {carrinho.map((product) => (
              <li key={product.id} className="carrinho-item">
                
                <div className="img-wrapper">
                  <img
                    src={`http://localhost:3000${product.image}`}
                    alt={product.name}
                  />
                </div>

                <div className="item-info">
                  <h4>{product.name}</h4>
                  <p className="preco">R$ {Number(product.preco).toFixed(2)}</p>

                  <div className="item-quantidade">
                    <button onClick={() => alterarQuantidade(product.id, -1)}>
                      –
                    </button>
                    <span>{product.quantidade}</span>
                    <button onClick={() => alterarQuantidade(product.id, +1)}>
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="remover-btn"
                  onClick={() => removerDoCarrinho(product.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="carrinho-total">
          <h3>Total:</h3>
          <strong>R$ {totalCarrinho.toFixed(2)}</strong>
        </div>

        <button className="btn-finalizar" onClick={irParaMinhaSacola}>
          Finalizar Pedido
        </button>
      </div>
    </div>
  );
};

export default Sacola;
