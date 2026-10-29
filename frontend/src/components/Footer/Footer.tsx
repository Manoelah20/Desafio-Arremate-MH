import React from 'react';
import './Footer.css';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenLegal?: (tab: 'terms' | 'privacy' | 'edital') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onOpenLegal }) => {
  return (
    <footer className="footer" id="about">
      <div className="container footer__container">
        {/* Coluna Principal da Marca Arremate MH */}
        <div className="footer__brand-col">
          <div className="footer__logo">
            <div className="footer__logo-badge">
              <svg
                className="footer__logo-svg"
                width="38"
                height="38"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="44" height="44" rx="10" fill="url(#mh-f-bg)" stroke="url(#mh-f-border)" strokeWidth="1.5" />
                
                {/* Martelo Estilizado Dourado */}
                <path d="M12 24L19 17" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M17 15L23 9L27 13L21 19L17 15Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M28 8L32 12" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />

                {/* Monograma MH estilizado */}
                <text
                  x="22"
                  y="36"
                  fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                  fontWeight="900"
                  fontSize="13"
                  fill="url(#mh-f-gold)"
                  textAnchor="middle"
                  letterSpacing="1.2"
                >
                  MH
                </text>

                <defs>
                  <linearGradient id="mh-f-bg" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1e183a" />
                    <stop stopColor="#0d0c18" offset="100%" />
                  </linearGradient>
                  <linearGradient id="mh-f-border" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#a855f7" />
                    <stop stopColor="#fbbf24" offset="100%" />
                  </linearGradient>
                  <linearGradient id="mh-f-gold" x1="10" y1="26" x2="34" y2="38" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fef08a" />
                    <stop stopColor="#fbbf24" offset="60%" />
                    <stop stopColor="#f59e0b" offset="100%" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="footer__logo-text-group">
              <span className="footer__logo-title">
                ARREMATE <span className="footer__logo-mh">MH</span>
              </span>
              <span className="footer__logo-subtitle">LEILÕES OFICIAIS</span>
            </div>
          </div>

          <p className="footer__brand-desc">
            Casa de leilões online especializada na mediação transparente e segura de produtos de alto valor, tecnologia de ponta, raridades e colecionáveis.
          </p>

          <div className="footer__security-badges">
            <span className="footer__badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Ambiente 100% Auditado
            </span>
            <span className="footer__badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Criptografia SSL
            </span>
          </div>
        </div>

        {/* Links Rápidos */}
        <div className="footer__col">
          <h4 className="footer__col-title">Navegação</h4>
          <ul className="footer__nav-list">
            <li>
              <button
                type="button"
                className="footer__link"
                onClick={() => onNavigateSection('home')}
              >
                Início
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer__link"
                onClick={() => onNavigateSection('auctions')}
              >
                Leilões em Destaque
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer__link"
                onClick={() => onNavigateSection('categories')}
              >
                Categorias
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer__link"
                onClick={() => onNavigateSection('how-it-works')}
              >
                Regras & Como Funciona
              </button>
            </li>
          </ul>
        </div>

        {/* Categorias Principais */}
        <div className="footer__col">
          <h4 className="footer__col-title">Principais Lotes</h4>
          <ul className="footer__nav-list">
            <li><span className="footer__text-muted">Tecnologia & Hardware</span></li>
            <li><span className="footer__text-muted">Relógios de Precisão</span></li>
            <li><span className="footer__text-muted">Veículos & Clássicos</span></li>
            <li><span className="footer__text-muted">Obras de Arte & Design</span></li>
            <li><span className="footer__text-muted">Itens Colecionáveis</span></li>
          </ul>
        </div>

        {/* Informações do Desafio */}
        <div className="footer__col">
          <h4 className="footer__col-title">Desafio Arremate MH</h4>
          <p className="footer__info-text">
            Casa de leilões com cadastro, lotes publicados por leiloeiro e lances em tempo real.
          </p>
          <div className="footer__tag-etapa">
            React · Node.js · PostgreSQL
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copyright">
            &copy; {new Date().getFullYear()} Arremate MH &bull; Casa de Leilões Online. Todos os direitos reservados.
          </p>
          <div className="footer__bottom-links">
            <button
              type="button"
              className="footer__bottom-btn"
              onClick={() => onOpenLegal?.('terms')}
              id="footer-btn-terms"
            >
              Termos de Uso
            </button>
            <span className="footer__dot-separator">&bull;</span>
            <button
              type="button"
              className="footer__bottom-btn"
              onClick={() => onOpenLegal?.('privacy')}
              id="footer-btn-privacy"
            >
              Privacidade
            </button>
            <span className="footer__dot-separator">&bull;</span>
            <button
              type="button"
              className="footer__bottom-btn"
              onClick={() => onOpenLegal?.('edital')}
              id="footer-btn-edital"
            >
              Edital de Leilões
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
