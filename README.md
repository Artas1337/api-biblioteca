# API Biblioteca

Projeto que fiz enquanto estudo back-end com Node.js. É uma API REST pra controlar os livros que tenho e marcar os que já li.

Usei Express e o SQLite que já vem embutido no Node (`node:sqlite`), então só tem uma dependência.

## Rotas

| Método | Rota | O que faz |
|---|---|---|
| GET | `/livros` | lista tudo (aceita `?autor=` e `?lido=true/false`) |
| GET | `/livros/:id` | busca um livro |
| POST | `/livros` | cadastra |
| PATCH | `/livros/:id` | atualiza só os campos enviados |
| DELETE | `/livros/:id` | remove |

Exemplo de body:

```json
{ "titulo": "Vidas Secas", "autor": "Graciliano Ramos", "ano": 1938, "lido": false }
```

## Rodando

Precisa do Node 22.5 ou mais novo por causa do `node:sqlite`.

```
npm install
npm run dev
```

Testes (usei o test runner nativo do Node, com banco em memória):

```
npm test
```

No arquivo `requests.http` tem umas requisições prontas pra testar pelo VS Code.

## O que aprendi

- separar o `app` do `server` facilita muito na hora de testar
- usar `?` nas queries em vez de concatenar string (evita SQL injection)
- status code certo pra cada situação (201, 204, 400, 404)
- middleware de erro do Express

## Próximos passos

- [ ] paginação
- [ ] autenticação com JWT
- [ ] colocar no Docker
