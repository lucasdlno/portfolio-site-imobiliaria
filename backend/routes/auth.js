// backend/routes/auth.js

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// ROTA DE LOGIN ATUALIZADA
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }
    
    // ✅ MUDANÇA PRINCIPAL: Retorna o token no corpo da resposta
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ message: 'Login bem-sucedido!', token: token });

  } catch (error) {
    next(error);
  }
});

// ROTA DE LOGOUT ATUALIZADA (agora é mais simples)
router.post('/logout', (req, res) => {
  // A remoção do cookie agora é responsabilidade do frontend
  res.json({ message: 'Logout sinalizado.' });
});

module.exports = router;