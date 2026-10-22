export function temPreco(produto) {
  const preco = Number(produto?.price)
  return Number.isFinite(preco) && preco > 0
}

export function podeComprar(produto) {
  return temPreco(produto) && Number(produto.estoque) > 0
}
