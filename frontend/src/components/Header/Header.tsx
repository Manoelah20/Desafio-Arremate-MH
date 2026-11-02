import React, { useState } from 'react';
import './Header.css';

interface HeaderProps {
  onOpenAuth: () => void;
  onNavigateSection: (sectionId: string) => void;
  userName?: string | null;
  userRole?: 'leiloeiro' | 'licitante';
  availableBalance?: number;
  committedBalance?: number;
  onLogout?: () => void;
  onOpenSellerDashboard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  onNavigateSection,
  userName,
  userRole,
  availableBalance,
  committedBalance = 0,
  onLogout,
  onOpenSellerDashboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onNavigateSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container header__content">
        {/* Logotipo Textual com Monograma MH e Martelo Estilizado */}
        <a
          href="#home"
          className="header__logo"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
        >
          <div className="header__logo-badge">
            <svg
              className="header__logo-svg"
              width="38"
              height="38"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="44" height="44" rx="10" fill="url(#mh-bg)" stroke="url(#mh-border)" strokeWidth="1.5" />
              
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
                fill="url(#mh-gold)"
                textAnchor="middle"
                letterSpacing="1.2"
              >
                MH
              </text>

              <defs>
                <linearGradient id="mh-bg" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1e183a" />
                  <stop stopColor="#0d0c18" offset="100%" />
                </linearGradient>
                <linearGradient id="mh-border" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a855f7" />
                  <stop stopColor="#fbbf24" offset="100%" />
                </linearGradient>
                <linearGradient id="mh-gold" x1="10" y1="26" x2="34" y2="38" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#fef08a" />
                  <stop stopColor="#fbbf24" offset="60%" />
                  <stop stopColor="#f59e0b" offset="100%" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="header__logo-text-group">
            <span className="header__logo-title">
              ARREMATE <span className="header__logo-mh">MH</span>
            </span>
            <span className="header__logo-subtitle">PROJETO DEMONSTRATIVO</span>
          </div>
        </a>

        {/* Navegação Desktop */}
        <nav className="header__nav" aria-label="Navegação Principal">
          <button
            type="button"
            className="header__nav-link"
            onClick={() => handleNavClick('auctions')}
          >
            Lotes
          </button>
          <button
            type="button"
            className="header__nav-link"
            onClick={() => handleNavClick('categories')}
          >
            Categorias
          </button>
          <button
            type="button"
            className="header__nav-link"
            onClick={() => handleNavClick('how-it-works')}
          >
            Como Funciona
          </button>
          <button
            type="button"
            className="header__nav-link"
            onClick={() => handleNavClick('about')}
          >
            Sobre o Projeto
          </button>
        </nav>

        {/* Ações (Entrar / Registro) */}
        <div className="header__actions">
          {userRole === 'licitante' && typeof availableBalance === 'number' && (
            <span className="header__balance">
              Disponível {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(availableBalance)}
              <small>Comprometido {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(committedBalance)}</small>
            </span>
          )}
          {userRole === 'leiloeiro' && (
            <button type="button" className="header__login-btn" onClick={onOpenSellerDashboard}>
              Painel
            </button>
          )}
          <div className="header__status-badge">
            <span className="header__status-pulse"></span>
            <span className="header__status-text">Demo</span>
          </div>
          <button
            type="button"
            className="header__login-btn"
            onClick={userName ? onLogout : onOpenAuth}
            id="btn-login-header"
            title={userName ? `Sair de ${userName}` : 'Entrar na demonstração'}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>{userName ? 'Sair' : 'Entrar'}</span>
          </button>

          {/* Botão Hambúrguer Mobile */}
          <button
            type="button"
            className={`header__mobile-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menu de navegação"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="header__mobile-menu">
          <div className="container header__mobile-menu-inner">
            {userRole === 'licitante' && typeof availableBalance === 'number' && (
              <p className="header__mobile-balance">
                Saldo disponível: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(availableBalance)}
                <small>Comprometido: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(committedBalance)}</small>
              </p>
            )}
            <button
              type="button"
              className="header__mobile-link"
              onClick={() => handleNavClick('auctions')}
            >
              Lotes
            </button>
            <button
              type="button"
              className="header__mobile-link"
              onClick={() => handleNavClick('categories')}
            >
              Categorias
            </button>
            <button
              type="button"
              className="header__mobile-link"
              onClick={() => handleNavClick('how-it-works')}
            >
              Como Funciona
            </button>
            <button
              type="button"
              className="header__mobile-link"
              onClick={() => handleNavClick('about')}
            >
              Sobre o Projeto
            </button>
            <div className="header__mobile-divider"></div>
            {userRole === 'leiloeiro' && (
              <button
                type="button"
                className="header__mobile-link"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSellerDashboard?.();
                }}
              >
                Painel do Leiloeiro
              </button>
            )}
            <button
              type="button"
              className="header__login-btn header__login-btn--mobile"
              onClick={() => {
                setMobileMenuOpen(false);
                if (userName) onLogout?.();
                else onOpenAuth();
              }}
            >
              {userName ? `Sair (${userName})` : 'Entrar na demonstração'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
