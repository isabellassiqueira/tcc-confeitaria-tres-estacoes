const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// ROTAS DE AUTENTICAÇÃO
router.post('/', usersController.register);
router.post('/login', usersController.login);

// LISTAR USERS (ADM)
router.get('/', usersController.listarUsuarios);

// ATUALIZAR MEU PERFIL (USER NORMAL)
router.put('/:id', usersController.atualizarMeuPerfil);

// ATUALIZAR QUALQUER USUÁRIO (APENAS ADM)
router.put('/admin/:id', usersController.editarUsuarioAdmin);

// DELETAR (APENAS ADM)
router.delete('/:id', usersController.deletarUsuario);

module.exports = router;
