import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import fundo from "../../assets/fundodologin.png";
import "./Login.css";

const API_URL = "http://localhost:3000/api/users";

const Cadastro = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const enviarUsuario = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const novoUsuario = { nome, email, telefone, senha };

    try {
      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoUsuario),
      });

      const data = await resposta.json();

      if (!resposta.ok) {
        if (resposta.status === 409) {
          setErro("Este email já está cadastrado. Tente outro.");
        } else {
          setErro(data.message || "Erro ao cadastrar usuário.");
        }
        return;
      }

      setSucesso("Usuário cadastrado com sucesso!");
      setNome("");
      setEmail("");
      setTelefone("");
      setSenha("");

      setTimeout(() => navigate("/login"), 1500);
    } catch (erro) {
      console.error("Erro ao cadastrar usuário:", erro);
      setErro("Erro ao cadastrar usuário. Verifique os dados e tente novamente.");
    }
  };

  const voltarLogin = () => navigate("/login");

  return (
    <div className="login-page">
      <div className="login-overlay">
        <main className="login-container text-center">
          <h2 className="login-title">Cadastro</h2>

          <form onSubmit={enviarUsuario} className="login-form">
            <div className="input-group">
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="login-input"
              />
              <label className={nome ? "filled" : ""}>Nome completo</label>
            </div>

            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input"
              />
              <label className={email ? "filled" : ""}>Email</label>
            </div>

            <div className="input-group">
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
                className="login-input"
              />
              <label className={telefone ? "filled" : ""}>Telefone</label>
            </div>

            <div className="input-group">
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="login-input"
              />
              <label className={senha ? "filled" : ""}>Senha</label>
            </div>

            {erro && <div className="login-error">{erro}</div>}
            {sucesso && <div className="login-success">{sucesso}</div>}

            <button type="submit" className="login-button">Cadastrar</button>

            <button
              type="button"
              onClick={voltarLogin}
              className="login-register-link"
            >
              Já possui conta? Voltar ao login
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Cadastro;
