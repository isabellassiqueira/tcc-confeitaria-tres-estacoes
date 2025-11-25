import { FiShoppingBag } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserRouter, Routes, Route } from 'react-router-dom';  
import './home.css';
import docesCarrosel from '../assets/docesCarrosel.png';
import salgadosCarrosel from '../assets/salgadosCarrosel.png';
import bolinhos from '../assets/bolinhos.png';
import doces from '../assets/doces.png';
import salgados from '../assets/salgados.png';
import teste from '../assets/teste.png';
import sobre from '../assets/sobre.png';
import bebidas from '../assets/bebidas.png';
import ProductCard from "../componentes/ProductCard.jsx";
import "../componentes/ProductCard.css";


const API = "http://localhost:3000/api/products";

const ConfeitariaDoGatinho = ({ adicionarAoCarrinho }) => {
  const [products, setProducts] = useState([]);

const fetchProducts = async () => {
    try {
      const res = await axios.get(API);
      setProducts(res.data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const produtosAleatorios = useMemo(() => {
  return [...products].sort(() => Math.random() - 0.5).slice(0, 8);
}, [products]);


  // ========================
  // CARROSSEL 1 (Hero) — anda sozinho
  // ========================
  const [currentSlideHero, setCurrentSlideHero] = useState(0);

  const nextHero = () => {
    setCurrentSlideHero((prev) => (prev + 1) % 3);
  };

  const prevHero = () => {
    setCurrentSlideHero((prev) => (prev === 0 ? 2 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextHero();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // ========================
  // CARROSSEL 2 (Produtos) — manual
  // ========================
  const [currentSlideProdutos, setCurrentSlideProdutos] = useState(0);

  const cardsPerView = 3;
  const totalSlides = Math.ceil(products.length / cardsPerView);

  const nextProdutos = () =>
    setCurrentSlideProdutos((prev) => (prev + 1) % totalSlides);

  const prevProdutos = () =>
    setCurrentSlideProdutos((prev) =>
      prev === 0 ? totalSlides - 1 : prev - 1
    );

  const goToSlideProdutos = (index) => {
    setCurrentSlideProdutos(index);
  };

  return (
    <div className="app">
      <main>

        {/* ======================
              CARROSSEL HERO
        ======================= */}
        <section className="carousel" id="inicio">
          <div
            className="carousel-slides"
            style={{ transform: `translateX(-${currentSlideHero * 100}%)` }}
          >
            {/* SLIDE 1 */}
            <div className="carousel-slide">
              <img src={teste} alt="Slide 1" />
              <div className="slide-content">
               <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '2.5rem' }}>Três Estações</h2>
                <p>Trazendo o melhor da Confeitaria para você.</p>
              </div>
            </div>

            {/* SLIDE 2 */}
            <div className="carousel-slide">
              <img src={docesCarrosel} alt="Slide 2" />
              <div className="slide-content">
                <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '2.5rem' }}>Doces Artesanais</h2>
                <p>Feitos com amor e ingredientes de primeira qualidade</p>
              </div>
            </div>

            {/* SLIDE 3 */}
            <div className="carousel-slide">
              <img src={salgadosCarrosel} alt="Slide 3" />
              <div className="slide-content">
                <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '2.5rem' }}>Salgados Especiais</h2>
                <p>Perfeitos para seu café da manhã ou lanche da tarde</p>
              </div>
            </div>
          </div>

          {/* Botões */}
          <button className="carousel-btn left" onClick={prevHero}>❮</button>
          <button className="carousel-btn right" onClick={nextHero}>❯</button>

          {/* Indicadores */}
          <div className="carousel-indicators">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`indicator ${currentSlideHero === i ? "active" : ""}`}
                onClick={() => setCurrentSlideHero(i)}
              ></div>
            ))}
          </div>
        </section>

        {/* ======================
            MAPA DE INFORMAÇÕES
        ======================= */}
<div className='informacoes'>
        <section className="welcome-section">
          <img src="https://cdn-icons-png.flaticon.com/512/102/102649.png" alt="segurança" />
          <div className='texto'>
          <h1>Compra segura</h1>
          <p>Seus dados protegidos</p>
          </div>
        </section>
   
    <section className="welcome-section">
       <img src="https://cdn-icons-png.flaticon.com/128/2758/2758243.png" alt="retirada" />
                <div className='texto'>
          <h1>Conheça nossa loja</h1>
          <p>Loja fisíca em São Paulo</p>
          </div>
         
        </section>
         
        <section className="welcome-section">
        <img src="https://cdn-icons-png.flaticon.com/128/3037/3037255.png" alt="cartão" />
                    <div className='texto'>
          <h1>Em até 6x sem juros</h1>
          <p>Consulte as condições</p>
          </div>
         
        </section>
   
    <section className="welcome-section">
       <img src="https://cdn-icons-png.flaticon.com/128/411/411763.png" alt="entrega gratis" />
                <div className='texto'>
          <h1>Entrega</h1>
          <p>Para todo o Brasil</p>
          </div>
         
        </section>
        </div>

        {/* ======================
            CARROSSEL DE PRODUTOS
        ======================= */}
        <section className="produtos-carrossel">
          <h3 className="sobre-title" id="cardapio">Mais vendidos</h3>

          <div className="produtos-carrossel-container">

            {/* Botão voltar */}
            <button className="prod-arrow left" onClick={prevProdutos}>❮</button>

            {/* Track */}
            <div
              className="produtos-track"
              style={{
                transform: `translateX(-${
                  currentSlideProdutos * (100 / cardsPerView)
                }%)`
              }}
            >
{[...products].reverse().map((p) => (
                <div key={p.id} className="prod-slide">
                  <ProductCard product={p} 
                          adicionarProduto={adicionarAoCarrinho}/>
                </div>
              ))}
            </div>

            {/* Botão avançar */}
            <button className="prod-arrow right" onClick={nextProdutos}>❯</button>
          </div>

          {/* Indicadores */}
          <div className="prod-indicators">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <span
                key={index}
                className={`dot ${
                  currentSlideProdutos === index ? "active" : ""
                }`}
                onClick={() => goToSlideProdutos(index)}
              ></span>
            ))}
          </div>
        </section>

        {/* ======================
            SEÇÃO CARDÁPIO
        ======================= */}
        <section className="cardapio-section">


    <section className="menu-section" id="cardapio">
      <h3 className="sobre-title ">Conheça um pouco do nosso cardápio</h3>
