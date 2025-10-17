import '../App.css';
import '../awesome/all.min.css';
import Navbar from './Navbar';
import Footer from './Footer';
import Aos from 'aos';
import 'aos/dist/aos.css';
import React, { useEffect, useState } from 'react';
import { useAuthUser } from "./auths/useAuthUser";
// Não é necessário importar a SDK do MP se você usar o redirecionamento

function MeusPedidos() {
  useAuthUser();
  const baseUrl = "./"
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false)
  const [mensagemModal, setMensagemModal] = useState({ message: "" })

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'))
    if (usuarioLogado) {
      carregarPedidos(usuarioLogado.id);
    } else {
      setLoading(false);
    }
    Aos.init({ duration: 850 });
  }, []);

  async function carregarPedidos(idUsuario) {
    if (!idUsuario) {
      setMensagemModal({ message: "Você precisa estar logado para ver seus pedidos!" });
      setModal(true)
      return;
    }

    try {
      // Nota: Seu endpoint de pedidos deve ser ajustado para garantir que o campo 'preco' é numérico
      const resposta = await fetch(`${baseUrl}api/pedidos/${idUsuario}`);
      const data = await resposta.json();
      // Ajuste para garantir que 'pedidos' seja um array
      setPedidos(Array.isArray(data) ? data : []); 
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error.message);
    } finally {
      setLoading(false);
    }
  };

  async function pagarPedido(pedido) {
    const precoNumerico = parseFloat(pedido.preco);
    if (isNaN(precoNumerico)) {
      setMensagemModal({ message: "Erro: O preço do pedido não é um número válido." });
      setModal(true);
      return;
    }

    try {
      const resposta = await fetch(`${baseUrl}api/criar_preferencia.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_pedido: pedido.id,
          titulo: `Pedido #${pedido.id}`,
          valor: precoNumerico.toFixed(2) // Envia formatado com 2 casas
        }),
      });

      const data = await resposta.json();

      if (!data.id || !data.init_point) { 
        console.error("Erro na preferência:", data);
        setMensagemModal({ message: "Erro ao criar preferência de pagamento. Detalhes ausentes do Mercado Pago." });
        setModal(true);
        return;
      }

      window.location.href = data.init_point;

    } catch (erro) {
      console.error("Erro:", erro);
      setMensagemModal({ message: "Falha na conexão com o servidor." });
      setModal(true)
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5" data-aos="fade-up">
        <h1 className="text-center fw-bold mb-4" style={{ color: "#FFD230" }}>
          Meus Pedidos
        </h1>

        {loading ? (
          <p className="text-center text-light">Carregando pedidos...</p>
        ) : pedidos.length === 0 ? (
          <p className="text-center text-light mt-3">Nenhum pedido encontrado.</p>
        ) : (
          <div className="row justify-content-center">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="col-md-4 mb-4">
                <div
                  className="p-3 text-light"
                  style={{
                    backgroundColor: "#503325c1",
                    borderRadius: "10px",
                    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                  }}
                  data-aos="fade-up"
                >
                  <h5 className="text-center fw-bold" style={{ color: "#FFD230" }}>
                    Pedido #{pedido.id}
                  </h5>
                  <hr style={{ borderColor: "#FFD230" }} />
                  <p><strong>Produto:</strong> {pedido.nome}</p>
                  <p><strong>Preço:</strong> R$ {pedido.preco}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        // Corrigi a verificação de status para ser case-insensitive ou exata
                        color: pedido.status && pedido.status.toLowerCase() === "pago" ? "#28a745" : "#FFD230",
                        fontWeight: "bold",
                      }}
                    >
                      {pedido.status}
                    </span>
                  </p>

                  {/* Corrigi a verificação de status para ser minúsculo, conforme você usa "pago" no botão */}
                  {pedido.status && pedido.status.toLowerCase() !== "pago" && ( 
                    <button
                      className="btn btn-success w-100 mt-2"
                      onClick={() => pagarPedido(pedido)}
                    >
                      Pagar agora
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
      {modal && (
        <>
          <div className="modal" data-aos="fade-up" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title text-dark fw-bold">
                    <i className="fa-solid fa-triangle-exclamation text-danger me-2"></i>
                    Mensagem!
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setModal(false)}></button>
                </div>
                <div className="modal-body py-4">
                  <p className="mb-0">{mensagemModal.message}</p>
                </div>
                <div className="modal-footer border-0 bg-light">
                  <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>
                    <i className="fa-solid"></i>
                    Voltar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default MeusPedidos;