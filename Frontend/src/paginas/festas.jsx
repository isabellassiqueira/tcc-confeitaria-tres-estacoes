import React, { useState } from "react";
import aniversario from "../assets/aniversario.png";
import corporativo from "../assets/corporativo.png";
import casamento from "../assets/casamento.png";
import festasBanner from "../assets/festasBanner.png";
import "./Festas.css";

const Festas = () => {
  const eventos = [
    {
      id: 1,
      img: aniversario,
      titulo: "Festa de Aniversário",
      descricao:
        "Uma festa deliciosa organizada pela nossa confeitaria, com entrega de bolos e doces personalizados. Inclui sobremesas e atividades temáticas!",
      preco: "Por estimativa",
    },
    {
      id: 2,
      img: corporativo,
      titulo: "Eventos Corporativos",
      descricao:
        "Evento exclusivo para empresas, com doces personalizados e opções de compra em bulk para reuniões corporativas. Inclui consultoria para eventos de negócios!",
      preco: "Por estimativa",
    },
    {
      id: 3,
      img: casamento,
      titulo: "Casamentos",
      descricao:
        "Celebre com doces e bolos personalizados da nossa confeitaria. Oferecemos entrega rápida e personalizada para fazer do seu evento algo inesquecível!",
      preco: "Por estimativa",
    },
  ];

  // Estado para controlar quais cards estão abertos
  const [abertos, setAbertos] = useState({});

  const toggleDetalhes = (id) => {
    setAbertos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="festas-container">
      <img src={festasBanner} alt="Festas Banner" style={{ width: '1200px', borderRadius: '30px', marginTop: '20px', height: '270px', marginBottom: '20px', border: '1px solid #7e473c' }} />

      {/* Grid de Eventos */}
      <section className="events-list">
        <div className="events-grid">
          {eventos.map((evento) => (
            <div key={evento.id} className="event-card">
              <div className="event-img-wrapper">
                <img src={evento.img} alt={evento.titulo} className="event-img" />
              </div>

              <div className="event-content">
                <h3>{evento.titulo}</h3>
                <p>{evento.descricao}</p>

                {/* Botão Comprar */}
                <button
                  className="btn-comprar"
                  onClick={() => toggleDetalhes(evento.id)}
                >
                  COMPRAR PACOTE
                  <span className="btn-arrow">→</span>
                </button>

                {/* Container de detalhes, aparece quando o card está aberto */}
                {abertos[evento.id] && (
                  <div className="detalhes-container">
                    <p>
                      <strong>Estimativa de preço: </strong>
                      {evento.preco}
                    </p>
                    <p>Entre em contato para fechar seu pacote e receber orientação personalizada.</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Festas;
