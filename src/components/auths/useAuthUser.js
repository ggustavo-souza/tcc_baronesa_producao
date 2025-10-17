import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useAuthUser() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
      navigate("/login");
    } else {
      setUsuario(usuarioLogado);
    }
  }, [navigate]);

  return usuario; // pode ser null no início, mas depois pega
}
