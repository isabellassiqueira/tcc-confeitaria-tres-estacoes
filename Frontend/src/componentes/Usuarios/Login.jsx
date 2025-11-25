import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";
import logo from "../../assets/logo.png";

const Login = () => {
  const navegar = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const [resetVisible, setResetVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  // LOGIN
  const acessar = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const resposta = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await resposta.json();

      if (resposta.status === 200) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);

        data.user?.role?.toLowerCase() === "admin"
          ? navegar("/admin")
          : navegar("/");
      } else if (resposta.status === 401) {
        setErro("Email ou senha inválidos");
      } else {
        setErro("Erro inesperado");
      }
    } catch (err) {
      console.error(err);
      setErro("ERRO: " + err.message);
    }
  };

  // REDEFINIÇÃO DE SENHA
  const enviarResetSenha = async () => {
    setResetMsg("");
    try {
      const resposta = await fetch("http://localhost:3000/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await resposta.json();
      if (resposta.ok) {
        setResetMsg("Email enviado com instruções para redefinir a senha.");
      } else {
        setResetMsg(data.message || "Erro ao solicitar redefinição.");
      }
    } catch (err) {
      setResetMsg("Erro: " + err.message);
    }
  };

  const cadastrar = () => navegar("/cadastro");

  return (
    <div className="login-page">
      <div className="login-overlay">
        <main className="login-container">
          <h2 className="login-title">Login</h2>
          <form onSubmit={acessar} className="login-form">
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
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="login-input"
              />
              <label className={senha ? "filled" : ""}>Senha</label>
            </div>

            {erro && <div className="login-error">{erro}</div>}

            <button type="submit" className="login-button">Acessar</button>
          </form>

          <p className="login-register">
            Não tem conta?{" "}
            <button onClick={cadastrar} className="login-register-link">
              Clique aqui
            </button>
          </p>

          <p className="forgot-password">
            <button type="button" onClick={() => setResetVisible(true)} className="login-register-link">
              Esqueci minha senha
            </button>
          </p>
        </main>
      </div>

      {/* MODAL DE REDIFINIÇÃO */}
      {resetVisible && (
        <div className="reset-modal">
          <div className="reset-container">
            <h3>Redefinir senha</h3>
            <div className="input-group">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="login-input"
                required
              />
              <label className={resetEmail ? "filled" : ""}>Digite seu email</label>
            </div>

            {resetMsg && <div className="login-success">{resetMsg}</div>}

            <button onClick={enviarResetSenha} className="login-button">Enviar</button>
            <button onClick={() => setResetVisible(false)} className="login-register-link">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
