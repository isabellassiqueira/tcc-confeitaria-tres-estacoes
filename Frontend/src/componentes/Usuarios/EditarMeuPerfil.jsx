import React, { useState, useEffect } from "react";
import { FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";
import "./EditarMeuPerfil.css";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function EditarMeuPerfil() {
  const { user, updateUser } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    if (user) {
      setNome(user.nome || "");
      setEmail(user.email || "");
      setTelefone(user.telefone || "");
    }
  }, [user]);

 // ...existing code...
  const salvarAlteracoes = async () => {
    setErro("");
    setSucesso("");

    if (senha && senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setSalvando(true);

      const body = {
        nome,
        email,
        telefone,
        ...(senha && { senha }),
      };

      const response = await axios.put(
        `http://localhost:3000/api/users/${user.id}`,
        body,
        { validateStatus: () => true } // evita cair no catch automaticamente
      );

      console.log("PUT /api/users response:", response.status, response.data);

      if (response.status >= 200 && response.status < 300) {
        // tenta pegar user retornado, senão usa response.data, senão usa fallback com os dados locais
        const updated =
          response.data?.user || response.data || { ...user, nome, email, telefone };

        updateUser(updated);
        setSucesso("Perfil atualizado com sucesso!");
        setErro("");
      } else {
        const msg =
          response.data?.message || response.data?.error || `Erro ${response.status} ao salvar alterações.`;
        setErro(msg);
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao salvar alterações.");
    } finally {
      setSalvando(false);
    }
  };
// ...existing code...

  return (
    <div className="editar-perfil-container">
      <div className="editar-perfil-card">
        <h2>Editar Meu Perfil</h2>

        {erro && <p className="erro-msg">{erro}</p>}
        {sucesso && <p className="sucesso-msg">{sucesso}</p>}

        <div className="campo">
          <FiUser />
          <input
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="campo">
          <FiMail />
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="campo">
          <FiPhone />
          <input
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>

        <div className="campo">
          <FiLock />
          <input
            type="password"
            placeholder="Nova senha (opcional)"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <div className="campo">
          <FiLock />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
        </div>

        <button
          className="btn-salvar"
          onClick={salvarAlteracoes}
          disabled={salvando}
        >
          {salvando ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </div>
  );
}
