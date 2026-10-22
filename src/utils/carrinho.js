// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

export function normalizarPreco(valor) {
  if (valor === null || valor === undefined || valor === '') {
    return 0
  }

  const numero = Number(valor)
  return Number.isFinite(numero) ? numero : 0
}

export function calcularTotal(carrinho) {
  return carrinho.reduce((total, produto) => {
    return total + normalizarPreco(produto?.price)
  }, 0)
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    const existente = itens.find((item) => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}
