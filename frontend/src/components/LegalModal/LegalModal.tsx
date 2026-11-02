import React, { useEffect, useState } from 'react';
import './LegalModal.css';

export type LegalTab = 'terms' | 'privacy' | 'edital';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: LegalTab;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'terms',
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  // Fechar com tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="legal-modal__backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div
        className="legal-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="legal-modal__close-btn"
          onClick={onClose}
          aria-label="Fechar janela"
        >
          ✕
        </button>

        {/* Cabeçalho */}
        <div className="legal-modal__header">
          <div className="legal-modal__badge-row">
            <span className="legal-modal__badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Protótipo acadêmico
            </span>
            <span className="legal-modal__version">Sem validade jurídica</span>
          </div>
          <h3 className="legal-modal__title" id="legal-modal-title">
            Informações do protótipo
          </h3>
          <p className="legal-modal__subtitle">
            Estas informações descrevem uma demonstração de software. Não são termos de uso, edital ou política de privacidade de uma operação comercial.
          </p>
        </div>

        {/* Abas */}
        <div className="legal-modal__tabs">
          <button
            type="button"
            className={`legal-modal__tab ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => setActiveTab('terms')}
            id="tab-terms-btn"
          >
            📜 Regras demonstrativas
          </button>
          <button
            type="button"
            className={`legal-modal__tab ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
            id="tab-privacy-btn"
          >
            🔒 Dados e privacidade
          </button>
          <button
            type="button"
            className={`legal-modal__tab ${activeTab === 'edital' ? 'active' : ''}`}
            onClick={() => setActiveTab('edital')}
            id="tab-edital-btn"
          >
            ⚖️ Sobre os lotes
          </button>
        </div>

        {/* Conteúdo Dinâmico por Aba */}
        <div className="legal-modal__body">
          {activeTab === 'terms' && (
            <>
              <div className="legal-modal__highlight-box">
                O Arremate MH é um protótipo acadêmico. Os fluxos de cadastro e lance existem para demonstração e não criam oferta, venda ou obrigação de pagamento.
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">1</span>
                  Cadastro de teste
                </h4>
                <p className="legal-modal__section-text">
                  Use apenas dados fictícios ou informações que você esteja confortável em utilizar em um ambiente de demonstração. O cadastro não verifica CPF, CNPJ, identidade ou capacidade civil.
                </p>
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">2</span>
                  Lances simulados
                </h4>
                <p className="legal-modal__section-text">
                  Os lances são validados e registrados para demonstrar as regras do sistema. Eles não são vinculantes, não representam uma compra e não podem ser convertidos em uma transação real.
                </p>
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">3</span>
                  Sem cobranças
                </h4>
                <p className="legal-modal__section-text">
                  Não há comissão, taxa, depósito de dinheiro real, processamento de pagamento, entrega de produtos ou penalidade por participar do protótipo.
                </p>
              </div>
            </>
          )}

          {activeTab === 'privacy' && (
            <>
              <div className="legal-modal__highlight-box">
                Esta aplicação de demonstração processa dados de conta para viabilizar os testes. Não envie documentos, dados bancários, senhas reutilizadas ou outras informações sensíveis.
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">1</span>
                  Dados usados no teste
                </h4>
                <p className="legal-modal__section-text">
                  O cadastro solicita nome, e-mail e senha. A API armazena a senha como hash; dados de conta, saldos demonstrativos e lances podem ser persistidos no banco configurado para o ambiente.
                </p>
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">2</span>
                  Sessão no navegador
                </h4>
                <p className="legal-modal__section-text">
                  Após o login, um token de sessão é mantido no armazenamento local do navegador para autenticar as chamadas da API. Encerre a sessão e limpe os dados do navegador em dispositivos compartilhados.
                </p>
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">3</span>
                  Ambiente demonstrativo
                </h4>
                <p className="legal-modal__section-text">
                  O banco utilizado depende da configuração local ou publicada do projeto. Esta demonstração não oferece canal de atendimento de privacidade nem garante retenção, exclusão ou disponibilidade de dados.
                </p>
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">4</span>
                  Não use dados reais
                </h4>
                <p className="legal-modal__section-text">
                  Como não é um serviço operacional, não há encarregado de dados ou canal de suporte associado a esta interface. Para testes, prefira uma conta com dados fictícios e uma senha exclusiva. Não há vínculo, patrocínio ou endosso de marcas, autores, editoras ou serviços citados nos metadados de terceiros.
                </p>
              </div>
            </>
          )}

          {activeTab === 'edital' && (
            <>
              <div className="legal-modal__highlight-box">
                Os lotes e as descrições desta página são ilustrativos. Este protótipo não anuncia bens para venda e não substitui edital ou avaliação de um leilão real.
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">1</span>
                  Descrições ilustrativas
                </h4>
                <p className="legal-modal__section-text">
                  A ilustração, os títulos genéricos, valores e históricos de lances são dados de teste. Não comprovam a existência, autenticidade, propriedade ou estado de conservação de qualquer produto.
                </p>
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">2</span>
                  Regras de encerramento
                </h4>
                <p className="legal-modal__section-text">
                  O sistema implementa regras de início, encerramento e prorrogação para testar o fluxo de lances. O resultado não produz arrematação nem obrigação fora deste ambiente de demonstração.
                </p>
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">3</span>
                  Sem entrega ou pagamento
                </h4>
                <p className="legal-modal__section-text">
                  Não há retirada, transporte, seguro, transferência de propriedade, certificado de autenticidade ou compensação financeira relacionada aos lotes.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="legal-modal__footer">
          <span className="legal-modal__footer-info">
            Protótipo de teste: sem produtos, venda ou pagamento real.
          </span>
          <button
            type="button"
            className="legal-modal__ack-btn"
            onClick={onClose}
            id="btn-close-legal-modal"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};
