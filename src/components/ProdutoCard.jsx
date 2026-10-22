import { Link } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'
import { temPreco, podeComprar } from '../utils/produtos'

export default function ProdutoCard({ produto, onAdicionar }) {
  const esgotado = produto.estoque === 0

  return (
    <article className="card">
      <Link to={`/produto/${produto.id}`} className="card-link">
        <div className="card-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="card-imagem" />
        </div>
        <h3 className="card-titulo">{produto.title}</h3>
      </Link>

      <p className="card-avaliacao">
        ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
      </p>

      <div className="card-precos">
        {produto.precoOriginal && (
          <span className="preco-original">{formatarPreco(produto.precoOriginal)}</span>
        )}
        <span className="preco">{temPreco(produto) ? formatarPreco(produto.price) : 'Preço a definir'}</span>
      </div>

      <div className="card-selos">
        {produto.price > 100 && <span className="selo selo-frete">Frete grátis</span>}
        {esgotado && <span className="selo selo-esgotado">Esgotado</span>}
      </div>

      <button className="botao" onClick={() => onAdicionar(produto)} disabled={!podeComprar(produto)}>
        Adicionar ao carrinho
      </button>
    </article>
  )
}
