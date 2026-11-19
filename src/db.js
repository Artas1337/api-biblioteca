import { DatabaseSync } from 'node:sqlite'

// usando o sqlite que ja vem no node (22.5+), assim nao precisa instalar nada
export function criarBanco(arquivo = 'biblioteca.db') {
  const db = new DatabaseSync(arquivo)

  db.exec(`
    CREATE TABLE IF NOT EXISTS livros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      autor TEXT NOT NULL,
      ano INTEGER,
      lido INTEGER NOT NULL DEFAULT 0
    )
  `)

  return db
}
