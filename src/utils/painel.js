import { temPreco } from './produtos.js'

const CATEGORIAS = {
  roupas: 'Roupas',
  eletronicos: 'Eletrônicos',
  acessorios: 'Acessórios',
  casa: 'Casa',
}

export function resumirCategorias(produtos) {
  return Object.entries(CATEGORIAS).map(([chave, label]) => {
    const disponiveis = produtos.filter((produto) =>
      produto.category === chave && temPreco(produto) && Number(produto.estoque) > 0
    )
    const valorEstoque = disponiveis.reduce((total, produto) =>
      total + Number(produto.price) * Number(produto.estoque), 0)
    const temCustos = disponiveis.every((produto) =>
      produto.custo !== null && produto.custo !== undefined && produto.custo !== '' &&
      Number.isFinite(Number(produto.custo)) && Number(produto.custo) >= 0
    )
    const lucroEstimado = temCustos ? disponiveis.reduce((total, produto) =>
      total + (Number(produto.price) - Number(produto.custo)) * Number(produto.estoque), 0) : null

    return { chave, label, valorEstoque, lucroEstimado }
  })
}
