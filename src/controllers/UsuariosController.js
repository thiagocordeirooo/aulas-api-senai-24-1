import ConexaoMySql from '../database/ConexaoMySql.js';

class UsuariosController {
  async listar(req, resp) {
    try {
      const filtro = req.query.filtro || '';
      const conexao = await new ConexaoMySql().getConexao();
      const sql = 'SELECT * FROM usuarios WHERE nome LIKE ?';
      const [resultado] = await conexao.execute(sql, [`%${filtro}%`]);

      resp.send(
        resultado.map((u) => {
          delete u.senha;
          return u;
        })
      );
    } catch (error) {
      resp.status(500).send(error);
    }
  }

  async adicionar(req, resp) {
    try {
      const novoUsuario = req.body;

      if (!novoUsuario.nome || !novoUsuario.email || !novoUsuario.senha) {
        resp.status(400).send('Os campos nome, email e senha são obrigatórios.');
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();
      const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?,?,md5(?))';
      const [resultado] = await conexao.execute(sql, [
        novoUsuario.nome,
        novoUsuario.email,
        novoUsuario.senha,
      ]);

      resp.send({ resultado });
    } catch (error) {
      resp.status(500).send(error);
    }
  }

  async atualizar(req, resp) {
    try {
      const usuarioEditar = req.body;

      if (!usuarioEditar.nome || !usuarioEditar.email) {
        resp.status(400).send('Os campos nome e email são obrigatórios para atualizar.');
        return;
      }

      const conexao = await new ConexaoMySql().getConexao();
      const sql = 'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?';
      const [resultado] = await conexao.execute(sql, [
        usuarioEditar.nome,
        usuarioEditar.email,
        usuarioEditar.id,
      ]);

      resp.send({ resultado });
    } catch (error) {
      resp.status(500).send(error);
    }
  }

  async excluir(req, resp) {
    try {
      const conexao = await new ConexaoMySql().getConexao();
      const sql = 'DELETE FROM usuarios WHERE id = ?';
      const [resultado] = await conexao.execute(sql, [+req.params.idUsuario]);

      resp.send(resultado);
    } catch (error) {
      resp.status(500).send(error);
    }
  }
}

export default UsuariosController;
