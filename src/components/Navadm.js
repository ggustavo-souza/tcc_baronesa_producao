import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import "../awesome/all.min.css";

function Navadm() {
    const navigate = useNavigate();
    const [isNavCollapsed, setIsNavCollapsed] = React.useState(true);
    const [showModalSair, setShowModalSair] = React.useState(false);
    const [usuarioLogado, setUsuarioLogado] = React.useState(null);

    const handleToggle = () => {
        setIsNavCollapsed(!isNavCollapsed);
    };

    const handleLogout = () => {
        localStorage.removeItem("usuarioLogado");
        setShowModalSair(false)
        navigate("/"); // volta para página pública
    };

    React.useEffect(() => {
        const usuario = localStorage.getItem("usuarioLogado");
        if (usuario) setUsuarioLogado(JSON.parse(usuario));
    }, []);

    return (
        <nav className="navbar navbar-expand-lg CorNavbar navbarNav">
            <div className="container-fluid">
                <Link className={`navbar-brand ${!isNavCollapsed ? 'invisible' : ''}`} to="/crud">
                    <img
                        src="/logo_nav.png"
                        alt="Logo"
                        className="logo-navbar"
                        width="150"
                        height="70"
                    />
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarAdmin"
                    aria-controls="navbarAdmin"
                    aria-expanded={!isNavCollapsed}
                    aria-label="Toggle navigation"
                    onClick={handleToggle}
                    style={{ backgroundColor: '#FFD230' }}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse${isNavCollapsed ? "" : " show"}`} id="navbarAdmin">
                    <ul className="navbar-nav subir mx-auto w-100 justify-content-center me-5">
                        <li className="nav-item">
                            <Link className="nav-link fw-bold fs-5 m-1" to="/crud" style={{ color: '#FFD230' }}>
                                <i className="fa-solid fa-home me-2"></i>Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-bold fs-5 m-1" to="/admin-usuarios" style={{ color: '#FFD230' }}>
                                <i className="fa-solid fa-users me-2"></i>Usuários
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-bold fs-5 m-1" to="/admin-produtos" style={{ color: '#FFD230' }}>
                                <i className="fa-solid fa-cart-shopping me-2"></i>Móveis
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-bold fs-5 m-1" to="/admin-orcamentos" style={{ color: '#FFD230' }}>
                                <i className="fa-solid fa-file-invoice-dollar me-2"></i>Orçamentos
                            </Link>
                        </li>
                    </ul>
                    <button
                        className="btn btn-danger mt-1"
                        onClick={() => setShowModalSair(true)}
                        style={{ fontWeight: 'bold' }}
                    >
                        Sair
                    </button>
                </div>
            </div>
            {showModalSair && (
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
                                    onClick={() => setShowModalSair(false)}
                                ></button>
                            </div>

                            <div className="modal-body pt-4 pb-4">
                                <h5 className="">Deseja realmente sair da sua conta?</h5>
                            </div>

                            <div className="modal-footer border-0 pt-0">
                                <button
                                    type="button"
                                    className="btn btn-light text-dark fw-bold px-4"
                                    onClick={() => setShowModalSair(false)}
                                    style={{ border: '1px solid #ced4da' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger fw-bold px-4"
                                    onClick={handleLogout}
                                    style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
                                >
                                    Sair
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModalSair && <div className="modal-backdrop fade show"></div>}
        </nav>

    );

}





export default Navadm;
