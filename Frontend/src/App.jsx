import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { FiShoppingBag, FiUser, FiSearch } from "react-icons/fi";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";

import axios from "axios";
import "./App.css";

import ConfeitariaDoGatinho from "./paginas/ConfeitariaDoGatinho";
import Login from "./componentes/Usuarios/Login";
import CadastrarUsuarios from "./componentes/Usuarios/CadastrarUsuarios";
import EditarMeuPerfil from "./componentes/Usuarios/EditarMeuPerfil";
import MeusPedidos from "./componentes/Usuarios/MeusPedidos";
import logo from "./assets/logo.png";
import Bolos from "./paginas/bolos";
import Doces from "./paginas/doces";
import Salgados from "./paginas/salgados";
import Bebidas from "./paginas/bebidas";
import Especiais from "./paginas/especiais";
import Degustaçoes from "./paginas/degustaçoes";
import Festas from "./paginas/festas";
import CadastrarUsuario from "./componentes/Usuarios/CadastrarUsuarios";
import ProductPage from "./paginas/ProductPage";
import SearchResults from "./paginas/SearchResults";
import ListarUsuarios from "./componentes/Admin/ListarUsuarios";
import GerenciarProdutos from "./componentes/Admin/GerenciarProdutos";
import GerenciarPedidos from "./componentes/Admin/GerenciarPedidos";
import AdminPage from "./componentes/Admin/AdminPage";
import Sacola from "./componentes/Sacola";
import MinhaSacola from "./componentes/MinhaSacola";

const PaginaNaoEncontrada = () => (
  <div className="text-center py-5">
    <h2>Página não encontrada</h2>
    <p>A página que você está procurando não existe.</p>
    <Link to="/" className="btn btn-primary">Voltar à Home</Link>
  </div>
);

function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/admin" />;
  return children;
}

