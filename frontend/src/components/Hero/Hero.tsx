import React from 'react';
import './Hero.css';

interface HeroProps {
  onExploreClick: () => void;
  onHowItWorksClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onHowItWorksClick }) => {
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
          Explore uma plataforma de <br />
          <span className="hero-section__title-gradient">leilões online</span>
        </h1>

        {/* Subtítulo */}
        <p className="hero-section__subtitle">
          Conheça um protótipo acadêmico com cadastro, catálogo de lotes, lances, histórico e atualizações em tempo real. Valores e dados são ilustrativos; não há vendas nem pagamentos reais.
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

        {/* Recursos demonstrados pelo projeto */}
        <div className="hero-section__stats">
          <div className="hero-section__stat-item">
            <span className="hero-section__stat-value">Projeto</span>
            <span className="hero-section__stat-label">acadêmico demonstrativo</span>
          </div>
          <div className="hero-section__stat-separator"></div>
          <div className="hero-section__stat-item">
            <span className="hero-section__stat-value">Lances</span>
            <span className="hero-section__stat-label">registrados para teste</span>
          </div>
          <div className="hero-section__stat-separator"></div>
          <div className="hero-section__stat-item">
            <span className="hero-section__stat-value">Tempo real</span>
            <span className="hero-section__stat-label">atualizações de lotes</span>
          </div>
          <div className="hero-section__stat-separator"></div>
          <div className="hero-section__stat-item">
            <span className="hero-section__stat-value">Sem</span>
            <span className="hero-section__stat-label">transações financeiras</span>
          </div>
        </div>
      </div>
    </section>
  );
};
