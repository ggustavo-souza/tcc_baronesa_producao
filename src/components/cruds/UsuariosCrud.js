import Navadm from '../Navadm';
import "../../App.css";
import Aos from 'aos';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UsuariosCrud() {
    const navigate = useNavigate();
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalErro, setModalErro] = useState(false);
    const [mensagemModal, setMensagemModal] = useState({ message: "" })

    // --- ESTADOS PARA OS MODAIS ---
    const [showModalExcluir, setShowModalExcluir] = useState(false);
    const [usuarioIdParaExcluir, setUsuarioIdParaExcluir] = useState(null);

    // Estado unificado para o modal de formulário (Adicionar/Editar)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    // Estado unificado para os dados do formulário
    const [formData, setFormData] = useState({
        id: null,
        nome: '',
        email: '',
        senha: '',
        cargo: ''
    });
    const [mostrarSenha, setMostrarSenha] = useState(false);

    useEffect(() => {
        Aos.init({ duration: 500 });
        fetchUsuarios();
    }, []);

    async function fetchUsuarios() {
        try {
            const res = await fetch(`${urlAPI}api/usuarios`);
            if (!res.ok) throw new Error("Erro ao carregar usuários");
            const data = await res.json();
            setRegistros(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function excluirUsuario() {
        if (!usuarioIdParaExcluir) return;
        try {
            const res = await fetch(`${urlAPI}api/usuarios/${usuarioIdParaExcluir}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Erro ao excluir usuário");
            await res.json(); // Consumir a resposta da API
            setRegistros(registros.filter(u => u.id !== usuarioIdParaExcluir));
            setShowModalExcluir(false);
            setUsuarioIdParaExcluir(null);
        } catch (err) {
            console.error(err);
            let erro = `Falha ao excluir o usuário: ${err.message}`
            setMensagemModal({ message: erro });
            setModalErro(true)
        }
    }

    // --- FUNÇÃO UNIFICADA PARA SALVAR (ADICIONAR E EDITAR) ---
    async function salvarUsuario(e) {
        e.preventDefault();

        const isEditing = !!formData.id;
        const url = isEditing
            ? `${urlAPI}api/usuarios/${formData.id}`
            : `${urlAPI}api/usuarios`;

        // Apenas envia a senha se ela foi preenchida
        const dadosParaEnviar = { ...formData };
        if (!dadosParaEnviar.senha) {
            delete dadosParaEnviar.senha;
        }

        try {
            const res = await fetch(url, {
                method: "POST", // Sua API usa POST para adicionar e editar
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosParaEnviar)
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Falha ao salvar usuário");
            }

            fecharFormModal();
            fetchUsuarios(); // Recarrega a lista para mostrar as alterações

        } catch (err) {
            let erro = `Ocorreu um erro: ${err.message}`
            setMensagemModal(erro);
            setModalErro(true)
        }
    }

    // --- FUNÇÕES DE CONTROLE DO MODAL DE FORMULÁRIO ---
    function abrirModalAdicionar() {
        setFormData({ id: null, nome: '', email: '', senha: '', cargo: '' });
        setIsFormModalOpen(true);
    }

    function abrirModalEditar(usuario) {
        setFormData({ ...usuario, senha: '' }); // Limpa a senha para não exibi-la
        setIsFormModalOpen(true);
    }

    function fecharFormModal() {
        setIsFormModalOpen(false);
        setMostrarSenha(false); // Garante que a senha esteja oculta na próxima vez
        setFormData({ id: null, nome: '', email: '', senha: '', cargo: '' });
    }

    if (loading) return <h3 className='mt-5' style={{ color: '#FFD230' }}>Carregando...</h3>;
    if (error) return <div><h3 className='mt-5' style={{ color: '#FFD230' }}>Ocorreu algum erro... <i className='fa-regular fa-face-dizzy' style={{ color: 'crimson' }}></i></h3><button className='btn btn-warning mt-4 col-5' onClick={() => navigate(-1)}>Voltar</button></div>;

    return (
        <>
            <Navadm />
            <div className='container mt-5'>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className='fw-bold' style={{ color: '#FFD230' }}>
                        <i className="fa-solid fa-users me-2"></i>Usuários
                    </h2>
                    <button className='btn btn-warning fw-bold' onClick={abrirModalAdicionar}>
                        <i className="fa-solid fa-user-plus me-2"></i>
                        Adicionar Usuário
                    </button>
                </div>
                <div className="card border-0 shadow-sm p-4" data-aos="fade-up">
                    {registros.length > 0 ? (
                        <div className="table-responsive">
                            <table className='table table-hover table-bordered border-dark table-align-middle'>
                                <thead className='table-warning'>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Email</th>
                                        <th>Cargo</th>
                                        <th className='text-center'>Opções</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registros.map(registro => (
                                        <tr key={registro.id}>
                                            <td>{registro.id}</td>
                                            <td>{registro.nome}</td>
                                            <td>{registro.email}</td>
                                            <td>{registro.cargo}</td>
                                            <td>
                                                <div className="d-flex justify-content-center gap-2">
                                                    <button className='btn btn-outline-danger btn-sm'
                                                        onClick={() => { setUsuarioIdParaExcluir(registro.id); setShowModalExcluir(true); }}>
                                                        <i className='fa-solid fa-trash me-2'></i>
                                                        Excluir
                                                    </button>
                                                    <button className='btn btn-warning btn-sm' onClick={() => abrirModalEditar(registro)}>
                                                        <i className='fa-solid fa-pen me-2'></i>
                                                        Editar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <p>Nenhum registro encontrado.</p>}
                </div>
            </div>

            {modalErro && (
                <>
                    <div className="modal" data-aos="fade-up" style={{ display: 'block' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg rounded-4">
                                <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title text-dark fw-bold">
                                        <i className="fa-solid fa-triangle-exclamation text-danger me-2"></i>
                                        Erro!
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setModalErro(false)}></button>
                                </div>
                                <div className="modal-body py-4">
                                    <p className="mb-0">{mensagemModal.message}</p>
                                </div>
                                <div className="modal-footer border-0 bg-light">
                                    <button type="button" className="btn btn-secondary" onClick={() => setModalErro(false)}>
                                        <i className="fa-solid"></i>
                                        Voltar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}

            {/* Modal Excluir */}
            {showModalExcluir && (
                <>
                    <div className="modal" data-aos="fade-up" style={{ display: 'block' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg rounded-4">
                                <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title text-dark fw-bold">
                                        <i className="fa-solid fa-triangle-exclamation text-danger me-2"></i>
                                        Confirmar Exclusão
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModalExcluir(false)}></button>
                                </div>
                                <div className="modal-body py-4">
                                    <p className="mb-0">Deseja realmente excluir este usuário? Esta ação não pode ser desfeita.</p>
                                </div>
                                <div className="modal-footer border-0 bg-light">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModalExcluir(false)}>Cancelar</button>
                                    <button type="button" className="btn btn-danger fw-bold" onClick={excluirUsuario}>
                                        <i className="fa-solid fa-trash me-2"></i>
                                        Sim, Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}

            {/* --- MODAL UNIFICADO PARA ADICIONAR/EDITAR USUÁRIO --- */}
            {isFormModalOpen && (
                <>
                    <div className="modal" data-aos="fade-up" style={{ display: 'block' }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg rounded-4">
                                <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title fw-bold text-dark">
                                        <i className={formData.id ? "fa-solid fa-user-pen text-warning me-2" : "fa-solid fa-user-plus text-warning me-2"}></i>
                                        {formData.id ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
                                    </h5>
                                    <button className="btn-close" onClick={fecharFormModal}></button>
                                </div>
                                <form onSubmit={salvarUsuario}>
                                    <div className="modal-body p-4">
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control" id="nomeUsuario" placeholder="Nome completo" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} required />
                                                    <label htmlFor="nomeUsuario">Nome completo</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-floating">
                                                    <input type="email" className="form-control" id="emailUsuario" placeholder="E-mail" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                                                    <label htmlFor="emailUsuario">E-mail</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-group">
                                                    <span className="input-group-text"><i className="fa-solid fa-briefcase"></i></span>
                                                    <select className="form-select p-3" value={formData.cargo} onChange={e => setFormData({ ...formData, cargo: e.target.value })} required>
                                                        <option value="" disabled>Selecione o cargo...</option>
                                                        <option value="admin">Admin</option>
                                                        <option value="usuario">Usuário</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label text-muted small">{formData.id ? 'Nova senha (deixe em branco para não alterar)' : 'Senha'}</label>
                                                <div className="input-group">
                                                    <span className="input-group-text"><i className="fa-solid fa-lock"></i></span>
                                                    <input
                                                        type={mostrarSenha ? "text" : "password"}
                                                        className="form-control"
                                                        placeholder="Senha"
                                                        value={formData.senha}
                                                        onChange={e => setFormData({ ...formData, senha: e.target.value })}
                                                        required={!formData.id} // Senha é obrigatória apenas ao criar
                                                    />
                                                    <button className="btn btn-outline-secondary" type="button" onClick={() => setMostrarSenha(!mostrarSenha)}>
                                                        <i className={`fa-solid ${mostrarSenha ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer bg-light border-0">
                                        <button type="button" className="btn btn-secondary" onClick={fecharFormModal}>
                                            <i className="fa-solid fa-xmark me-2"></i>Cancelar
                                        </button>
                                        <button type="submit" className="btn btn-warning fw-bold">
                                            <i className="fa-solid fa-check me-2"></i>
                                            {formData.id ? 'Salvar Alterações' : 'Adicionar Usuário'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </>
    );
}