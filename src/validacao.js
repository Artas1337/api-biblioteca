// retorna uma lista de erros, se vier vazia ta tudo certo
export function validarLivro(body, parcial = false) {
  const erros = []
  const { titulo, autor, ano, lido } = body

  if (!parcial || titulo !== undefined) {
    if (typeof titulo !== 'string' || !titulo.trim()) erros.push('titulo é obrigatório')
  }

  if (!parcial || autor !== undefined) {
    if (typeof autor !== 'string' || !autor.trim()) erros.push('autor é obrigatório')
  }

  if (ano !== undefined && ano !== null) {
    const anoAtual = new Date().getFullYear()
    if (!Number.isInteger(ano) || ano < 0 || ano > anoAtual) erros.push('ano inválido')
  }

  if (lido !== undefined && typeof lido !== 'boolean') {
    erros.push('lido deve ser true ou false')
  }

  return erros
}
