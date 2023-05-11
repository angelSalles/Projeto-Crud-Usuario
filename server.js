const express = require('express');
const pgp = require('pg-promise')();
const db = pgp('postgres://angel:admin@localhost:5432/banco-de-dados'); // substitua username, password e database pelos seus valores

const app = express();
const port = 3000;

app.use(express.json());

// Rotas CRUD
// Criar um novo usuário
app.post('/users', async (req, res) => {
    try {
      const { nome, login, senha } = req.body;
      await db.none('INSERT INTO "usuario".conta_usuario (nome, login, senha) VALUES ($1, $2, $3)', [nome, login, senha]);
      res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Obter todos os usuários
  app.get('/users', async (req, res) => {
    try {
      const users = await db.any('SELECT * FROM "usuario".conta_usuario');
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Obter um usuário por ID
  app.get('/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await db.one('SELECT * FROM "usuario".conta_usuario WHERE id = $1', userId);
      res.json(user);
    } catch (err) {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  });
  
  // Deletar um usuário por ID
  app.delete('/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await db.oneOrNone('DELETE FROM "usuario".conta_usuario WHERE id = $1 RETURNING *', userId);
  
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'Usuário não encontrado' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Ocorreu um erro ao excluir o usuário' });
    }
  });  

  // Atualizar um usuário por ID
  app.put('/users/:id', async (req, res) => {
    
      const userId = req.params.id;
      const { nome, login, senha } = req.body;
      await db.none('UPDATE "usuario".conta_usuario SET nome = $1, login = $2, senha = $3 WHERE id = $4', [nome, login, senha, userId]);
      res.json({ message: 'Usuário atualizado com sucesso' });  });

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
