import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuthAdm() {
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (usuario) {
      if (usuario.cargo === "admin") {
        navigate("/crud", { replace: true });
      }
    }
  }, [navigate]);
}