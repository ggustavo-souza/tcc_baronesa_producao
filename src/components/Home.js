import '../App.css';
import '../awesome/all.min.css';
import Carroussel from './Carrossel';
import Navbar from './Navbar';
import Footer from './Footer';
import Aos from 'aos';
import 'aos/dist/aos.css';
import React, { useEffect } from 'react';

function RemoverAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


function Home() {
  useEffect(() => {
    Aos.init({ duration: 850 });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mt-5 ">
        <div className="row justify-content-center mt-4">
          <Carroussel />
          <ListaPequena />
          <SobreNos />
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ListaPequena() {
  const categories = ["mesas", "cadeiras", "armários", "cômodas", "planejados"];

  return (
    <div className="category-container mt-4" data-aos="fade-up">
      <ul className="category-list">
        {categories.map((category, index) => (
          <li key={index} className="category-item">
            <a href={`/produtos/${RemoverAcentos(category)}`}>{category.charAt(0).toUpperCase() + category.slice(1)}</a>
          </li>
        ))
        }
      </ul>
    </div>
  );
}

function SobreNos() {

  const imgLogo = "/logo_nav.png";



  return (
    <section className="sobre-nos-container" id="sobre-nos" data-aos="fade-up">
      <div className="sobre-nos-content">
        <div className="sobre-nos-image-wrapper">
          <img
            src={imgLogo}
            alt="logo do sobre nos"
            className="sobre-nos-image"
          />
        </div>
        <h2 className="sobre-nos-title">Nossa História</h2>
        <p style={{ margin_top: '1rem', }}>
          Fundada com a paixão por sabores autênticos e o desejo de criar momentos inesquecíveis, <strong>A Baronesa</strong> nasceu do sonho de resgatar receitas de família e apresentá-las com um toque de sofisticação e modernidade. Cada produto que oferecemos é um elo entre o passado e o presente, carregando a herança e o cuidado que só o tempo e a dedicação podem oferecer.
        </p>

        <h3 className="sobre-nos-subtitle">Nossa Missão</h3>
        <p>
          Nossa missão é oferecer uma experiência única, onde a excelência dos ingredientes e o primor no preparo se unem para encantar o paladar. Queremos ser mais do que uma empresa: queremos ser parte das suas melhores memórias, celebrando a vida com sabor e elegância.
        </p>

        <h3 className="sobre-nos-subtitle">Nossos Valores</h3>
        <ul className="sobre-nos-valores">
          <li><strong>Qualidade Suprema:</strong> Selecionamos os melhores ingredientes, garantindo um produto final de excelência.</li>
          <li><strong>Paixão em Servir:</strong> Cada cliente é único e nosso atendimento reflete o carinho que temos pelo que fazemos.</li>
          <li><strong>Tradição e Inovação:</strong> Honramos nossas raízes enquanto buscamos constantemente novas formas de surpreender.</li>
          <li><strong>Respeito e Sustentabilidade:</strong> Valorizamos nossos parceiros, nossa comunidade e o meio ambiente.</li>
        </ul>
      </div>

    </section>
  )
}

export default Home;