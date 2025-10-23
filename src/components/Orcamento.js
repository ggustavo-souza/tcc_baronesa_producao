import "../App.css";
import "../awesome/all.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuthUser } from './auths/useAuthUser';
import { useEffect, useState } from "react";
import Aos from "aos";
import { useNavigate } from "react-router-dom";

function HomeOrcamento() {
    // pega o usuário logado
    const usuario = useAuthUser(); // retorna o objeto do usuário ou redireciona se não estiver logado

    useEffect(() => {
        Aos.init({ duration: 1000, once: true });
    }, []);

    // estados do form
    const urlAPI = "tccbaronesaapi.cloud/"
    const [categoria, setCategoria] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [telefone, setTelefone] = useState("");
    const [modalErro, setModalErro] = useState(false);
    const [modalConcluido, setModalConcluido] = useState(false);
    const [modalLogado, setModalLogado] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!usuario?.id) {
            setModalLogado(true)
            return;
        }

        try {
            const response = await fetch(`${urlAPI}api/orcamentos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_usuario: usuario.id,
                    id_categoria: categoria,
                    mensagem,
                    telefone,
                }),
            });

            const data = await response.json();
            console.log("Resposta do backend:", data); // <-- para debugging

            if (!response.ok) throw new Error(data.message || "Erro ao enviar orçamento");

            setModalConcluido(true)
            setCategoria("");
            setMensagem("");
            setTelefone("");
        } catch (err) {
            console.error(err.message);
            setModalErro(true)
        }
    };

    return (
        <main>
            <Navbar />
            {/* comeco do formulario */}
            <div className="container py-5 d-flex justify-content-center align-items-center" data-aos='fade-up'>
                <div className="col-lg-8 col-xl-7 col-10 col-md-10">
                    <div
                        className="card text-center shadow-lg border-0 rounded-4 shadow-5"
                        style={{
                            backgroundColor: '#343a40', // Fundo escuro para contraste (cor dark do BS)
                            animation: modalErro || modalConcluido ? 'none' : 'fadeInUp 1s ease-out' // Simula Aos.js
                        }}
                    >
                        <div className="card-body p-4 p-md-5">
                            <h1 className="fw-bolder mb-2" style={{ color: '#FFD230' }}>
                                <i className="fas fa-file-invoice me-2"></i> Faça Já Seu Orçamento!
                            </h1>
                            <p className="card-text h5 mt-3 mb-5" style={{ color: '#FFFFFF'}}>
                                Descreva seu projeto de imóvel. Nossa equipe entrará em contato em breve!
                            </p>

                            <form onSubmit={handleSubmit}>
                                {/* Categoria */}
                                <div className="mb-4 text-start">
                                    <label htmlFor="selectCategoria" className="form-label text-white fw-semibold">
                                        <i className="fas fa-tags me-2"></i> Selecione a Categoria <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><i className="fas fa-boxes text-secondary"></i></span>
                                        <select
                                            className="form-select form-control-lg border-0 shadow-sm"
                                            id="selectCategoria"
                                            value={categoria}
                                            onChange={(e) => setCategoria(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>Selecione o tipo de móvel...</option>
                                            <option value="1">Mesas</option>
                                            <option value="2">Cadeiras</option>
                                            <option value="3">Cômodas</option>
                                            <option value="4">Armários</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Telefone */}
                                <div className="mb-4 text-start">
                                    <label htmlFor="telefone" className="form-label text-white fw-semibold">
                                        <i className="fas fa-phone me-2"></i> Telefone de Contato <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><i className="fas fa-mobile-alt text-secondary"></i></span>
                                        <input
                                            type="tel"
                                            className="form-control form-control-lg border-0 shadow-sm"
                                            id="telefone"
                                            placeholder="(11) 91234-5678"
                                            maxLength="15"
                                            value={telefone}
                                            onChange={(e) => setTelefone(e.target.value)}
                                            onInput={(e) => {
                                                let value = e.target.value.replace(/\D/g, "");
                                                if (value.length > 11) value = value.slice(0, 11);
                                                if (value.length <= 10) {
                                                    e.target.value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
                                                } else {
                                                    e.target.value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
                                                }

                                                setTelefone(e.target.value);

                                            }} // Usa a nova função de máscara
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Mensagem */}
                                <div className="mb-4 text-start">
                                    <label htmlFor="message" className="form-label text-white fw-semibold">
                                        <i className="fas fa-edit me-2"></i> Descreva seu Projeto <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0 align-items-start pt-3"><i className="fas fa-comment-dots text-secondary"></i></span>
                                        <textarea
                                            className="form-control border-0 shadow-sm"
                                            id="message"
                                            rows="5"
                                            value={mensagem}
                                            onChange={(e) => setMensagem(e.target.value)}
                                            required
                                            placeholder="Detalhe o máximo possível, incluindo dimensões, materiais desejados ou referências."
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Botão de Envio */}
                                <div className="text-center mt-5">
                                    <button
                                        type="submit"
                                        className="btn btn-lg fw-bold px-5 py-3 shadow-lg corBotao btn-floating"
                                        style={{
                                            backgroundColor: '#FFD230',
                                            borderColor: '#FFD230',
                                            color: '#343a40',
                                            borderRadius: '50px',
                                        }}
                                        
                                    >
                                        <i className="fas fa-paper-plane me-2"></i> Enviar Orçamento
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

            {modalConcluido && (
                <div
                    className="modal"
                    data-aos="fade-up"
                    style={{ display: 'block' }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ backgroundColor: '#FFFFFF', borderRadius: '10px' }}>

                            <div className="modal-header border-0 pb-2" style={{ backgroundColor: '#FFD230' }}>
                                <h5 className="modal-title text-dark fw-bold">Sucesso!</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={() => setModalConcluido(false)}
                                ></button>
                            </div>

                            <div className="modal-body pt-4 pb-4">
                                <h5 className="">Seu orçamento foi enviado com sucesso!</h5>
                            </div>

                            <div className="modal-footer align-self-center border-0 pt-0">
                                <button
                                    type="button"
                                    className="btn btn-success fw-bold px-4"
                                    onClick={() => navigate("/")}
                                    style={{ backgroundColor: '#198754', borderColor: '#198710' }}
                                >
                                    OK!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {modalConcluido && <div className="modal-backdrop fade show"></div>}

            {modalErro && (
                <div
                    className="modal"
                    data-aos="fade-up"
                    style={{ display: 'block' }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ backgroundColor: '#FFFFFF', borderRadius: '10px' }}>

                            <div className="modal-header border-0 pb-2" style={{ backgroundColor: '#FFD230' }}>
                                <h5 className="modal-title text-dark fw-bold">Erro!</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={() => setModalErro(false)}
                                ></button>
                            </div>

                            <div className="modal-body pt-4 pb-4">
                                <h5 className="">Ocorreu um erro ao enviar o orçamento!</h5>
                            </div>

                            <div className="modal-footer align-self-center border-0 pt-0">
                                <button
                                    type="button"
                                    className="btn btn-warning fw-bold px-4"
                                    onClick={() => setModalErro(false)}
                                    style={{ backgroundColor: 'crimson', borderColor: 'crimson' }}
                                >
                                    Voltar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {modalErro && <div className="modal-backdrop fade show"></div>}

            {modalLogado && (
                <>
                    <div className="modal" data-aos="fade-up" style={{ display: 'block' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg rounded-4">
                                <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title text-dark fw-bold">
                                        <i className="fa-solid fa-triangle-exclamation text-danger me-2"></i>
                                        !
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setModalLogado(false)}></button>
                                </div>
                                <div className="modal-body py-4">
                                    <p className="mb-0">Você não está logado!</p>
                                </div>
                                <div className="modal-footer border-0 bg-light">
                                    <button type="button" className="btn btn-secondary" onClick={() => setModalLogado(false)}>
                                        <i className="fa-solid fa-trash me-2"></i>
                                        Voltar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </main>
    );
}

export default HomeOrcamento;