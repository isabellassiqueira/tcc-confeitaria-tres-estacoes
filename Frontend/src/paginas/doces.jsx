// Código completo para Doces.jsx (baseado em Bolos.jsx)
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import "./doces.css";
import "../componentes/ProductCard.css";

const API = "http://localhost:3000/api/products";

export default function Doces({ adicionarAoCarrinho }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [produtos, setProdutos] = useState([]);
  const [likes, setLikes] = useState({});
  const [carregando, setCarregando] = useState(true);

  const [appliedFilters, setAppliedFilters] = useState({
    tipo: "todos",
    min: "",
    max: "",
    order: "default",
  });

  const [selectedType, setSelectedType] = useState("todos");
  const [pendingMin, setPendingMin] = useState("");
  const [pendingMax, setPendingMax] = useState("");
  const [pendingOrder, setPendingOrder] = useState("default");

  const formatarNumero = (valor) => {
    if (!valor) return 0;
    return Number(String(valor).replace(",", "."));
  };

  const applyFilters = () => {
    setAppliedFilters({
      tipo: selectedType,
      min: pendingMin,
      max: pendingMax,
      order: pendingOrder,
    });
  };

  const clearFilters = () => {
    setSelectedType("todos");
    setPendingMin("");
    setPendingMax("");
    setPendingOrder("default");

    setAppliedFilters({
      tipo: "todos",
      min: "",
      max: "",
      order: "default",
    });
  };

  useEffect(() => {
    axios
      .get(API)
      .then((res) => {
        setProdutos(res.data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
        setCarregando(false);
      });

    const storedLikes = JSON.parse(localStorage.getItem("likes") || "{}");
    setLikes(storedLikes);
  }, []);

  const doces = produtos.filter(
    (produto) =>
      produto.tipo?.toLowerCase() === "doce" ||
      produto.tipo?.toLowerCase() === "doces"
  );

  let filteredDoces = doces
    .filter((p) =>
      appliedFilters.tipo === "todos" ? true : p.tipo === appliedFilters.tipo
    )
    .filter((p) =>
      appliedFilters.min === ""
        ? true
        : formatarNumero(p.price) >= Number(appliedFilters.min)
    )
    .filter((p) =>
      appliedFilters.max === ""
        ? true
        : formatarNumero(p.price) <= Number(appliedFilters.max)
    );

  if (appliedFilters.order === "price-asc") {
    filteredDoces.sort(
      (a, b) => formatarNumero(a.price) - formatarNumero(b.price)
    );
  } else if (appliedFilters.order === "price-desc") {
    filteredDoces.sort(
      (a, b) => formatarNumero(b.price) - formatarNumero(a.price)
    );
  }

  const curtirProduto = (produto) => {
    const novosLikes = { ...likes, [produto.id]: !likes[produto.id] };
    setLikes(novosLikes);
    localStorage.setItem("likes", JSON.stringify(novosLikes));
  };

  const isCurtido = (id) => !!likes[id];

  if (carregando) {
    return (
      <div className="text-center py-5">
        <h3>Carregando produtos...</h3>
      </div>
    );
  }

  return (
    <div className="container doces-page">
      <div className="banner">
        <h1>Nossos Doces</h1>
      </div>

      <div className="bolos-layout">
        <aside className="filter-sidebar">
          <h3>Filtros</h3>

          <button className="clear-filters-btn" onClick={clearFilters}>
            Limpar filtros
          </button>

          <div className="filter-group">
            <label>Preço mínimo</label>
            <input
              type="number"
              value={pendingMin}
              onChange={(e) => setPendingMin(e.target.value)}
              placeholder="R$"
            />
          </div>

          <div className="filter-group">
            <label>Preço máximo</label>
            <input
              type="number"
              value={pendingMax}
              onChange={(e) => setPendingMax(e.target.value)}
              placeholder="R$"
            />
          </div>

          <div className="filter-group">
            <label>Ordenar por:</label>
            <select
              value={pendingOrder}
              onChange={(e) => setPendingOrder(e.target.value)}
            >
              <option value="default">Padrão</option>
              <option value="price-asc">Preço: menor → maior</option>
              <option value="price-desc">Preço: maior → menor</option>
            </select>
          </div>

          <button className="apply-btn" onClick={applyFilters}>
            Aplicar Filtros
          </button>
        </aside>

        <div className="products-wrapper">
          {filteredDoces.length > 0 ? (
            filteredDoces.map((produto) => (
              <div
                key={produto.id}
                className="product-card"
                onClick={() => navigate(`/produto/${produto.id}`)}
              >
                <img
                  src={`http://localhost:3000${produto.image}`}
                  alt={produto.name}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=Sem+Imagem";
                  }}
                />

                <div className="product-info">
                  <span className="tag-premium">{produto.tipo}</span>
                  <h3>{produto.name}</h3>
                  <p>{produto.description}</p>

                  <div className="product-price">
                    R$ {formatarNumero(produto.price).toFixed(2)}
                  </div>
                </div>

                <div className="product-actions">
                  <div
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      adicionarAoCarrinho({
                        ...produto,
                        preco: formatarNumero(produto.price),
                      });
                    }}
                  >
          ADICIONAR <FiShoppingBag size={22} />
        </div>
                  </div>
                </div>
            
            ))
          ) : (
            <div className="text-center py-5">
              <h3>Nenhum doce encontrado com os filtros aplicados.</h3>
              <Link to="/" className="btn btn-primary">
                Voltar ao início
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}