import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../../paginas/ProductForm";
import "./GerenciarProdutos.css";

const API = "http://localhost:3000/api/products";

export default function GerenciarProdutos() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filterType, setFilterType] = useState("todos");

  /* ==========================
     BUSCAR PRODUTOS
     ========================== */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API);
      setProducts(res.data);
    } catch (err) {
      console.error("❌ Erro ao buscar produtos:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ==========================
     FILTRAR PRODUTOS
     ========================== */
  const filteredProducts = products.filter((p) =>
    filterType === "todos" ? true : p.tipo === filterType
  );

  /* ==========================
     EXCLUIR
     ========================== */
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await axios.delete(`${API}/${id}`);
        alert("✅ Produto excluído!");
        fetchProducts();
      } catch (err) {
        console.error("❌ Erro ao excluir:", err);
        alert("Erro ao excluir produto.");
      }
    }
  };

  /* ==========================
     EDITAR
     ========================== */
  const handleEdit = (product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ==========================
     FINALIZAR EDIÇÃO
     ========================== */
  const handleFinishEdit = () => {
    setEditingProduct(null);
    fetchProducts(); // garante atualização da lista
  };

  return (
    <div className="produtos-container">

      {/* ====================================================
         FORM DE CADASTRO / EDIÇÃO
      ==================================================== */}
      <section className="produtos-form-card">
        <h2 className="section-title">
          {editingProduct ? "Editar Produto" : "Cadastrar Produto"}
        </h2>

        <ProductForm
          onUpload={fetchProducts}
          productToEdit={editingProduct}
          onFinishEdit={handleFinishEdit}
        />
      </section>

      {/* ====================================================
         LISTA / GRID DE PRODUTOS
      ==================================================== */}
      <section className="produtos-lista-card">
        <h2 className="section-title">Cardápio Cadastrado</h2>

        {/* ======== FILTROS ======== */}
        <div className="filter-container">
          {[
            "todos",
            "bolos",
            "doces",
            "salgados",
            "bebidas",
            "especial",
          ].map((tipo) => (
            <button
              key={tipo}
              className={`filter-btn ${filterType === tipo ? "active" : ""}`}
              onClick={() => setFilterType(tipo)}
            >
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </button>
          ))}
        </div>

        {/* ======== GRID ======== */}
        <div className="produtos-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="produto-card">
              <img
                src={
                  product.image
                    ? `http://localhost:3000${product.image}`
                    : "/placeholder.png"
                }
                alt={product.name}
                className="produto-img"
              />

              <div className="produto-info">
                {/* NOME E PREÇO */}
                <div className="produto-topo">
                  <h3>{product.name}</h3>
                  <span className="produto-preco">
                    R$ {Number(product.price).toFixed(2)}
                  </span>
                </div>

                {/* DESCRIÇÃO */}
                <p className="produto-desc">{product.description}</p>

                {/* BOTÕES */}
                <div className="produto-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(product)}
                  >
                    ✏️ Editar
                  </button>

                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(product.id)}
                  >
                    🗑️ Excluir
                  </button>
                </div>

                {/* TAG DE TIPO */}
                <span className={`tag tag-${product.tipo}`}>
                  {product.tipo.charAt(0).toUpperCase() + product.tipo.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
