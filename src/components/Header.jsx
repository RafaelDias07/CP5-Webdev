import { Link, NavLink } from 'react-router'

export default function Header({ clienteAtual, carrinho = [], adminLogado = false }) {
  const quantidadeItens = carrinho.length

  return (
    <header className="header">
      <p className="faixa-aviso">Troca grátis em até 30 dias · Parcele em até 10x sem juros</p>

      <div className="header-conteudo">
        <Link to="/" className="logo" aria-label="TechStore, página inicial">
          tech<span>store</span>
        </Link>

        <nav className="nav" aria-label="Navegação principal">
          <NavLink to="/" end className="nav-link">
            Loja
          </NavLink>
          <NavLink to="/admin" className="nav-link nav-link-interna">
            {adminLogado ? 'Lojista' : 'Lojista'}
          </NavLink>
          <NavLink to="/estoque" className="nav-link nav-link-interna">
            Área interna
          </NavLink>
        </nav>

        <div className="header-acoes">
          {clienteAtual && (
            <p className="saudacao">
              Olá, <strong>{clienteAtual.nome.split(' ')[0]}</strong>
            </p>
          )}

          <Link to="/carrinho" className="mini-carrinho" aria-label={`Carrinho com ${quantidadeItens} itens`}>
            <svg className="mini-carrinho-icone" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 7h13l-1.5 8.5a2 2 0 0 1-2 1.5H9.5a2 2 0 0 1-2-1.6L5.6 4H3" />
              <circle cx="10" cy="20.5" r="1.2" />
              <circle cx="17" cy="20.5" r="1.2" />
            </svg>
            <span className="mini-carrinho-texto">Carrinho</span>
            {quantidadeItens > 0 && <span className="mini-carrinho-contador">{quantidadeItens}</span>}
          </Link>
        </div>
      </div>
    </header>
  )
}
