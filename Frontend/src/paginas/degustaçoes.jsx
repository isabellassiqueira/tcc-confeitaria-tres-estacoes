import React, { useState } from "react";
import degustacao from "../assets/degustação.png";
import degustacaoCasa from "../assets/degustaçãoCasa.png";
import degustaçãoBanner from "../assets/degustaçãoBanner.png";
import "./degustação.css";

const Degustacoes = () => {
  const degustacoes = [
    {
      id: 1,
      img: degustacao,
      tipo: "Em nossa loja presencial",
      titulo: "Degustação Personalizada",
      descricao: "Agende sua visita à nossa loja e desfrute de uma degustação personalizada, pensada especialmente para noivos, aniversariantes e quem deseja celebrar com o que há de mais refinado na confeitaria.",
      detalhes: "Apresentamos nossa seleção de doces finos com a atenção e o carinho que cada história merece — em um ambiente acolhedor, elegante e repleto de detalhes encantadores.",
      local: "R. Ari Barroso, 305 - Pres. Altino, Osasco - SP",
      preco: "R$ 50,00 por pessoa",
      botao: "AGENDE SUA VISITA",
    },
    {
      id: 2,
      img: degustacaoCasa,
      tipo: "Em sua casa",
      titulo: "Kit Festa",
      descricao: "Com nossa caixa de degustação, você leva a experiência Três Estações para o conforto da sua casa.",
      detalhes: "Cada detalhe é cuidadosamente preparado para que você prove nossos doces como se estivesse conosco — com texturas, sabores e acabamentos que traduzem nossa essência: delicadeza, sofisticação e afeto. Ideal para quem deseja explorar nossas criações com calma, ao lado de quem ama.",
      preco: "R$ 30,00 por kit",
      botao: "SOLICITE SUA VISITA",
    },
  ];

  const [expandedCard, setExpandedCard] = useState(null);

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="degustacoes-container">
    <img src={degustaçãoBanner} alt="Degustação Banner" style={{ width: '1200px', borderRadius: '30px', marginTop: '20px', height: '270px', marginBottom: '20px', border: '1px solid #7e473c' }} />


      <section className="events-list">
        <div className="events-grid"style={{marginBottom: '50px'}} >
          {degustacoes.map((deg) => (
            <div key={deg.id} className={`event-card ${expandedCard === deg.id ? "expanded" : ""}`}>
              <div className="event-img-wrapper">
                <img src={deg.img} alt={deg.titulo} className="event-img" />
              </div>
              <div className="event-content">
                <p><strong>{deg.tipo}</strong></p>
                <h3>{deg.titulo}</h3>
                <p>{deg.descricao}</p>

                <button className="btn-agendar" onClick={() => toggleCard(deg.id)}>
                  {deg.botao} <span className="btn-arrow">→</span>
                </button>

                {expandedCard === deg.id && (
                  <div className="expanded-info">
                    <p>{deg.detalhes}</p>
                    {deg.local && <p><strong>Local: </strong>{deg.local}</p>}
                    <p><strong>Preço: </strong>{deg.preco}</p>
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

export default Degustacoes;
