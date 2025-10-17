import Navadm from '../Navadm';
import "../../App.css";
import Aos from 'aos';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MoveisCrud() {
    const navigate = useNavigate();
    const [registros, setRegistros] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModalErro, setShowModalErro] = useState(false)
    const [showModalExcluir, setShowModalExcluir] = useState(false);
    const [movelIdParaExcluir, setMovelIdParaExcluir] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        nome: '',
        valor: '',
        descricao: '',
        categoria_id: '',
        fotos: null
    });

    useEffect(() => {
        Aos.init({ duration: 500 });
        carregarMoveis();
        carregarCategorias();
    }, []);

    async function carregarMoveis() {
        try {
            const res = await fetch("http://localhost/tcc_baronesa/api/moveis");
            if (!res.ok) throw new Error("Erro ao carregar móveis");
            const data = await res.json();
            setRegistros(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function carregarCategorias() {
        try {
            const res = await fetch("http://localhost/tcc_baronesa/api/categorias");
            if (!res.ok) throw new Error("Erro ao carregar categorias");
            const data = await res.json();
            setCategorias(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function deletarMovel() {
        if (!movelIdParaExcluir) return;
        try {
            const res = await fetch(`http://localhost/tcc_baronesa/api/moveis/${movelIdParaExcluir}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Erro ao excluir móvel");
            setRegistros(registros.filter(m => m.id !== movelIdParaExcluir));
            setShowModalExcluir(false);
            setMovelIdParaExcluir(null);
        } catch (err) {
            console.error(err);
            setShowModalErro(true);
        }
    }

    async function salvarMovel(e) {
        e.preventDefault();
        const form = new FormData();
        if (formData.id) form.append("id", formData.id);
        form.append("nome", formData.nome);
        form.append("valor", formData.valor);
        form.append("descricao", formData.descricao);
        form.append("categoria_id", formData.categoria_id);

        if (formData.fotos) {
            for (let i = 0; i < formData.fotos.length; i++) {
                form.append("fotos[]", formData.fotos[i]);
            }
        }

        try {
            const res = await fetch("http://localhost/tcc_baronesa/api/moveis", {
                method: "POST",
                body: form
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Falha ao salvar móvel");
            }

            fecharFormModal();
            carregarMoveis();

        } catch (err) {
            console.error("Falha ao salvar móvel", err);
            setShowModalErro(true);
        }
    }

    function abrirModalAdicionar() {
        setFormData({ id: null, nome: '', valor: '', descricao: '', categoria_id: '', fotos: null });
        setIsFormModalOpen(true);
    }

    function abrirModalEditar(movel) {
        setFormData({
            id: movel.id,
            nome: movel.nome,
            valor: movel.valor,
            descricao: movel.descricao,
            categoria_id: movel.categoria_id,
            fotos: null
        });
        setIsFormModalOpen(true);
    }

    function fecharFormModal() {
        setIsFormModalOpen(false);
        setFormData({ id: null, nome: '', valor: '', descricao: '', categoria_id: '', fotos: null });
    }

    if (loading) return <h3 className='mt-5' style={{ color: '#FFD230' }}>Carregando...</h3>;
    if (error) return <div><h3 className='mt-5' style={{ color: '#FFD230' }}>Ocorreu algum erro... <i className='fa-regular fa-face-dizzy' style={{ color: 'crimson' }}></i></h3><button className='btn btn-warning mt-4 col-5' onClick={() => navigate(-1)}>Voltar</button></div>;

    return (
        <>
            <Navadm />
            <div className='container mt-5'>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className='fw-bold' style={{ color: '#FFD230' }}>
                        <i className="fa-solid fa-chair me-2"></i>Móveis
                    </h2>
                    <button className='btn btn-warning fw-bold' onClick={abrirModalAdicionar}>
                        <i className="fa-solid fa-plus me-2"></i>
                        Adicionar Móvel
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
                                        <th>Valor</th>
                                        <th>Descrição</th>
                                        <th>Categoria</th>
                                        <th>Foto (Capa)</th>
                                        <th className='text-center'>Opções</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registros.map(m => (
                                        <tr key={m.id}>
                                            <td>{m.id}</td>
                                            <td>{m.nome}</td>
                                            <td>R$ {parseFloat(m.valor).toFixed(2)}</td>
                                            <td>{m.descricao}</td>
                                            <td>{categorias.find(c => c.id === m.categoria_id)?.nome || '—'}</td>
                                            <td>
                                                {m.fotos?.length > 0 && (
                                                    <img src={`http://localhost/tcc_baronesa/api/uploads/${m.fotos.find(f => f.principal)?.foto || m.fotos[0].foto}`} alt={m.nome} width="50" className="img-thumbnail" />
                                                )}
                                            </td>
                                            <td>
                                                <div className="d-flex justify-content-center gap-2">
                                                    <button className='btn btn-outline-danger btn-sm'
                                                        onClick={() => { setMovelIdParaExcluir(m.id); setShowModalExcluir(true); }}>
                                                        <i className='fa-solid fa-trash me-1 '></i>
                                                        Excluir
                                                    </button>
                                                    <button className='btn btn-warning btn-sm' onClick={() => abrirModalEditar(m)}>
                                                        <i className='fa-solid fa-pen me-1'></i>
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
                                    <p className="mb-0">Deseja realmente excluir este móvel? Esta ação não pode ser desfeita.</p>
                                </div>
                                <div className="modal-footer border-0 bg-light">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModalExcluir(false)}>Cancelar</button>
                                    <button type="button" className="btn btn-danger fw-bold" onClick={deletarMovel}>
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

            {showModalErro && (
                <>
                    <div className="modal" data-aos="fade-up" style={{ display: 'block' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg rounded-4">
                                <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title text-dark fw-bold">
                                        <i className="fa-solid fa-triangle-exclamation text-danger me-2"></i>
                                        Erro
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModalErro(false)}></button>
                                </div>
                                <div className="modal-body py-4">
                                    <p className="mb-0">Ocorreu um erro na interação.</p>
                                </div>
                                <div className="modal-footer border-0 bg-light">
                                    <button type="button" className="btn btn-danger fw-bold" onClick={() => setShowModalErro(false)}>
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

            {/* --- MODAL UNIFICADO PARA ADICIONAR/EDITAR --- */}
            {isFormModalOpen && (
                <>
                    <div className="modal" data-aos="fade-up" style={{ display: 'block' }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg rounded-4">
                                <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title fw-bold text-dark">
                                        <i className={formData.id ? "fa-solid fa-pen-to-square text-warning me-2" : "fa-solid fa-plus text-warning me-2"}></i>
                                        {formData.id ? 'Editar Móvel' : 'Adicionar Novo Móvel'}
                                    </h5>
                                    <button className="btn-close" onClick={fecharFormModal}></button>
                                </div>
                                <form onSubmit={salvarMovel}>
                                    <div className="modal-body p-4">
                                        <div className="row g-3">
                                            <div className="col-md-7">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control" id="nomeMovel" placeholder="Nome do Móvel" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} required />
                                                    <label htmlFor="nomeMovel">Nome do Móvel</label>
                                                </div>
                                            </div>
                                            <div className="col-md-5">
                                                <div className="form-floating">
                                                    <input type="number" className="form-control" id="valorMovel" placeholder="Valor" step="0.01" value={formData.valor} onChange={e => setFormData({ ...formData, valor: e.target.value })} required />
                                                    <label htmlFor="valorMovel">Valor (R$)</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-floating">
                                                    <textarea className="form-control" id="descricaoMovel" placeholder="Descrição" style={{ height: '100px' }} value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })}></textarea>
                                                    <label htmlFor="descricaoMovel">Descrição</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="input-group">
                                                    <span className="input-group-text"><i className="fa-solid fa-tags"></i></span>
                                                    <select className="form-select p-3" value={formData.categoria_id} onChange={e => setFormData({ ...formData, categoria_id: e.target.value })} required>
                                                        <option value="" disabled>Selecione a categoria...</option>
                                                        {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="fotosMovel" className="form-label text-muted">Fotos (novas imagens substituirão as antigas)</label>
                                                <input type="file" name="fotos[]" className="form-control form-control-lg" id="fotosMovel" multiple onChange={e => setFormData({ ...formData, fotos: e.target.files })} />
                                            </div>
                                            {formData.fotos && formData.fotos.length > 0 && (
                                                <div className="col-12">
                                                    <div className="d-flex flex-wrap gap-3 mt-2">
                                                        {Array.from(formData.fotos).map((file, i) => (
                                                            <div key={i} className="image-preview-item-bs">
                                                                <img src={URL.createObjectURL(file)} alt={`preview-${i}`} className="img-fluid rounded border" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="modal-footer bg-light border-0">
                                        <button type="button" className="btn btn-secondary" onClick={fecharFormModal}>
                                            <i className="fa-solid fa-xmark me-2"></i>Cancelar
                                        </button>
                                        <button type="submit" className="btn btn-warning fw-bold">
                                            <i className="fa-solid fa-check me-2"></i>
                                            {formData.id ? 'Salvar Alterações' : 'Adicionar Móvel'}
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