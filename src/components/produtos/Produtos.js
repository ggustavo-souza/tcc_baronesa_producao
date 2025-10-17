import { useEffect, useState } from "react";
import "../../App.css";
import "../../awesome/all.min.css";
import Navbar from "../Navbar";
import Footer from '../Footer';
import { Link } from "react-router-dom";


function HomeProdutos() {
    const baseUrl = "https://tccbaronesapi.cloud"
    const [moveis, setMoveis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        async function fetchMoveis() {
            try {
                const resposta = await fetch(`${baseUrl}/api/moveis`);
                if (!resposta.ok) throw new Error("Erro ao carregar os produtos.");
                const data = await resposta.json();
                setMoveis(data);
            } catch (error) {
                setErro(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchMoveis();
    }, []);

    return (
        <main>
            <Navbar />
            <div className="container mt-5 mb-5">
                <div className="col-12">
                    <h1 className="text-center fw-bold mb-3" style={{ color: "#FFD230" }}>
                        Produtos
                    </h1>
                </div>

                <div className="grid p-3 mb-4" style={{ backgroundColor: "#503325c1", borderRadius: "10px" }} data-aos='fade-up'>
                    {loading ? (
                        <p className="text-center text-light py-5">Carregando produtos...</p>
                    ) : erro ? (
                        <p className="text-center text-danger py-5">{erro}</p>
                    ) : moveis.length === 0 ? (
                        <p className="text-center text-light py-5">Nenhum produto disponível.</p>
                    ) : (
                        <div className="row mt-4">
                            {moveis.map((movel) => (
                                <div className="col-md-4" key={movel.id}>
                                    <div
                                        className="card card-produto p-3 m-2"
                                        style={{ backgroundColor: "#503325c1", borderRadius: "10px" }}
                                    >
                                        <h2 className="text-center titulo-produto" style={{ color: "#FFD230" }}>
                                            {movel.nome}
                                        </h2>

                                        <div className="card-img-top text-center">
                                            <img
                                                src={
                                                    movel.fotos && movel.fotos.length > 0
                                                        ? `${baseUrl}/api/uploads/${movel.fotos[0].foto}`
                                                        : "https://via.placeholder.com/150"
                                                }
                                                alt={movel.nome}
                                                className="img-fluid"
                                                style={{ maxHeight: "200px", objectFit: "cover", borderRadius: "10px" }}
                                            />
                                        </div>

                                        <p className="text-center mt-2" style={{ color: "#FFD230" }}>
                                            {movel.descricao || "Sem descrição disponível."}
                                        </p>

                                        <p className="text-center fw-bold" style={{ color: "#FFD230" }}>
                                            R$ {parseFloat(movel.valor).toFixed(2)}
                                        </p>

                                        <Link to={`/produto/${movel.id}`} className="btn btn-warning corBotao w-100 mt-auto">
                                            Ver mais
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default HomeProdutos;
