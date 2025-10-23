import { useEffect, useState } from "react";
import "../../App.css";
import "../../awesome/all.min.css";
import Navbar from "../Navbar";
import Footer from '../Footer';
import { Link, useParams } from "react-router-dom"; // 1. Importar o useParams

function HomeProdutos() {
    const { categoria } = useParams();
    const urlAPI = "tccbaronesaapi.cloud/"
    const [moveis, setMoveis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        async function fetchMoveis() {
            // Reseta o estado a cada nova busca
            setLoading(true);
            setErro(null);

            const apiUrl = categoria
                ? `${urlAPI}api/moveis/categoria/${categoria}`
                : `${urlAPI}api/moveis`;

            try {
                const resposta = await fetch(apiUrl);

                if (!resposta.ok) {
                    if(resposta.status === 404) {
                        setMoveis([]);
                    } else {
                        throw new Error("Erro ao carregar os produtos.");
                    }
                } else {
                    const data = await resposta.json();
                    setMoveis(data);
                }

            } catch (error) {
                setErro(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchMoveis();
    }, [categoria]); // A dependência [categoria] é crucial!

    // Função para capitalizar a primeira letra para o título
    const capitalizar = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const renderStatusContainer = (iconClass, text, isError = false) => (
        <div className="row mt-5">
            <div className="col-12">
                <div className="status-container">
                    <i className={`fa-solid ${iconClass} fa-2x ${isError ? 'text-danger' : 'text-muted'} mb-3`}></i>
                    <p className={`status-text ${isError ? 'text-danger' : 'text-muted'}`}>
                        {text}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <main>
            <Navbar />
            <div className="container my-5 py-5">
                <div className="row">
                    <div className="col-12 text-center">
                        {/* 5. Título dinâmico que reflete a categoria atual */}
                        <h1 className="titulo-pagina">
                            {categoria ? capitalizar(categoria) : 'Nossos Produtos'}
                        </h1>
                        <p className="lead mb-5" style={{color: "#ffffff"}}>
                            Móveis artesanais que contam uma história em cada detalhe.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="row mt-5">
                        <div className="col-12">
                            <div className="status-container">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="status-text">Carregando produtos...</p>
                            </div>
                        </div>
                    </div>
                ) : erro ? (
                    renderStatusContainer("fa-triangle-exclamation", erro, true)
                ) : moveis.length === 0 ? (
                    // Mensagem ajustada para quando não há produtos na categoria
                    renderStatusContainer("fa-box-open", `Nenhum produto encontrado ${categoria ? `na categoria '${categoria}'` : 'no momento.'}`)
                ) : (
                    <div className="product-grid">
                        {moveis.map((movel) => {
                            const imageUrl = (movel.fotos && movel.fotos.length > 0)
                                ? `${urlAPI}api/uploads/${movel.fotos[0].foto}`
                                : "https://via.placeholder.com/300x250/ccc/888?text=Sem+Foto";

                            return (
                                <div className="card card-produto" key={movel.id}>
                                    <div className="card-img-container">
                                        <img
                                            src={imageUrl}
                                            className="card-img-top"
                                            alt={movel.nome}
                                        />
                                        <div className="card-img-overlay-content">
                                            <Link to={`/produto/${movel.id}`} className="btn btn-ver-mais">
                                                Ver Detalhes
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h2 className="card-title">{movel.nome}</h2>
                                        <p className="card-text">
                                            {movel.descricao || "Sem descrição disponível."}
                                        </p>
                                        <p className="card-price">
                                            R$ {parseFloat(movel.valor).toFixed(2).replace('.', ',')}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}

export default HomeProdutos;
