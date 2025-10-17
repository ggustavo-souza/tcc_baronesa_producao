import "../App.css";
import "../awesome/all.min.css";
import Navbar from './Navbar'
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from "./auths/useAuthUser";

function MinhaConta() {
    useAuthUser();
    const baseUrl = "https://tccbaronesapi.cloud"
    const [NomeUsuario, setNomeUsuario] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        Aos.init({ duration: 600, once: true });
        const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
        console.log(JSON.parse(localStorage.getItem("usuarioLogado")));
        if (usuario) {
            setNomeUsuario(usuario);
        }
    }, [])

    const validarLogout = () => {
        localStorage.removeItem("usuarioLogado");
        setNomeUsuario(null);
        navigate("/");
    }

    return (
        <main>
            <Navbar />
            <div className="container">
                <div data-aos="fade-up" className="card mt-4 p-4 d-flex flex-column align-items-center shadow shadow-3" style={{ backgroundColor: '#503325c1', borderRadius: '10px' }}>
                    <h1 style={{ color: '#FFD230' }}>{NomeUsuario ? `Bem vindo!` : "Carregando..."}</h1>
                    <h4 style={{ color: '#FFD230' }} className="align-self-start mt-3 ms-5">Nome de Usuário: {NomeUsuario ? NomeUsuario.nome : "Carregando..."}</h4>
                    <h4 style={{ color: '#FFD230' }} className="align-self-start mt-3 ms-5">E-mail cadastrado: {NomeUsuario ? NomeUsuario.email : "Carregando..."} </h4>

                    <div className="row w-100 justify-content-center mt-5">
                        <div className="col-md-4 col-sm-12 mb-2">
                            <button
                                type="button"
                                className="btn btn-warning corBotao w-100 shadow shadow-3"
                                onClick={() => navigate("/pedidos")}>
                                Pedidos
                            </button>
                        </div>
                        <div className="col-md-4 col-sm-12 mb-2">
                            <button
                                type="button"
                                className="btn btn-warning corBotao w-100 shadow shadow-3"
                                onClick={() => navigate("/meusorcamentos")}>
                                Orçamentos
                            </button>
                        </div>
                        <div className="col-md-4 col-sm-12 mb-2">
                            <button
                                type="button"
                                className="btn btn-danger corBotao w-100 shadow shadow-3"
                                onClick={() => setShowModal(true)}>
                                Sair da conta
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <div
                    className="modal"
                    data-aos="fade-up"
                    style={{ display: 'block' }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ backgroundColor: '#FFFFFF', borderRadius: '10px' }}>

                            <div className="modal-header border-0 pb-2" style={{ backgroundColor: '#FFD230' }}>
                                <h5 className="modal-title text-dark fw-bold">Confirmar Saída</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>

                            <div className="modal-body pt-4 pb-4">
                                <h5 className="">Deseja realmente sair da sua conta?</h5>
                            </div>

                            <div className="modal-footer border-0 pt-0">
                                <button
                                    type="button"
                                    className="btn btn-light text-dark fw-bold px-4"
                                    onClick={() => setShowModal(false)}
                                    style={{ border: '1px solid #ced4da' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger fw-bold px-4"
                                    onClick={() => validarLogout()}
                                    style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
                                >
                                    Sair
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModal && <div className="modal-backdrop fade show"></div>}
        </main>
    )
}

export default MinhaConta;