import './App.css';
import './awesome/all.min.css';
import Aos from 'aos';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import HomeProdutos from './components/produtos/Produtos';
import VerProduto from './components/produtos/Verproduto';
import HomeOrcamento from './components/Orcamento';
import FormLogin from './components/Login';
import FormRegistrar from './components/Registrar';
import MinhaConta from './components/Minhaconta';
import Crud from './components/Crud';
import UsuariosCrud from './components/cruds/UsuariosCrud';
import MoveisCrud from './components/cruds/MoveisCrud';
import AuthAcess from './components/auths/AuthAcess';
import AdminOrcamentos from './components/cruds/Orcamentos';
import MeusOrcamentos from './components/MeusOrcamentos';
import Pedidos from './components/Pedidos';
import { useEffect } from 'react';



function App() {

  useEffect(() => {
    Aos.init({ duration: 650 });
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/orcamento" element={<HomeOrcamento />}></Route>
          <Route path='/produtos' element={<HomeProdutos />}></Route>
          <Route path="/produtos/:categoria" element={<HomeProdutos />}></Route>
          <Route path="/produto/:id" element={<VerProduto />} />
          <Route path="/login" element={<FormLogin />}></Route>
          <Route path="/registrar" element={<FormRegistrar />}></Route>
          <Route path="/minhaconta" element={<MinhaConta />}></Route>
          <Route path="/meusorcamentos" element={<MeusOrcamentos />}></Route>
          <Route path="/pedidos" element={<Pedidos />}></Route>
          <Route path="/crud" element={
            <AuthAcess >
              <Crud />
            </AuthAcess>
          }>
          </Route>
          <Route path="/admin-usuarios" element={
            <AuthAcess >
              <UsuariosCrud />
            </AuthAcess>
          }>
          </Route>
          <Route path="/admin-produtos" element={
            <AuthAcess >
              <MoveisCrud />
            </AuthAcess>
          }>
          </Route>
          <Route path="/admin-orcamentos" element={
            <AuthAcess >
              <AdminOrcamentos />
            </AuthAcess>
          }>
          </Route>
          <Route path="*" element={
            <>
              <Erro404 />
            </>
          }>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function Erro404() {

  const navigate = useNavigate();
  return (
    <div className='card container col-8 col-md-7 col-sm-6 mt-5 CorNavbar p-4' data-aos='fade-up'>
      <h1 style={{ color: '#FFD230' }}>404 - Página não encontrada</h1>
      <button className='btn btn-warning mt-4 col-5 align-self-center' onClick={() => navigate(-1)}>Voltar</button>
    </div>
  )
}

export default App;