const App = () => {
  const location = useLocation();
  const navegar = useNavigate();
  const { user, logout } = useAuth();

  const [busca, setBusca] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [carrinho, setCarrinho] = useState([]);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const toggleCarrinho = () => setCarrinhoAberto(!carrinhoAberto);

  const adicionarAoCarrinho = (produto) => {
    setCarrinho((prev) => {
      const itemExistente = prev.find((item) => item.id === produto.id);
      if (itemExistente) {
        return prev.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      } else {
        return [...prev, { ...produto, quantidade: 1 }];
      }
    });
    setCarrinhoAberto(true);
  };

  const handleLogout = () => {
    logout();
    navegar("/login");
  };

  const handleSearch = () => {
    if (busca.trim() !== "") {
      navegar(`/search?query=${encodeURIComponent(busca)}`);
      setBusca("");
    }
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar produtos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando produtos...</p>;

  return (
    <>
      <div className="app">
        {/* ====== HEADER ====== */}
<header className="header-container">
  <div className="header-row">

    {/* ESQUERDA — BUSCA */}
    <div className="header-left">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
        />
      </div>
    </div>

    {/* CENTRO — LOGO */}
    <div className="header-center">
      <div className="logo-img">
        <img src={logo} alt="Confeitaria" />
      </div>
    </div>

    {/* DIREITA — USER + CARRINHO */}
   <div className="header-right">

  {/* 🔸 MENU DO USUÁRIO */}
  {user ? (
    <>
      <div className="user-menu-wrapper">
        <button onClick={toggleUserMenu} className="user-button">
          <FiUser size={22} color="#9D6155" />
          <span>{user.nome}</span>
        </button>

        {userMenuOpen && (
          <div className="user-dropdown">
            <Link to="/meu-perfil">Editar Perfil</Link>
            <Link to="/meus-pedidos">Meus Pedidos</Link>
            <button onClick={handleLogout}>Sair</button>
          </div>
        )}
      </div>

      {/* 🔸 SACOLA / CARRINHO */}
      <div className="carrinho-wrapper" onClick={toggleCarrinho}>
        <FiShoppingBag size={25} color="#9D6155" className="bag-icon" />

        {/* Badge da quantidade */}
        {carrinho.length > 0 && (
          <span className="carrinho-badge">{carrinho.length}</span>
        )}
      </div>
    </>
  ) : (
    <Link to="/login">
      <button className="btn-login">
        <FiUser size={22} color="#9D6155" />
      </button>
    </Link>
  )}

</div>
</div>
</header>

        {/* Navegação do cabeçalho */}
        <div className="nav-docabecalho">
          <nav>
            <Link to="/" className="active">Início</Link>
            <div className="modern-dropdown">
              <a href="#cardapio">Categorias<span className="dropdown-indicator">▼</span></a>
              <div className="modern-dropdown-content">
                <Link to="/bolos">Bolos</Link>
                <Link to="/doces">Doces</Link>
                <Link to="/salgados">Salgados</Link>
                <Link to="/bebidas">Bebidas</Link>
                <Link to="/especiais">Especiais</Link>
              </div>
            </div>
            <Link to="/festas">Festas</Link>
            <Link to="/degustacoes">Degustações</Link>
            {user?.role?.trim().toLowerCase() === "admin" && (
              <div className="modern-dropdown">
     <a href="#admin" className="admin-link">
  Admin
  <FiSettings className="admin-icon" />
  <span className="dropdown-indicator">▼</span>
</a>
                <div className="modern-dropdown-content">
                  <Link to="/admin">Painel Principal</Link>
                  <Link to="/usuarios">Gerenciar Usuários</Link>
                  <Link to="/produtos">Gerenciar Produtos</Link>
                  <Link to="/pedidos">Pedidos</Link>
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* ROTAS */}
        <div>
          <Routes>
            <Route path="/" element={<ConfeitariaDoGatinho adicionarAoCarrinho={adicionarAoCarrinho} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<CadastrarUsuario />} />
            <Route path="/admin/cadastrar" element={<CadastrarUsuarios />} />
            <Route path="/meu-perfil" element={<EditarMeuPerfil />} />
            <Route path="/meus-pedidos" element={<MeusPedidos />} />
            <Route path="/usuarios" element={<ListarUsuarios />} />
            <Route path="/produtos" element={<GerenciarProdutos/>} />
            <Route path="/pedidos" element={<GerenciarPedidos/>}/>
            <Route path="/produto/:id" element={<ProductPage adicionarAoCarrinho={adicionarAoCarrinho} />} />
            <Route path="/search" element={<SearchResults products={products} adicionarAoCarrinho={adicionarAoCarrinho} />} />
            <Route path="/bolos" element={<Bolos adicionarAoCarrinho={adicionarAoCarrinho} />} />
            <Route path="/doces" element={<Doces adicionarAoCarrinho={adicionarAoCarrinho} />} />
            <Route path="/salgados" element={<Salgados adicionarAoCarrinho={adicionarAoCarrinho} />} />
            <Route path="/bebidas" element={<Bebidas adicionarAoCarrinho={adicionarAoCarrinho} />} />
            <Route path="/especiais" element={<Especiais adicionarAoCarrinho={adicionarAoCarrinho} />} />
            <Route path="/degustacoes" element={<Degustaçoes adicionarAoCarrinho={adicionarAoCarrinho} />} />
            <Route path="/festas" element={<Festas adicionarAoCarrinho={adicionarAoCarrinho} />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/sacola" element={Sacola} />
            <Route path="/minha-sacola" element={<MinhaSacola carrinho={carrinho} setCarrinho={setCarrinho} />} />
            <Route path="*" element={<PaginaNaoEncontrada />} />
          </Routes>
        </div>

        {/* SACOLA */}
        {carrinhoAberto && (
          <Sacola
            carrinho={carrinho}
            setCarrinho={setCarrinho}
            toggleCarrinho={toggleCarrinho}
            finalizarPedido={() => {}}
          />
        )}

        {/* Rodapé */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-col">
              <h4>Informações</h4>
              <p>Horário de funcionamento:<br/>
                <strong>Seg à Sáb:</strong> 7:30 às 18:30<br/>
                <strong>Dom & Feriados:</strong> 7:00 às 14:00
              </p>
              <p>Endereço:<br/>R. Ari Barroso, 305 – Pres. Altino, Osasco – SP</p>
            </div>
            <div className="footer-col">
              <h4>Links Úteis</h4>
              <Link to="/">Início</Link>
              <Link to="/search">Cardápio</Link>
              <a href="#contato">Contato</a>
              <a href="#termosdeuso">Termos de Uso</a>
              <a href="#politicadeprivacidade">Política de Privacidade</a>
            </div>
<div className="footer-col">
  <h4>Redes Sociais</h4>
  <div className="social-links flex gap-4 mt-2">
    <a href="#" aria-label="Instagram" className="text-pink-500 hover:text-pink-600">
      <FaInstagram size={30} />
      @confeitaria3estações
    </a>
    <a href="#" aria-label="Facebook" className="text-blue-600 hover:text-blue-700">
      <FaFacebook size={30} />
      @confeitaria3estações
    </a>
    <a href="#" aria-label="WhatsApp" className="text-green-500 hover:text-green-600">
      <FaWhatsapp size={30} />
      (11) 91234-5678
    </a>
  </div>

            </div>
          </div>
          <div className="footer-bottom">
            © 2025 Três Estações. Todos os direitos reservados.
          </div>
        </footer>
      </div>
    </>
  );
};

export default App;
