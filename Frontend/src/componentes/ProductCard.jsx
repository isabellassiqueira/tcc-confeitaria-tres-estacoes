import './ProductCard.css';
import { FiShoppingBag } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, adicionarProduto }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/produto/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (adicionarProduto)
      adicionarProduto({
        ...product,
        preco: Number(product.price), // 🔥 padronizado para o carrinho
        quantidade: 1,
      });
  };

  return (
    <div
      className="product-card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >

      <img
        src={
          product.image
            ? `http://localhost:3000${product.image}`
            : "/placeholder.png"
        }
        alt={product.name}
      />

      <div className="product-info">
        <span className="tag-premium">
          {product.tipo.charAt(0).toUpperCase() + product.tipo.slice(1)}
        </span>

        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <p className="product-price">
          R$ {Number(product.price).toFixed(2)}
        </p>
      </div>

      <div className="product-actions">
        <div className="action-btn" onClick={handleAddToCart}>
          ADICIONAR <FiShoppingBag size={22} />
        </div>
      </div>
    </div>
  );
}
