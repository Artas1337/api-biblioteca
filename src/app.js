import express from 'express'
import { validarLivro } from './validacao.js'

// sqlite guarda boolean como 0/1, entao converto na saida
const formatar = (livro) => ({ ...livro, lido: Boolean(livro.lido) })

export function criarApp(db) {
  const app = express()
  app.use(express.json())

  app.get('/livros', (req, res) => {
    const { autor, lido } = req.query
    let sql = 'SELECT * FROM livros WHERE 1=1'
    const params = []

    if (autor) {
      sql += ' AND autor LIKE ?'
      params.push(`%${autor}%`)
    }
    if (lido === 'true' || lido === 'false') {
      sql += ' AND lido = ?'
      params.push(lido === 'true' ? 1 : 0)
    }

    const livros = db.prepare(sql + ' ORDER BY id').all(...params)
    res.json(livros.map(formatar))
  })

  app.get('/livros/:id', (req, res) => {
    const livro = db.prepare('SELECT * FROM livros WHERE id = ?').get(req.params.id)
    if (!livro) return res.status(404).json({ erro: 'Livro não encontrado' })
    res.json(formatar(livro))
  })

  app.post('/livros', (req, res) => {
    const erros = validarLivro(req.body)
    if (erros.length) return res.status(400).json({ erros })

    const { titulo, autor, ano = null, lido = false } = req.body
    const result = db
      .prepare('INSERT INTO livros (titulo, autor, ano, lido) VALUES (?, ?, ?, ?)')
      .run(titulo.trim(), autor.trim(), ano, lido ? 1 : 0)

    const novo = db.prepare('SELECT * FROM livros WHERE id = ?').get(result.lastInsertRowid)
    res.status(201).json(formatar(novo))
  })

  app.patch('/livros/:id', (req, res) => {
    const atual = db.prepare('SELECT * FROM livros WHERE id = ?').get(req.params.id)
    if (!atual) return res.status(404).json({ erro: 'Livro não encontrado' })

    const erros = validarLivro(req.body, true)
    if (erros.length) return res.status(400).json({ erros })

    const livro = { ...formatar(atual), ...req.body }
    db.prepare('UPDATE livros SET titulo = ?, autor = ?, ano = ?, lido = ? WHERE id = ?').run(
      livro.titulo,
      livro.autor,
      livro.ano,
      livro.lido ? 1 : 0,
      atual.id
    )

    res.json({ ...livro, id: atual.id })
  })

  app.delete('/livros/:id', (req, res) => {
    const result = db.prepare('DELETE FROM livros WHERE id = ?').run(req.params.id)
    if (result.changes === 0) return res.status(404).json({ erro: 'Livro não encontrado' })
    res.status(204).end()
  })

  // json mal formatado cai aqui
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ erro: 'JSON inválido' })
    }
    console.error(err)
    res.status(500).json({ erro: 'Erro interno' })
  })

  return app
}
