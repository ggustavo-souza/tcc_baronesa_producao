import AOS from 'aos';
import { useEffect } from 'react';
import 'aos/dist/aos.css';
import '../App.css';
import '../awesome/all.min.css';


function Carroussel() {

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);



  return (
    <div className="wide-carousel-container" data-aos="fade-up">
      {/* O id "carouselExampleIndicators" é importante para o Bootstrap JS */}
      <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" data-bs-interval="4500">
        {/* Indicadores (os pequenos pontos na parte inferior) */}
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="3"
            aria-label="Slide 4"
          ></button>

        </div>

        <div className="carousel-inner shadow shadow-3">
          {/* Item 1 do Carrossel */}
          <div className="carousel-item active">
            <img
              src="/carroussel1.jfif"
              className="d-block w-100 wide-carousel-img"
              alt="Primeiro slide"
            />
            <div className="carousel-caption d-none d-md-block">
              <h4>Móveis para Quarto</h4>
              <p>Confira novos itens para o seu quarto!</p>
            </div>
          </div>

          {/* Item 2 do Carrossel */}
          <div className="carousel-item">
            <img
              src="/ex2.jpg"
              className="d-block w-100 wide-carousel-img"
              alt="Segundo slide"
            />
            <div className="carousel-caption d-none d-md-block">
              <h4>Móveis para Cozinha</h4>
              <p>Nosso catálogo para cozinhas!</p>
            </div>
          </div>

          {/* Item 3 do Carrossel */}
          <div className="carousel-item">
            <img
              src="/carroussel3.jfif"
              className="d-block w-100 wide-carousel-img"
              alt="Terceiro slide"
            />
            <div className="carousel-caption d-none d-md-block">
              <h4>Móveis para Sala de estar</h4>
              <p>Confira nossos itens para salas!</p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="/planejados.jpeg"
              className="d-block w-100 wide-carousel-img"
              alt="Quarto slide"
            />
            <div className="carousel-caption d-none d-md-block">
              <h4>Planejados</h4>
              <p>Planeje seu móvel como você quiser!</p>
            </div>
          </div>
        </div>

        {/* Controles do Carrossel */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default Carroussel;