const express = require('express');
const port = 3000;

const app = express();
app.use(express.json());

// variável em memória para simular usuários cadastrados no banco de dados
let usuarios = [];

app.get('/usuarios', (req, res) => {
  let resultado = usuarios;
  // faz o filtro se receber ?filtro=exemplo
  if (req.query.filtro) {
    resultado = usuarios.filter((u) => {
      return u.nome.includes(req.query.filtro);
    });
  }
  res.send(resultado);
});

app.post('/usuarios', (req, res) => {
  if (!req.body || !req.body.nome || !req.body.email) {
    res.status(400).send('Os campos nome e email são obrigatórios!');
    return;
  }
  const usuarioJaExiste = usuarios.find((usu) => usu.email === req.body.email);
  if (usuarioJaExiste) {
    res.status(409).send('Usuário já cadastrado!');
    return;
  }
  // Vamos gerar um id aleatório apenas de exemplo com +new Date()
  const novoUsuario = { ...req.body, id: +new Date() };

  usuarios.push(novoUsuario);
  res.status(201).send(novoUsuario);
});

app.put('/usuarios', (req, res) => {
  usuarios = usuarios.map((xxx) => {
    if (xxx.id === req.body.id) {
      return req.body;
    } else {
      return xxx;
    }
  });

  res.send('Operação efeutada com sucesso!');
});

app.delete('/usuarios/:idUsuario', (req, res) => {
  usuarios = usuarios.filter((xxx) => {
    return xxx.id !== +req.params.idUsuario;
  });

  res.send('Operação efeutada com sucesso!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
