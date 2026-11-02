import React from 'react';
import './HowItWorks.css';

export const HowItWorks: React.FC = () => {
  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="container">
        <div className="how-it-works__header">
          <div className="how-it-works__tag">
            <span>Fluxo demonstrativo</span>
          </div>
          <h2 className="how-it-works__title">Como funciona a demonstração</h2>
          <p className="how-it-works__subtitle">
            Explore os principais fluxos da aplicação. Os lotes e valores são fictícios e não existe pagamento real.
          </p>
        </div>

        <div className="how-it-works__cards">
          {/* Passo 1 */}
          <div className="how-it-works__card">
            <div className="how-it-works__step-num">01</div>
            <div className="how-it-works__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <h3 className="how-it-works__card-title">Explore os lotes</h3>
            <p className="how-it-works__card-text">
              Filtre o catálogo por categoria ou busca e consulte as descrições e o histórico demonstrativo de cada item.
            </p>
          </div>

          {/* Passo 2 */}
          <div className="how-it-works__card">
            <div className="how-it-works__step-num">02</div>
            <div className="how-it-works__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m14 12-8.5 8.5a2.12 2.12 0 1 1-3-3L11 9" />
                <path d="M15 13 9 7l4-4 6 6-4 4Z" />
                <path d="m21 15-4-4" />
              </svg>
            </div>
            <h3 className="how-it-works__card-title">Teste os lances</h3>
            <p className="how-it-works__card-text">
              A API valida o incremento mínimo e a janela de lances. O catálogo e o histórico são atualizados durante a disputa simulada.
            </p>
          </div>

          {/* Passo 3 */}
          <div className="how-it-works__card">
            <div className="how-it-works__step-num">03</div>
            <div className="how-it-works__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h3 className="how-it-works__card-title">Consulte o resultado</h3>
            <p className="how-it-works__card-text">
              O sistema registra o encerramento e o resultado de teste. Não há venda, cobrança, entrega de produtos ou certificado de autenticidade.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
