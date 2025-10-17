import React, { useState, useEffect } from "react";
import "../../App.css";
import { Link } from "react-router-dom";

export default function AuthAcess({ children }) {
  const [showMessage, setMessage] = useState(null);
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  useEffect(() => {
    if (usuario && usuario.cargo === "admin") {
      setMessage("logado"); // alerta some em 2,5s
    } else {
      setMessage("Você não é autorizado aqui!");

    }
  }, [usuario]);

  if (!usuario || usuario.cargo !== "admin") {
    return (
      <>
        <div className="card mt-5 container col-md-5 col-6" style={{backgroundColor: "#503325"}}>
          <div className="card-body shadow shadow-5">
            <h3 style={{color: "#FFD230"}}>{showMessage}</h3>
            <Link to="/"><button className="btn btn-danger col-3 align-self-center">Voltar</button> </Link>
          </div>
        </div>
      </>
    );
  }

  return children;
}