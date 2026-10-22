export const CHAVE_LISTA_ESPERA = 'techstore.listaEspera'

export function carregarListaEspera() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_LISTA_ESPERA) || '[]')
    if (!Array.isArray(dados)) return []
    return dados.filter((item) =>
      item && typeof item.id === 'string' && typeof item.produtoId === 'string' &&
      typeof item.produtoTitle === 'string' && typeof item.nome === 'string' &&
      typeof item.email === 'string'
    )
  } catch {
    return []
  }
}

export function salvarInteresse(interesse) {
  const lista = carregarListaEspera()
  const existente = lista.some((item) =>
    item.produtoId === interesse.produtoId && item.email.toLowerCase() === interesse.email.toLowerCase()
  )
  const atualizada = existente ? lista : [...lista, interesse]
  // Só confirma o cadastro depois de conseguir persistir os dados.
  localStorage.setItem(CHAVE_LISTA_ESPERA, JSON.stringify(atualizada))
  return atualizada
}
