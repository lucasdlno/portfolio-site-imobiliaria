// backend/index.js

// =======================================================
// PARTE 1: IMPORTAÇÕES E CONFIGURAÇÕES INICIAIS
// =======================================================
require('dotenv').config(); // Garante que as variáveis de ambiente sejam carregadas
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// IMPORTAÇÃO DAS NOSSAS ROTAS SEPARADAS
const imoveisRoutes = require('./routes/imoveis');
const authRoutes = require('./routes/auth');

// =======================================================
// PARTE 2: INICIALIZAÇÃO DO APP E MIDDLEWARES GERAIS
// =======================================================
const app = express();

// Configurações de CORS (ajuste 'origin' em produção se necessário)
// CÓDIGO CORRIGIDO E MAIS ROBUSTO
const allowedOrigins = [
  'http://localhost:3000', // Sua máquina para desenvolvimento
  process.env.FRONTEND_URL  // O endereço do seu site online
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem 'origin' (como apps mobile ou Postman) ou se a origem está na lista
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
// Middlewares para interpretar o corpo das requisições e cookies
app.use(express.json());
app.use(cookieParser());

// =======================================================
// PARTE 3: MONTANDO AS ROTAS DA API
// =======================================================
// Todas as rotas que começarem com /api/imoveis serão gerenciadas pelo imoveisRoutes
// CÓDIGO ATUAL (INCORRETO - causa o conflito)
// CÓDIGO CORRIGIDO
// Cada conjunto de rotas tem seu próprio prefixo, sem conflitos.
app.use('/api/imoveis', imoveisRoutes);
app.use('/api/auth', authRoutes); // Boa prática adicionar /auth para clareza

// Rota de "boas-vindas" para a API, para verificar se está online
app.get('/api', (req, res) => {
  res.json({ message: 'Bem-vindo à API da Gomes Imóveis! 🚀' });
});


// =======================================================
// PARTE 4: TRATAMENTO DE ERROS CENTRALIZADO
// =======================================================
// Este middleware especial só é executado se ocorrer um erro em alguma rota
app.use((err, req, res, next) => {
  console.error('====================================');
  console.error('🚨 ERRO NA APLICAÇÃO:', err.stack);
  console.error('====================================');
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ocorreu um erro interno no servidor.';
  
  res.status(statusCode).json({ message });
});


// =======================================================
// PARTE 5: INICIALIZAÇÃO DO SERVIDOR
// =======================================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
});