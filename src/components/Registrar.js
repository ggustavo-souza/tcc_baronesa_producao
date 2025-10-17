import React from "react";
import "../App.css";
import "../awesome/all.min.css";
import Navbar from './Navbar';
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FormRegistrar() {
    const navigate = useNavigate();
    const baseUrl = "./"
    useEffect(() => {
        Aos.init({ duration: 1000 });
    
    }, []);
    const [form, setForm] = useState({ nome: "", email: "", password: "" });
    const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const closeAlert = () => {
        setAlertMessage({ type: "", message: "" });
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setAlertMessage({ type: '', message: ''});

        const resposta = await fetch(`${baseUrl}api/cadastro.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        const data = await resposta.json();

        if (data.mensagem) {
            setAlertMessage({ type: 'success', message: 'Registro realizado com sucesso!' });
            navigate("/login")
        } else {
            setAlertMessage({ type: 'danger', message: data.erro || "Erro no Registro" });
        }
    };

    return (
        <main>
            <Navbar />
            <div className="container">
                <div className="row justify-content-center mt-4" data-aos="fade-up">
                    <div className="col-md-6 card p-5" style={{ backgroundColor: '#503325c1', borderRadius: '10px' }}>
                         {alertMessage.message && (
                            <div className={`alert alert-${alertMessage.type} alert-dismissible fade show`} role="alert">
                                {alertMessage.message}
                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={closeAlert}></button>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="form-login">
                            <h1 className="text-center corAmarela" style={{ color: '#FFD230' }}>Registrar</h1>
                            <div className="form-group mt-5">
                                <label htmlFor="username" style={{ color: '#FFD230' }}>Nome de Usuário</label>
                                <input type="text" id="username" name="nome" className="form-control mt-1" required value={form.nome} onChange={handleChange}
/>
                            </div>
                            <div className="form-group mt-3">
                                <label htmlFor="email" style={{ color: '#FFD230' }}>E-mail</label>
                                <input type="email" id="email" name="email" className="form-control mt-1" required value={form.email} onChange={handleChange}/>
                            </div>
                            <div className="form-group mt-3">
                                <label htmlFor="password" style={{ color: '#FFD230' }}>Senha</label>
                                <input type="password" id="password" name="password" className="form-control mt-1" required value={form.password} onChange={handleChange}/>
                            </div>
                            <div>
                                <button type="submit" className="btn btn-warning mt-4 corBotao">Registrar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default FormRegistrar;