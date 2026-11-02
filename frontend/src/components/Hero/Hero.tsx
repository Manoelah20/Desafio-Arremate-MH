import React from 'react';
import type { AuctionCategory } from '../../types/auction';
import './Hero.css';

interface HeroProps {
  onExploreClick: () => void;
  onHowItWorksClick: () => void;
  onCategorySelect: (category: AuctionCategory) => void;
}

const CATEGORY_PREVIEWS: Array<{
  category: Exclude<AuctionCategory, 'Todos'>;
  image: string;
}> = [
  { category: 'Tecnologia', image: '/demo-lot-technology.jpg' },
  { category: 'Relógios', image: '/demo-lot-watch.jpg' },
  { category: 'Veículos', image: '/demo-lot-vehicle.jpg' },
  { category: 'Arte & Design', image: '/demo-lot-art.jpg' },
  { category: 'Colecionáveis', image: '/demo-lot-collectibles.jpg' },
];

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onHowItWorksClick,
  onCategorySelect,
}) => {
  return (
    <section className="hero-section" id="home">
      <div className="container hero-section__inner">
        {/* Glow de fundo */}
        <div className="hero-section__glow" aria-hidden="true"></div>

        {/* Tag de Apresentação */}
        <div className="hero-section__tag">
          <span className="hero-section__tag-icon">⚡</span>
          <span>Projeto demonstrativo &bull; Lances simulados</span>
        </div>

        {/* Título Principal de Impacto */}
        <h1 className="hero-section__title">
          Explore um protótipo de <br />
          <span className="hero-section__title-gradient">leilões online</span>
        </h1>

        {/* Subtítulo */}
        <p className="hero-section__subtitle">
          Conheça um modelo de projeto com cadastro, catálogo de lotes, lances, histórico e atualizações em tempo real. Fotos ilustram apenas categorias; dados e valores são demonstrativos, sem vendas nem pagamentos reais.
        </p>

        {/* Botões de Ação */}
        <div className="hero-section__actions">
          <button
            type="button"
            className="hero-section__btn-primary"
            onClick={onExploreClick}
          >
            <span>Explorar lotes demonstrativos</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            className="hero-section__btn-secondary"
            onClick={onHowItWorksClick}
          >
            Como funciona o protótipo
          </button>
        </div>

        <div className="hero-section__categories" aria-label="Categorias ilustrativas">
          <div className="hero-section__categories-heading">
            <strong>Categorias demonstrativas</strong>
            <span>Fotos ilustrativas; os lotes disponíveis aparecem abaixo.</span>
          </div>
          <div className="hero-section__category-list">
            {CATEGORY_PREVIEWS.map(({ category, image }) => (
              <button
                key={category}
                type="button"
                className="hero-section__category-card"
                onClick={() => onCategorySelect(category)}
                aria-label={`Ver lotes demonstrativos de ${category}`}
              >
                <img src={image} alt="" />
                <span>{category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
