import "../App.css";
import "../awesome/all.min.css";
import Navbar from './Navbar'
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

function FormLogin() {
    useEffect(() => {
        Aos.init({ duration: 1000 });

    }, []);
    const baseUrl = "https://tccbaronesapi.cloud"
    const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });
    const [form, setForm] = useState({ nome: "", password: "" });
    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const closeAlert = () => {
        setAlertMessage({ type: "", message: "" });
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setAlertMessage({ type: '', message: '' });
        try {
            const response = await fetch(`${baseUrl}/api/login.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: form.nome,
                    email: form.email,
                    password: form.password
                }),
            });
            const data = await response.json();

            if (data.sucesso) {
                setAlertMessage({ type: 'success', message: 'Login realizado com sucesso!' });
                // salvando o ID do usuário também
                localStorage.setItem("usuarioLogado", JSON.stringify({
                    id: data.usuario.id,
                    nome: data.usuario.nome,
                    email: data.usuario.email,
                    cargo: data.usuario.cargo,
                }));
                if (data.usuario.cargo === "admin") {
                    navigate("/crud"); // rota do admin
                } else {
                    navigate("/"); // rota do usuário comum
                }
            } else {
                setAlertMessage({ type: 'danger', message: data.erro || "Erro no login" });
            }
        } catch (error) {
            setAlertMessage({ type: 'danger', message: 'Erro ao conectar com o servidor. Por favor, tente novamente mais tarde.' });
            console.error("Erro ao conectar com o servidor:", error);
        }
    };


    return (
        <main>
            <Navbar />
            <div className="container">
                <div className="row justify-content-center mt-5 mb-5" data-aos="fade-up">
                    <div className="col-md-6 card p-5" style={{ backgroundColor: '#503325c1', borderRadius: '10px' }} >
                        {alertMessage.message && (
                            <div className={`alert alert-${alertMessage.type} alert-dismissible fade show`} role="alert">
                                {alertMessage.message}
                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={closeAlert}></button>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="form-login">
                            <h1 className="text-center corAmarela" style={{ color: '#FFD230' }}>Login</h1>
                            <div className="form-group mt-5">
                                <label htmlFor="nome" style={{ color: '#FFD230' }}>Nome de Usuário</label>
                                <input type="text" id="nome" name="nome" className="form-control mt-1" required value={form.usuario} onChange={handleChange} />
                            </div>
                            <div className="form-group mt-3">
                                <label htmlFor="password" style={{ color: '#FFD230' }}>Senha</label>
                                <input type="password" id="password" name="password" className="form-control mt-1" required value={form.password} onChange={handleChange} />
                            </div>
                            <div>
                                <button type="submit" className="btn btn-warning mt-5 corBotao">Login</button>
                            </div>
                            <div className="mt-2 btn">
                                <Link to='/registrar' className="text-decoration-none text-warning fw-bold fs-5 suba">Não possui conta? Clique aqui para se registrar!</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default FormLogin;