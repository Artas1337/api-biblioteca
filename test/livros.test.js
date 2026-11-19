import { test, before, after } from 'node:test'
import assert from 'node:assert'
import { criarApp } from '../src/app.js'
import { criarBanco } from '../src/db.js'

let server
let url

before(() => {
  // banco em memoria pra nao sujar o arquivo de verdade
  const app = criarApp(criarBanco(':memory:'))
  server = app.listen(0)
  url = `http://localhost:${server.address().port}`
})

after(() => server.close())

const post = (body) =>
  fetch(`${url}/livros`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

test('cria um livro', async () => {
  const res = await post({ titulo: 'Dom Casmurro', autor: 'Machado de Assis', ano: 1899 })
  const livro = await res.json()

  assert.strictEqual(res.status, 201)
  assert.strictEqual(livro.titulo, 'Dom Casmurro')
  assert.strictEqual(livro.lido, false)
})

test('nao deixa criar sem titulo', async () => {
  const res = await post({ autor: 'Alguém' })
  const body = await res.json()

  assert.strictEqual(res.status, 400)
  assert.ok(body.erros.includes('titulo é obrigatório'))
})

test('filtra por autor', async () => {
  await post({ titulo: 'Capitães da Areia', autor: 'Jorge Amado' })
  const res = await fetch(`${url}/livros?autor=amado`)
  const livros = await res.json()

  assert.strictEqual(livros.length, 1)
  assert.strictEqual(livros[0].autor, 'Jorge Amado')
})

test('marca como lido', async () => {
  const criado = await (await post({ titulo: 'O Cortiço', autor: 'Aluísio Azevedo' })).json()

  const res = await fetch(`${url}/livros/${criado.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lido: true }),
  })
  const livro = await res.json()

  assert.strictEqual(res.status, 200)
  assert.strictEqual(livro.lido, true)
  assert.strictEqual(livro.titulo, 'O Cortiço')
})

test('deleta e depois retorna 404', async () => {
  const criado = await (await post({ titulo: 'Teste', autor: 'Teste' })).json()

  const del = await fetch(`${url}/livros/${criado.id}`, { method: 'DELETE' })
  assert.strictEqual(del.status, 204)

  const get = await fetch(`${url}/livros/${criado.id}`)
  assert.strictEqual(get.status, 404)
})