<div className="products-wrapper-home">
  {products.length > 0 ? (
    produtosAleatorios.map((p) => (
      <ProductCard
        key={p.id}
        product={p}
        adicionarProduto={adicionarAoCarrinho}
      />
    ))
  ) : (
    <p className="no-products">Nenhum produto cadastrado ainda 😺</p>
  )}
</div>





      
<Link to="/search" className="btn">
  Ver todo o cardápio
</Link>
        </section>

        <section className="sobre">
  <div className="sobre-overlay"></div>

  <div className="sobre-container">
        <div className="sobre-right" data-animate="fade-left">
      <img 
        src={sobre} 
        className="sobre-img" 
        alt="Sobre a confeitaria"
      />
    </div>
    <div className="sobre-left" data-animate="fade-right">
      <h3 className="sobre-title">Desde 2025 encantando paladares</h3>

      <p>
        Nossa confeitaria nasceu do amor pela culinária e pelo desejo de criar 
        momentos especiais através de doces memoráveis. Com uma equipe apaixonada 
        e dedicada, buscamos sempre inovar enquanto mantemos a tradição das 
        receitas clássicas.
      </p>

      <p>
        Todos os nossos produtos são feitos artesanalmente, sem conservantes ou 
        ingredientes artificiais. Valorizamos pequenos produtores e buscamos sempre 
        os melhores ingredientes para garantir sabor e qualidade excepcionais.
      </p>

      <p>
        Nosso espaço foi cuidadosamente projetado para oferecer uma experiência 
        aconchegante e encantadora — cada detalhe é pensado com carinho.
      </p>
    </div>

  </div>
</section>

        

<div className="categorias">
  
  <Link to="/bolos" className="categoria-card">
    <img src={bolinhos} alt="Bolos" />
    <span className="categoria-texto">Bolos</span>
  </Link>
  <Link to="/doces" className="categoria-card">
    <img src={doces} alt="Doces" />
    <span className="categoria-texto">Doces</span>
  </Link>
<div>
    <h3 className="title-categorias">Produtos de todos os tipos</h3>
    <p>Explore nossas categorias e se surpreenda com a nossa variedade.</p>
</div>
  <Link to="/salgados" className="categoria-card">
    <img src={salgados} alt="Salgados" />
    <span className="categoria-texto">Salgados</span>
  </Link>
  <Link to="/bebidas" className="categoria-card">
    <img src={bebidas} alt="Bolos" />
    <span className="categoria-texto">Bebidas</span>
  </Link>
</div>

        </section>



<section className="contact-container">
<div className="contact-left">
<h2 className="sobre-title">Fale conosco</h2>


<p className="contact-description">
Nossa confeitaria está de portas abertas para te receber com doces
frescos, feitos com técnica e carinho. Um espaço acolhedor para você
experimentar a leveza e a delicadeza dos nossos produtos em cada
detalhe.
</p>


<div className="contact-item">
<span className="icon">📞</span>
<p>(11) 91234-5678</p>
</div>


<div className="contact-item">
<span className="icon">📱</span>
<p>(11) 91234-5678</p>
</div>


<div className="contact-item">
<span className="icon">✉️</span>
<p>confeitaria3estacoes@gmail.com</p>
</div>
</div>


<div className="contact-right">
<iframe
title="Localização"
src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.172590649234!2d-46.77453482489203!3d-23.52629407882389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ceff1975d8d5b9%3A0x782ae1868af2ffb0!2sR.%20Ari%20Barroso%20-%20Pres.%20Altino%2C%20Osasco%20-%20SP%2C%2006216-240!5e0!3m2!1spt-BR!2sbr!4v1763686239257!5m2!1spt-BR!2sbr"
width="100%"
height="350"
style={{ border: 0, borderRadius: "14px" }}
allowFullScreen=""
loading="lazy"
referrerPolicy="no-referrer-when-downgrade"
/>
</div>
</section>

   
      </main>
     
    </div>
  );
};

export default ConfeitariaDoGatinho; 
