// backend/routes/imoveis.js

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();

// MIDDLEWARES
// ✅ MIDDLEWARE ATUALIZADO para ler o token do cabeçalho
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Acesso não autorizado. Token não fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }
    req.user = user;
    next();
  });
};

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const upload = multer({ storage: multer.memoryStorage() });


// ROTAS PÚBLICAS
router.get('/', async (req, res, next) => {
  try {
    const { termo, quartos, status, area_min, area_max, page = 1, limit = 9 } = req.query;
    const whereClause = {};

    if (termo) { whereClause.OR = [ { titulo: { contains: termo, mode: 'insensitive' } }, { cidade: { contains: termo, mode: 'insensitive' } }, { bairro: { contains: termo, mode: 'insensitive' } } ]; }
    if (quartos) whereClause.quartos = { gte: parseInt(quartos) };
    if (status) whereClause.status = status;
    if (area_min) whereClause.area_total = { ...whereClause.area_total, gte: parseInt(area_min) };
    if (area_max) whereClause.area_total = { ...whereClause.area_total, lte: parseInt(area_max) };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [totalImoveis, imoveis] = await prisma.$transaction([
      prisma.imovel.count({ where: whereClause }),
      prisma.imovel.findMany({ where: whereClause, orderBy: { data_criacao: 'desc' }, skip, take: limitNum, include: { imagens: true } }),
    ]);
    
    res.json({ imoveis, total: totalImoveis, page: pageNum, totalPages: Math.ceil(totalImoveis / limitNum) });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const imovelId = parseInt(req.params.id);
    if (isNaN(imovelId)) return res.status(400).json({ message: 'ID do imóvel inválido.' });
    const imovel = await prisma.imovel.findUnique({ where: { id: imovelId }, include: { imagens: true } });
    if (!imovel) return res.status(404).json({ message: 'Imóvel não encontrado.' });
    res.json(imovel);
  } catch (error) {
    next(error);
  }
});


// =======================================================
// ROTAS PROTEGIDAS
// =======================================================

// ROTA DE UPLOAD UNIFICADA
router.post('/upload', authenticateToken, upload.array('imagens', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }
    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }).end(file.buffer);
      });
    });
    const urls = await Promise.all(uploadPromises);
    res.json({ urls: urls, url: urls[0] }); 
  } catch (error) {
    next(error);
  }
});


// ROTA PARA CRIAR UM NOVO IMÓVEL (NÃO TEM MULTER)
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { titulo, preco, ...outrosDados } = req.body;
    if (!titulo || !preco) return res.status(400).json({ message: 'Título e Preço são campos obrigatórios.' });
    const novoImovel = await prisma.imovel.create({
      data: {
        ...outrosDados,
        titulo,
        preco: parseFloat(preco),
        quartos: parseInt(outrosDados.quartos),
        banheiros: parseInt(outrosDados.banheiros),
        area_total: parseInt(outrosDados.area_total),
      },
    });
    res.status(201).json(novoImovel);
  } catch (error) {
    next(error);
  }
});

// ROTA PARA ATUALIZAR UM IMÓVEL
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const imovelId = parseInt(req.params.id);
    if (isNaN(imovelId)) return res.status(400).json({ message: 'ID do imóvel inválido.' });
    const dadosDoFormulario = req.body;
    delete dadosDoFormulario.id;
    delete dadosDoFormulario.data_criacao;
    delete dadosDoFormulario.imagens;
    const imovelAtualizado = await prisma.imovel.update({
      where: { id: imovelId },
      data: { ...dadosDoFormulario, preco: parseFloat(dadosDoFormulario.preco), quartos: parseInt(dadosDoFormulario.quartos), banheiros: parseInt(dadosDoFormulario.banheiros), area_total: parseInt(dadosDoFormulario.area_total) },
    });
    res.json(imovelAtualizado);
  } catch (error) {
    next(error);
  }
});

// ROTA PARA DELETAR UM IMÓVEL
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const imovelId = parseInt(req.params.id);
    if (isNaN(imovelId)) return res.status(400).json({ message: 'ID do imóvel inválido.' });
    await prisma.imovel.delete({ where: { id: imovelId } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// ROTA PARA ADICIONAR UMA OU MAIS IMAGENS À GALERIA
router.post('/:id/imagens', authenticateToken, async (req, res, next) => {
  try {
    const imovelId = parseInt(req.params.id);
    const { urls } = req.body; 
    if (isNaN(imovelId)) return res.status(400).json({ message: 'ID do imóvel inválido.' });
    if (!urls || !Array.isArray(urls) || urls.length === 0) return res.status(400).json({ message: 'A lista de URLs de imagem é obrigatória.' });
    const imagensParaCriar = urls.map(url => ({ url: url, imovelId: imovelId }));
    await prisma.imagem.createMany({ data: imagensParaCriar });
    res.status(201).json({ message: `${urls.length} imagens adicionadas com sucesso!` });
  } catch (error) {
    next(error);
  }
});

// ROTA PARA DELETAR UMA IMAGEM DA GALERIA
router.delete('/imagens/:id', authenticateToken, async (req, res, next) => {
  try {
    const imagemId = parseInt(req.params.id);
    if (isNaN(imagemId)) return res.status(400).json({ message: 'ID da imagem inválido.' });
    await prisma.imagem.delete({ where: { id: imagemId } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;