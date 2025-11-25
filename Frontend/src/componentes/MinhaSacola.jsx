import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./MinhaSacola.css";

const MinhaSacola = ({ carrinho, setCarrinho }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState(0);
  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);
  const [popupAberto, setPopupAberto] = useState(false);

  const subtotal = carrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );
  const total = subtotal + frete - desconto;

  const calcularFrete = () => {
    if (!cep) return alert("Informe o CEP para calcular o frete.");
    if (cep.startsWith("0")) setFrete(10);
    else if (cep.startsWith("1")) setFrete(12);
    else if (cep.startsWith("2")) setFrete(15);
    else setFrete(20);
  };

  const aplicarCupom = () => {
    if (!cupom) return alert("Informe um cupom.");
    if (cupom.toUpperCase() === "DESCONTO10") setDesconto(10);
    else if (cupom.toUpperCase() === "PROMO20") setDesconto(subtotal * 0.2);
    else {
      setDesconto(0);
      alert("Cupom inválido");
    }
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

  const removerDoCarrinho = (id) => {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  };

  const finalizarPedido = async () => {
    if (!user) return alert("Faça login para finalizar o pedido.");
    if (!carrinho || carrinho.length === 0)
      return alert("Sua sacola está vazia.");

    try {
      await axios.post("http://localhost:3000/api/pedidos/finalizar", {
        usuarioId: user.id,
        itens: carrinho,
        total,
      });

      setPopupAberto(true);   // <- abre popup
      setCarrinho([]);        // <- esvazia sacola depois, sem bloquear o popup

    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      alert(error.response?.data?.error || "Erro ao finalizar pedido");
    }
  };

  return (
    <div className={`minha-sacola-container ${popupAberto ? "blurred" : ""}`}>

      <h2 className="sacola-title">Minha Sacola</h2>

      {/* Se a sacola estiver vazia, ainda mostra tela + popup */}
      {carrinho.length === 0 ? (
        <p className="sacola-vazia">Sua sacola está vazia.</p>
      ) : (
        <div className="sacola-grid">

          {/* TABELA */}
          <div className="produtos-sacola">
            <table className="tabela-sacola">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Preço</th>
                  <th>Quantidade</th>
                  <th>Remover</th>
                </tr>
              </thead>
              <tbody>
                {carrinho.map((item) => (
                  <tr key={item.id}>
                    <td className="produto-nome">
                      <img
                        src={`http://localhost:3000${item.image}`}
                        alt={item.name}
                      />
                      {item.name}
                    </td>
                    <td>R$ {item.preco.toFixed(2)}</td>
                    <td>
                      <div className="quantidade-btns">
                        <button onClick={() => alterarQuantidade(item.id, -1)}>-</button>
                        <span>{item.quantidade}</span>
                        <button onClick={() => alterarQuantidade(item.id, +1)}>+</button>
                      </div>
                    </td>
                    <td>
                      <button
                        className="remover-btn"
                        onClick={() => removerDoCarrinho(item.id)}
                        style={{
                          width: "40px",
                          height: "40px",
                        }}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="continuar-comprando">
              <Link to="/">
                <button className="btn-continuar">Escolher mais produtos</button>
              </Link>
            </div>
          </div>

          {/* RESUMO */}
          <div className="resumo-sacola">
            <h3>Resumo do Pedido</h3>

            <div className="cep-cupom">
              <div className="input-group">
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="Digite seu CEP"
                />
                <button className="btn-pequeno" onClick={calcularFrete}>Calcular</button>
              </div>

              <div className="input-group">
                <input
                  type="text"
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value)}
                  placeholder="Digite seu cupom"
                />
                <button className="btn-pequeno" onClick={aplicarCupom}>
                  Aplicar
                </button>
              </div>
            </div>

            <div className="totais-sacola">
              <p>Subtotal <span>R$ {subtotal.toFixed(2)}</span></p>
              <p>Frete <span>R$ {frete.toFixed(2)}</span></p>
              <p>Desconto <span>- R$ {desconto.toFixed(2)}</span></p>
              <h3>Total <span>R$ {total.toFixed(2)}</span></h3>
            </div>

            <button className="btn-finalizar" onClick={finalizarPedido}>
              Finalizar Compra
            </button>
          </div>

        </div>
      )}

      {/* POP-UP */}
      {popupAberto && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>🎉 Pedido Confirmado!</h2>
            <p>
              Seu pedido foi finalizado com sucesso. O pagamento será realizado na entrega ou em nossa loja física.
            </p>

            <div className="popup-buttons">
              <button
                className="btn-popup"
                onClick={() => navigate("/")}
              >
                OK
              </button>

              <button
                className="btn-popup meus-pedidos"
                onClick={() => navigate("/meus-pedidos")}
              >
                Meus Pedidos
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MinhaSacola;
