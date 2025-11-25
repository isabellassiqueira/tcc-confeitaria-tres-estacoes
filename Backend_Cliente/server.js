// Backend_Cliente/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');


const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const pedidosRoutes = require("./routes/pedidos"); // ⚡ define pedidosRoutes


const db = require('./db'); // vamos validar a conexão ao subir

const app = express();

/* ========= Middlewares ========= */
const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api/pedidos", pedidosRoutes);


/* ========= Healthcheck ========= */
app.get('/api/health', (_req, res) =>
  res.json({
    ok: true,
    env: process.env.NODE_ENV || 'dev',
    db: 'pending', // será atualizado após teste abaixo
  })
);

/* ========= Rotas da API ========= */
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use("/api/pedidos", pedidosRoutes);

/* ========= 404 ========= */
app.use((_req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

/* ========= Tratador global de erros ========= */
app.use((err, _req, res, _next) => {
  console.error('Erro não tratado:', err);
  const status = err.status || 500;
  res
    .status(status)
    .json({ message: err.message || 'Erro interno do servidor' });
});

/* ========= Sobe o servidor ========= */
const PORT = Number(process.env.PORT || 3000);

async function bootstrap() {
  // Testa a conexão com o banco antes de iniciar o HTTP
  try {
    const conn = await db.getConnection();
    await conn.ping();
    conn.release();
    console.log(
      `✅ DB OK em ${process.env.DB_HOST}:${process.env.DB_PORT || 3306
      } / ${process.env.DB_NAME}`
    );
  } catch (e) {
    console.error('❌ Falha ao conectar no banco:', e.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 API rodando em http://localhost:${PORT}`);
    console.log(`🌐 CORS liberado para: ${FRONTEND_ORIGIN}`);
  });
}

bootstrap();

module.exports = app;