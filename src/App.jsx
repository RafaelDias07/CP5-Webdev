import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import RolarParaTopo from './components/RolarParaTopo'
import Loja from './pages/Loja'
import PaginaProduto from './pages/PaginaProduto'
import Carrinho from './pages/Carrinho'
import Estoque from './pages/Estoque'
import PainelLojista, { LoginLojista } from './pages/PainelLojista'
import { buscarProdutos } from './services/produtos'
import { buscarClientes } from './services/clientes'
import { CHAVE_LISTA_ESPERA, carregarListaEspera, salvarInteresse } from './services/listaEspera'
import { podeComprar } from './utils/produtos'

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [carrinho, setCarrinho] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteAtualId, setClienteAtualId] = useState(null)
  const [mensagemCarrinho, setMensagemCarrinho] = useState('')
  const [adminLogado, setAdminLogado] = useState(false)
  const [listaEspera, setListaEspera] = useState(carregarListaEspera)

  const produtosDisponiveis = produtos.filter(podeComprar)

  useEffect(() => {
    function sincronizarLista(evento) {
      if (evento.key === CHAVE_LISTA_ESPERA || evento.key === null) {
        setListaEspera(carregarListaEspera())
      }
    }
    window.addEventListener('storage', sincronizarLista)
    return () => window.removeEventListener('storage', sincronizarLista)
  }, [])

  useEffect(() => {
    buscarProdutos()
      .then((dados) => setProdutos(dados))
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))

    buscarClientes().then((dados) => {
      setClientes(dados)
      if (dados.length > 0) setClienteAtualId(dados[0].id)
    })
  }, [])

  useEffect(() => {
    if (!mensagemCarrinho) return

    const temporizador = setTimeout(() => setMensagemCarrinho(''), 2200)
    return () => clearTimeout(temporizador)
  }, [mensagemCarrinho])

  function adicionarAoCarrinho(produto) {
    if (!podeComprar(produto)) return

    setCarrinho((carrinhoAtual) => carrinhoAtual.concat(produto))
    setMensagemCarrinho(`${produto.title} adicionado ao carrinho.`)
  }

  function removerUmaUnidade(produtoId) {
    setCarrinho((carrinhoAtual) => {
      const indice = carrinhoAtual.findIndex((produto) => produto.id === produtoId)

      if (indice === -1) {
        return carrinhoAtual
      }

      return carrinhoAtual.filter((produto, index) => index !== indice)
    })
  }

  const clienteAtual = clientes.find((cliente) => cliente.id === clienteAtualId)

  function registrarInteresse({ produtoId, nome, email }) {
    if (!produtoId || !nome?.trim() || !email?.trim()) {
      return false
    }

    const produto = produtos.find((item) => item.id === produtoId)
    if (!produto || Number(produto.estoque) > 0) return false

    try {
      const atualizada = salvarInteresse({
        id: `${produtoId}-${Date.now()}`,
        produtoId,
        produtoTitle: produto.title,
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
      })
      setListaEspera(atualizada)
    } catch {
      return false
    }

    return true
  }

  return (
    <div className="app">
      <RolarParaTopo />

      {mensagemCarrinho && <div className="mensagem-carrinho">{mensagemCarrinho}</div>}

      <Header carrinho={carrinho} clienteAtual={clienteAtual} adminLogado={adminLogado} />

      <main className="conteudo">
        {carregando && <p className="aviso">Carregando produtos...</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}

        {!carregando && !erro && (
          <Routes>
            <Route
              path="/"
              element={<Loja produtos={produtosDisponiveis} onAdicionar={adicionarAoCarrinho} />}
            />
            <Route
              path="/produto/:id"
              element={
                <PaginaProduto
                  produtos={produtos}
                  onAdicionar={adicionarAoCarrinho}
                  onRegistrarInteresse={registrarInteresse}
                />
              }
            />
            <Route
              path="/carrinho"
              element={
                <Carrinho
                  carrinho={carrinho}
                  produtos={produtosDisponiveis}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                />
              }
            />
            <Route path="/estoque" element={<Estoque produtos={produtos} listaEspera={listaEspera} />} />
            <Route
              path="/admin"
              element={
                adminLogado ? (
                  <PainelLojista produtos={produtos} listaEspera={listaEspera} />
                ) : (
                  <LoginLojista onLogin={() => setAdminLogado(true)} />
                )
              }
            />
          </Routes>
        )}
      </main>

      <Footer
        clientes={clientes}
        clienteAtualId={clienteAtualId}
        onTrocarCliente={setClienteAtualId}
      />
    </div>
  )
}
