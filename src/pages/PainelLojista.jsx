import { useMemo, useState } from 'react'

import { temPreco } from '../utils/produtos'
import { resumirCategorias } from '../utils/painel'

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })
}

export function LoginLojista({ onLogin }) {
    const [usuario, setUsuario] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')

    function entrar(evento) {
        evento.preventDefault()

        if (usuario.trim() === 'admin' && senha.trim() === 'admin') {
            setErro('')
            onLogin()
            return
        }

        setErro('Credenciais inválidas. Use admin / admin.')
    }

    return (
        <section className="admin-login-wrap">
            <div className="admin-login-card">
                <p className="sobretitulo">Acesso restrito</p>
                <h1>Painel do lojista</h1>

                <form className="admin-login-form" onSubmit={entrar}>
                    <label className="admin-field">
                        <span>Usuário</span>
                        <input
                            type="text"
                            value={usuario}
                            onChange={(evento) => setUsuario(evento.target.value)}
                            placeholder="admin"
                        />
                    </label>

                    <label className="admin-field">
                        <span>Senha</span>
                        <input
                            type="password"
                            value={senha}
                            onChange={(evento) => setSenha(evento.target.value)}
                            placeholder="admin"
                        />
                    </label>

                    {erro && <p className="admin-erro">{erro}</p>}

                    <button className="botao botao-grande" type="submit">
                        Entrar
                    </button>
                </form>
            </div>
        </section>
    )
}

export default function PainelLojista({ produtos, listaEspera = [] }) {
    const produtosSemPreco = useMemo(
        () =>
            produtos.filter((produto) => !temPreco(produto)),
        [produtos]
    )

    const clientesEsperando = listaEspera.filter((interesse) =>
        produtos.some((produto) => produto.id === interesse.produtoId && !(Number(produto.estoque) > 0))
    )
    const quantidadeClientes = new Set(clientesEsperando.map((cliente) => cliente.email.toLowerCase())).size
    const categoriaResumo = useMemo(() => resumirCategorias(produtos), [produtos])

    const totalEstoque = categoriaResumo.reduce((total, item) => total + item.valorEstoque, 0)
    const totalLucro = categoriaResumo.some((item) => item.lucroEstimado === null)
        ? null
        : categoriaResumo.reduce((total, item) => total + item.lucroEstimado, 0)

    return (
        <section className="admin-panel">
            <div className="admin-header">
                <div>
                    <p className="sobretitulo">Operação</p>
                    <h1>Painel do lojista</h1>
                </div>
            </div>

            <div className="admin-grid">
                <article className="admin-card admin-card-destaque">
                    <span className="admin-label">Valor em estoque</span>
                    <strong>{formatarMoeda(totalEstoque)}</strong>
                    <small>Estoque disponível hoje</small>
                </article>

                <article className="admin-card">
                    <span className="admin-label">Produtos sem preço</span>
                    <strong>{produtosSemPreco.length}</strong>
                    <small>Itens aguardando cadastro</small>
                </article>

                <article className="admin-card">
                    <span className="admin-label">Clientes esperando</span>
                    <strong>{quantidadeClientes}</strong>
                    <small>Produtos esgotados em espera</small>
                </article>

                <article className="admin-card">
                    <span className="admin-label">Lucro estimado</span>
                    <strong>{totalLucro === null ? 'Indisponível' : formatarMoeda(totalLucro)}</strong>
                    <small>Projeção de venda menos custo de aquisição</small>
                </article>
            </div>

            <div className="admin-secoes">
                <article className="admin-lista">
                    <h2>Valor em estoque por categoria</h2>
                    <ul>
                        {categoriaResumo.map((categoria) => (
                            <li key={categoria.chave}>
                                <span>{categoria.label}</span>
                                <strong>{formatarMoeda(categoria.valorEstoque)}</strong>
                            </li>
                        ))}
                    </ul>
                </article>

                <article className="admin-lista">
                    <h2>Esperando o preço do time de suprimentos</h2>
                    {produtosSemPreco.length > 0 ? (
                        <ul>
                            {produtosSemPreco.map((produto) => (
                                <li key={produto.id}>
                                    <span>{produto.title}</span>
                                    <strong>{produto.category}</strong>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="admin-vazio">Nenhum produto está esperando preço no momento.</p>
                    )}
                </article>

                <article className="admin-lista admin-lista-ampla">
                    <h2>Clientes esperando produtos voltarem</h2>
                    {clientesEsperando.length > 0 ? (
                        <ul>
                            {clientesEsperando.map((cliente) => (
                                <li key={cliente.id}>
                                    <div>
                                        <span>{cliente.nome}</span>
                                        <small>{cliente.email}</small>
                                    </div>
                                    <strong>{cliente.produtoTitle}</strong>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="admin-vazio">Não há clientes aguardando retorno neste momento.</p>
                    )}
                </article>

                <article className="admin-lista admin-lista-ampla">
                    <h2>Lucro estimado por categoria</h2>
                    <p className="admin-vazio">A projeção depende do custo de aquisição dos produtos disponíveis para venda.</p>
                    <ul>
                        {categoriaResumo.map((categoria) => (
                            <li key={`${categoria.chave}-lucro`}>
                                <span>{categoria.label}</span>
                                <strong>{categoria.lucroEstimado === null ? 'Custo não informado' : formatarMoeda(categoria.lucroEstimado)}</strong>
                            </li>
                        ))}
                    </ul>
                </article>
            </div>
        </section>
    )
}
