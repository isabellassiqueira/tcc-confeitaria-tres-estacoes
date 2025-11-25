import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductPage.css";

export default function ProductPage({ adicionarAoCarrinho }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [related, setRelated] = useState([]);

  const [mainImage, setMainImage] = useState(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [zoomScale, setZoomScale] = useState(1);

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // 🔥 Carregar produto atual
  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setMainImage(data.image);
      })
      .catch(console.error);
  }, [id]);

  // 🔥 Carregar TODOS os produtos
  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => setAllProducts(data))
      .catch(console.error);
  }, []);

  // 🔥 Produtos relacionados (quando produto e lista carregam)
  useEffect(() => {
    if (!product || allProducts.length === 0) return;

    const rel = allProducts
      .filter((p) => p.tipo === product.tipo && p.id !== product.id)
      .slice(0, 6);

    setRelated(rel);
  }, [product, allProducts]);

  // Controle do carrossel de relacionados
useEffect(() => {
  const carousel = document.getElementById("related-carousel");
  const btnLeft = document.getElementById("btn-related-left");
  const btnRight = document.getElementById("btn-related-right");

  if (!carousel) return;

  const scrollAmount = 300;

  btnLeft.onclick = () => {
    carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  btnRight.onclick = () => {
    carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };
}, [related]);


  if (!product) return <p>Carregando...</p>;

  const images = product.images || [product.image];

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const totalPrice = (product.price * quantity).toFixed(2);

  const handleAddToCart = () => {
    if (adding) return;
    setAdding(true);

    adicionarAoCarrinho({
      ...product,
      quantidade: quantity,
      preco: Number(product.price),
    });

    setTimeout(() => setAdding(false), 600);
  };

  return (
    <>
      <div className="product-page-modern">
        {/* IMAGEM */}
        <div className="image-section">
          <div className="oval-frame" onClick={() => setLightboxOpen(true)}>
            <img
              src={`http://localhost:3000${mainImage}`}
              alt={product.name}
            />
          </div>
        </div>

        {/* CONTEÚDO */}
        <div className="content-section">
          <span className="tag-modern">{product.tipo}</span>
          <h1 className="product-title-modern">{product.name}</h1>

          <div className="price-box-modern">
            <span className="new-price-modern">
              R$ {Number(product.price).toFixed(2)}
            </span>
          </div>

          <p className="product-description-modern">{product.description}</p>

          {/* QUANTIDADE */}
          <div className="quantity-addcart">
            <div className="quantity-box-modern">
              <button onClick={decrease}>−</button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
              <button onClick={increase}>+</button>
            </div>

            <button
              className="add-cart-btn-modern"
              onClick={handleAddToCart}
              disabled={adding}
            >
              {adding ? "Adicionando..." : "Adicionar à sacola"}
            </button>
          </div>

          <p className="total-modern">
            Total: <strong>R$ {totalPrice}</strong>
          </p>

          <div className="shipping-modern">
            <input placeholder="CEP" />
            <button>Calcular Frete</button>
          </div>
        </div>
      </div>

      {/* =============================== */}
      {/* 🔥 PRODUTOS RELACIONADOS */}
      {/* =============================== */}

      {related.length > 0 && (
        <section className="related-products-section">
  <h2 className="related-title">Produtos relacionados</h2>

  <div className="carousel-related-container">
    <button className="related-btn left" id="btn-related-left">
      ❮
    </button>

    <div className="related-list" id="related-carousel">
      {related.map((item) => (
        <div
          key={item.id}
          className="related-card"
          onClick={() => (window.location.href = `/produto/${item.id}`)}
        >
          <img
            src={`http://localhost:3000${item.image}`}
            alt={item.name}
          />
          <h3>{item.name}</h3>
          <p>R$ {Number(item.price).toFixed(2)}</p>
        </div>
      ))}
    </div>

    <button className="related-btn right" id="btn-related-right">
      ❯
    </button>
  </div>
</section>



      )}

      {/* =============================== */}
{/* ⭐ SEÇÃO DE AVALIAÇÕES COM FOTOS */}
{/* =============================== */}

<section className="reviews-section">
  <h2 className="reviews-title">O que nossos clientes dizem</h2>

  <div className="reviews-container">

    <div className="review-card">
      <div className="review-top">
        <img
          src="https://i.pravatar.cc/150?img=47"
          alt="Mariana Souza"
          className="review-avatar"
        />
        <div>
          <span className="review-name">Mariana Souza</span>
          <span className="review-stars">★★★★★</span>
        </div>
      </div>

      <p className="review-text">
        Os bolos são simplesmente incríveis! Sabor autêntico, delicado e
        sempre fresquinhos. Atendimento impecável!
      </p>
    </div>

    <div className="review-card">
      <div className="review-top">
        <img
          src="https://i.pravatar.cc/150?img=32"
          alt="Ana Paula"
          className="review-avatar"
        />
        <div>
          <span className="review-name">Ana Paula</span>
          <span className="review-stars">★★★★★</span>
        </div>
      </div>

      <p className="review-text">
        Comprei para um aniversário e foi um sucesso. A embalagem é linda e o
        bolo estava maravilhoso. Ganhou uma cliente fiel!
      </p>
    </div>

    <div className="review-card">
      <div className="review-top">
        <img
          src="https://i.pravatar.cc/150?img=15"
          alt="Felipe Martins"
          className="review-avatar"
        />
        <div>
          <span className="review-name">Felipe Martins</span>
          <span className="review-stars">★★★★★</span>
        </div>
      </div>

      <p className="review-text">
        A confeitaria tem os melhores doces da região. Textura perfeita e
        sabores memoráveis. Vale cada centavo!
      </p>
    </div>

  </div>
</section>

      {/* =============================== */}
{/* 🔍 LIGHTBOX SIMPLES */}
{/* =============================== */}
{lightboxOpen && (
  <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
      <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>×</button>

      <img
        src={`http://localhost:3000${mainImage}`}
        alt={product.name}
        className="lightbox-image"
      />
    </div>
  </div>
)}

    </>
  );
}
