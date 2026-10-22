import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { temPreco, podeComprar } from '../utils/produtos'
import { formatarPreco } from '../utils/formatarPreco'

export default function PaginaProduto({ produtos, onAdicionar, onRegistrarInteresse }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [aviso, setAviso] = useState('')

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const esgotado = !(Number(produto.estoque) > 0)

  const relacionados = produtos
    .filter(
      (item) =>
        item.category === produto.category &&
        item.id !== produto.id &&
        podeComprar(item)
    )
    .slice(0, 4)

  function enviarAviso(evento) {
    evento.preventDefault()

    if (!nome.trim() || !email.trim()) {
      setAviso('Preencha nome e e-mail para receber o aviso.')
      return
    }

    const enviado = onRegistrarInteresse({
      produtoId: produto.id,
      produtoTitle: produto.title,
      nome,
      email,
    })

    if (enviado) {
      setAviso('Você entrou na lista de espera. Vamos avisar quando o produto voltar.')
      setNome('')
      setEmail('')
    } else {
      setAviso('Não foi possível salvar seu interesse. Tente novamente.')
    }
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">{temPreco(produto) ? formatarPreco(produto.price) : 'Preço a definir'}</p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">
            {produto.estoque > 0 ? `${produto.estoque} unidades disponíveis` : 'Produto esgotado'}
          </p>

          <button
            className="botao botao-grande"
            onClick={() => onAdicionar(produto)}
            disabled={!podeComprar(produto)}
          >
            {esgotado ? 'Indisponível no momento' : !temPreco(produto) ? 'Aguardando preço' : 'Adicionar ao carrinho'}
          </button>

          {esgotado && (
            <form className="form-aviso" onSubmit={enviarAviso}>
              <h2>Avise-me quando voltar</h2>
              <label>
                <span>Nome</span>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(evento) => setNome(evento.target.value)}
                  placeholder="Seu nome"
                />
              </label>

              <label>
                <span>E-mail</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                  placeholder="seu@email.com"
                />
              </label>

              <button className="botao botao-secundario" type="submit">
                Quero receber o aviso
              </button>

              {aviso && <p className="mensagem-aviso">{aviso}</p>}
            </form>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <article key={item.id} className="card">
            <Link to={`/produto/${item.id}`} className="card-link">
              <div className="card-imagem-moldura">
                <img src={item.image} alt={item.title} className="card-imagem" />
              </div>
              <h3 className="card-titulo">{item.title}</h3>
            </Link>
            <p className="preco">R$ {Number(item.price).toFixed(2).replace('.', ',')}</p>
            <button className="botao" onClick={() => onAdicionar(item)}>
              Adicionar ao carrinho
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
