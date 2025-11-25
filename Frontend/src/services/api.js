// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function loginRequest({ email, senha }) {
  // log útil de depuração
  console.log('[api.loginRequest] ->', API_URL, { email });

  const res = await fetch(`${API_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });

  // Se der erro, tenta extrair mensagem do backend
  if (!res.ok) {
    let msg = 'Falha no login';
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }

  const data = await res.json(); // { message, token, user:{id,email,nome,role} }
  console.log('[api.loginRequest] OK <-', data);
  return data;
}
