import React from "react";
import { Link } from "react-router-dom";
import "./AdminPage.css";

export default function AdminPage() {
  return (
    <div className="admin-container">
      <h1>Painel Administrativo</h1>
      <p>Painel de controle da Confeitaria Três Estações.</p>

      <div className="admin-links">
        <Link to="/usuarios">Gerenciar Usuários</Link>
        <Link to="/produtos">Gerenciar Produtos</Link>
        <Link to="/pedidos">Pedidos</Link>
      </div>
    </div>
  );
}
