import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

import "./SearchResults.css";
import "../componentes/ProductCard.css";

export default function SearchResults({ products, adicionarAoCarrinho }) {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query")?.toLowerCase() || "";

  /* =================== FORMATAR PREÇO =================== */
  const formatarNumero = (valor) => {
    if (!valor) return 0;
    return Number(String(valor).replace(",", "."));
  };

  /* =================== ESTADOS =================== */
  const [appliedFilters, setAppliedFilters] = useState({
    tipo: "todos",
    min: "",
    max: "",
    order: "default",
  });

  const [pendingMin, setPendingMin] = useState("");
  const [pendingMax, setPendingMax] = useState("");
  const [pendingOrder, setPendingOrder] = useState("default");
  const [selectedType, setSelectedType] = useState("todos");

  const [likes, setLikes] = useState({});

  /* =================== FILTRAGEM =================== */
  const applyFilters = () => {
    setAppliedFilters({
      tipo: selectedType,
      min: pendingMin,
      max: pendingMax,
      order: pendingOrder,
    });
  };

  const clearFilters = () => {
    setPendingMin("");
    setPendingMax("");
    setPendingOrder("default");
    setSelectedType("todos");

    setAppliedFilters({
      tipo: "todos",
      min: "",
      max: "",
      order: "default",
    });
  };

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likes") || "{}");
    setLikes(storedLikes);
  }, []);

  const curtirProduto = (produto) => {
    const novosLikes = { ...likes, [produto.id]: !likes[produto.id] };
    setLikes(novosLikes);
    localStorage.setItem("likes", JSON.stringify(novosLikes));
  };

  const isCurtido = (id) => !!likes[id];

  /* =================== PRODUTOS FILTRADOS =================== */
  let filteredProducts = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    )
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
    filteredProducts.sort(
      (a, b) => formatarNumero(a.price) - formatarNumero(b.price)
    );
  } else if (appliedFilters.order === "price-desc") {
    filteredProducts.sort(
      (a, b) => formatarNumero(b.price) - formatarNumero(a.price)
    );
  }

  /* =================== HTML =================== */
  return (
    <div className="search-results-wrapper">
      {/* ========== SIDEBAR ========== */}
      <aside className="filter-sidebar">
        <h3>Filtros</h3>

        <button className="clear-filters-btn" onClick={clearFilters}>
          Limpar filtros
        </button>

        <div className="filter-container">
          {["todos", "bolos", "doce", "salgados", "bebidas", "especial"].map(
            (tipo) => (
              <button
                key={tipo}
                className={`filter-btn ${
                  selectedType === tipo ? "selected" : ""
                }`}
                onClick={() => setSelectedType(tipo)}
              >
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </button>
            )
          )}
        </div>

        {/* PREÇO MÍNIMO */}
        <div className="filter-group">
          <label>Preço mínimo</label>
          <input
            type="number"
            value={pendingMin}
            onChange={(e) => setPendingMin(e.target.value)}
            placeholder="R$"
          />
        </div>

        {/* PREÇO MÁXIMO */}
        <div className="filter-group">
          <label>Preço máximo</label>
          <input
            type="number"
            value={pendingMax}
            onChange={(e) => setPendingMax(e.target.value)}
            placeholder="R$"
          />
        </div>

        {/* ORDENAR */}
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

      {/* ========== LISTA DE PRODUTOS =================== */}
      <div className="search-results">
        <p className="searched-text">
          Você pesquisou por: <strong>{query}</strong>
        </p>

        <div className="products-wrapper">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((produto) => (
              <div
                key={produto.id}
                className="product-card"
                onClick={() => navigate(`/produto/${produto.id}`)}
              >
                <img
                  src={
                    produto.image
                      ? `http://localhost:3000${produto.image}`
                      : "https://via.placeholder.com/400x300?text=Sem+Imagem"
                  }
                  alt={produto.name}
                />

                <div className="product-info">
                  <h3>{produto.name}</h3>
                  <p>{produto.description}</p>
                  <div className="product-price">
                    R$ {formatarNumero(produto.price).toFixed(2)}
                  </div>
                </div>

                <div className="product-actions">
                  {/* ADICIONAR À SACOLA */}
                  <div
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      adicionarAoCarrinho({
                        ...produto,
                        preco: formatarNumero(produto.price),
                        quantidade: 1,
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
              <h3>Nenhum produto encontrado com os filtros aplicados.</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
