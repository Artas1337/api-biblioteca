import { criarApp } from './app.js'
import { criarBanco } from './db.js'

const PORT = process.env.PORT || 3000

const app = criarApp(criarBanco())

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`)
})
