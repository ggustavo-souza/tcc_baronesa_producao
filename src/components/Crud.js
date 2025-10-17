import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navadm from "./Navadm";
import Aos from "aos";
import "../App.css";
import "../awesome/all.min.css";

function Crud() {
  const navigate = useNavigate();
  const baseUrl = "."

  const [contador, setContador] = useState({
    usuarios: 0,
    moveis: 0,
    orcamentos: 0

  });

  const [loading, setLoading] = useState(true); // flag de carregamento

  useEffect(() => {
    fetch(`${baseUrl}/api/contador.php`)
      .then(res => res.json())
      .then(data => {
        setContador(data);
        setLoading(false); // dados carregados
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });

    Aos.init({ duration: 850 });
  }, []);

  const cards = [
    {
      title: "Usuários",
      icon: "fa-solid fa-users",
      route: "/admin-usuarios",
      count: contador.usuarios,
    },
    {
      title: "Móveis",
      icon: "fa-solid fa-box-open",
      route: "/admin-produtos",
      count: contador.moveis,
    },
    {
      title: "Orçamentos",
      icon: "fa-solid fa-clipboard-list",
      route: "/admin-orcamentos",
      count: contador.orcamentos,
    },
  ];

  return (
    <main>
      <Navadm />
      <div className="container mt-5">
        <h1 className="text-center corAmarela mb-4" style={{ color: "#FFD230" }}>Painel Administrativo</h1>
        <div className="row g-4" data-aos="fade-up">
          {cards.map((card, index) => (
            <div className={index === 2 ? "col-md-12 mb-5" : "col-md-6"}>
              <div
                className="card text-center p-4 shadow"
                style={{
                  backgroundColor: "#503325",
                  color: "#FFD230",
                  borderRadius: "15px",
                  cursor: "pointer",
                  transition: "transform 0.3s",
                }}
                onClick={() => navigate(card.route)}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <i className={`${card.icon} fa-3x mb-3`}></i>
                <h4>{card.title}</h4>
                <p>{loading ? "Carregando..." : `${card.count} registros`}</p>
                <button className="btn btn-warning mt-2">Acessar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Crud;
