import React from "react";
import { Link } from "react-router-dom";
import '../App.css';
import '../awesome/all.min.css';
import { useEffect } from "react";
import { useAuthAdm } from "./auths/useAuthAdm";

function Navbar() {

    useAuthAdm();

    const [isNavCollapsed, setIsNavCollapsed] = React.useState(true);
    const [usuarioLogado, setUsuarioLogado] = React.useState(null);

    const handleToggle = () => {
        setIsNavCollapsed(!isNavCollapsed);
    };

    useEffect(() => {
        const usuario = localStorage.getItem("usuarioLogado");
        if (usuario) {
            setUsuarioLogado(JSON.parse(usuario));
        }
    }, []);


    return (
        <nav className="navbar navbar-expand-lg CorNavbar navbarNav">
            {/* CONTAINER MAIS GERAL */}
            <div className="container-fluid">
                {/* LOGO (mantido à esquerda) */}
                <Link className={`navbar-brand ${!isNavCollapsed ? 'invisible' : ''}`} to="/">
                    <img
                        src="/logo_nav.png"
                        alt="Logo"
                        className="logo-navbar"
                        width="150"
                        height="70"
                    />
                </Link>

                {/* BOTÃO TOGGLER (HAMBÚRGUER) */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded={!isNavCollapsed}
                    aria-label="Toggle navigation"
                    onClick={handleToggle}
                    style={{ backgroundColor: '#FFD230' }}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse${isNavCollapsed ? '' : ' show'}`} id="navbarNav">

                    <ul className="navbar-nav subir ms-auto me-auto">
                        <li className="nav-item">
                            <Link className="nav-link fw-bold fs-5 m-1" to="/" style={{ color: '#FFD230' }}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-bold fs-5 m-1" to="/orcamento" style={{ color: '#FFD230' }}>Orçamento</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-bold fs-5 m-1" to="/produtos" style={{ color: '#FFD230' }}>Produtos</Link>
                        </li>
                        <li className="nav-item d-lg-none">
                            <Link className="nav-link fw-bold fs-5 " to={usuarioLogado ? "/minhaconta" : "/login"} style={{ color: '#FFD230' }}>
                                <i className="fa-solid fa-user-plus me-2"></i>
                                {usuarioLogado ? "Minha Conta" : "Login"}
                            </Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav d-none d-lg-flex subir" >
                        <li className="nav-item">
                            <Link className="nav-link fw-bold fs-5 " to={usuarioLogado ? "/minhaconta" : "/login"} style={{ color: '#FFD230' }}>
                                <i className="fa-solid fa-user-plus me-2"></i>
                                {usuarioLogado ? "Minha Conta" : "Fazer Login"}
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;