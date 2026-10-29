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
          <span>Casa Oficial de Leilões Online &bull; Lotes Verificados</span>
        </div>

        {/* Título Principal de Impacto */}
        <h1 className="hero-section__title">
          Grandes Oportunidades em <br />
          <span className="hero-section__title-gradient">Leilões Exclusivos</span>
        </h1>

        {/* Subtítulo */}
        <p className="hero-section__subtitle">
          Arremate itens raros, tecnologia de ponta, relógios de luxo e colecionáveis com total transparência, segurança jurídica e lances auditados.
        </p>

        {/* Botões de Ação */}
        <div className="hero-section__actions">
          <button
            type="button"
            className="hero-section__btn-primary"
            onClick={onExploreClick}
          >
            <span>Explorar Lotes em Destaque</span>
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
            Como Funciona o Arremate
          </button>
        </div>

        {/* Estatísticas / Prova Social */}
        <div className="hero-section__stats">
          <div className="hero-section__stat-item">
            <span className="hero-section__stat-value">R$ 14M+</span>
            <span className="hero-section__stat-label">Arrematados em 2026</span>
          </div>
          <div className="hero-section__stat-separator"></div>
          <div className="hero-section__stat-item">
            <span className="hero-section__stat-value">1.250+</span>
            <span className="hero-section__stat-label">Lotes Auditados</span>
          </div>
          <div className="hero-section__stat-separator"></div>
          <div className="hero-section__stat-item">
            <span className="hero-section__stat-value">99.8%</span>
            <span className="hero-section__stat-label">Satisfação dos Usuários</span>
          </div>
          <div className="hero-section__stat-separator"></div>
          <div className="hero-section__stat-item">
            <span className="hero-section__stat-value">100%</span>
            <span className="hero-section__stat-label">Ambiente Seguro</span>
          </div>
        </div>
      </div>
    </section>
  );
};
