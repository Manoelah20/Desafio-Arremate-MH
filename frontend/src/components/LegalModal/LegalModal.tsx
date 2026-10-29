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
              Conformidade Jurídica & LGPD
            </span>
            <span className="legal-modal__version">Versão 2026.1 &bull; Atualizado</span>
          </div>
          <h3 className="legal-modal__title" id="legal-modal-title">
            Documentação Jurídica &bull; Arremate MH
          </h3>
          <p className="legal-modal__subtitle">
            Regulamento oficial, diretrizes de privacidade e termos da casa de leilões online.
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
            📜 Termos de Uso
          </button>
          <button
            type="button"
            className={`legal-modal__tab ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
            id="tab-privacy-btn"
          >
            🔒 Privacidade & LGPD
          </button>
          <button
            type="button"
            className={`legal-modal__tab ${activeTab === 'edital' ? 'active' : ''}`}
            onClick={() => setActiveTab('edital')}
            id="tab-edital-btn"
          >
            ⚖️ Edital de Leilões
          </button>
        </div>

        {/* Conteúdo Dinâmico por Aba */}
        <div className="legal-modal__body">
          {activeTab === 'terms' && (
            <>
              <div className="legal-modal__highlight-box">
                Ao participar de qualquer leilão promovido pela <strong>Arremate MH</strong>, o arrematante declara ter capacidade civil plena e aceitar integralmente as cláusulas estipuladas a seguir.
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">1</span>
                  Aceite dos Termos e Habilitação
                </h4>
                <p className="legal-modal__section-text">
                  Para ofertar lances na plataforma Arremate MH, é mandatório que o usuário seja pessoa física maior de 18 (dezoito) anos ou pessoa jurídica regularmente constituída, com CPF/CNPJ válido perante a Receita Federal do Brasil. O cadastro passa por análise cadastral preventiva contra fraudes.
                </p>
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">2</span>
                  Natureza Vinculante e Irretratável dos Lances
                </h4>
                <p className="legal-modal__section-text">
                  Todo lance ofertado na plataforma é irrevogável, irretratável e de responsabilidade exclusiva do arrematante autenticado. Uma vez registrado no livro eletrônico do leiloeiro, o lance não poderá ser cancelado ou reduzido sob nenhuma circunstância.
                </p>
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">3</span>
                  Comissão do Leiloeiro e Encargos
                </h4>
                <p className="legal-modal__section-text">
                  Sobre o valor da arrematação (martelo) incidirá comissão legal de 5% (cinco por cento) devida ao Leiloeiro Oficial, acrescida de taxas administrativas de emissão de termo descritas na página de cada lote. O pagamento total deverá ocorrer em até 48 (quarenta e oito) horas úteis após a homologação do pregão.
                </p>
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">4</span>
                  Inadimplência e Bloqueio
                </h4>
                <p className="legal-modal__section-text">
                  O não pagamento do valor do arremate e comissão no prazo fixado ensejará o cancelamento da venda, perda de 20% do valor ofertado a título de penalidade civil, além de inscrição nos órgãos de proteção ao crédito (SPC/Serasa) e suspensão permanente na plataforma.
                </p>
              </div>
            </>
          )}

          {activeTab === 'privacy' && (
            <>
              <div className="legal-modal__highlight-box">
                A <strong>Arremate MH</strong> trata a segurança e a confidencialidade das suas informações com rigor extremo, em estrita conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD)</strong>.
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">1</span>
                  Dados Pessoais Coletados
                </h4>
                <p className="legal-modal__section-text">
                  Coletamos apenas os dados indispensáveis para o cumprimento das obrigações legais de leilão público: nome completo, CPF/CNPJ, endereço residencial/comercial, telefone, e-mail e dados bancários para estorno ou comprovação de faturamento.
                </p>
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">2</span>
                  Finalidade do Tratamento
                </h4>
                <p className="legal-modal__section-text">
                  Os dados são utilizados exclusivamente para:
                  validação da identidade do licitante, auditoria dos lances em tempo real, emissão do auto de arrematação oficial e nota de venda do leiloeiro, e prevenção contra crimes financeiros (Lei nº 9.613/1998).
                </p>
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">3</span>
                  Criptografia e Armazenamento Seguro
                </h4>
                <p className="legal-modal__section-text">
                  Todas as comunicações entre seu navegador e nossos servidores são protegidas por criptografia de ponta a ponta com certificados TLS 1.3 / SSL de 256 bits. Informações sensíveis de pagamento não ficam salvas em texto puro.
                </p>
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">4</span>
                  Seus Direitos como Titular (DPO)
                </h4>
                <p className="legal-modal__section-text">
                  Você pode requerer confirmação de tratamento, correção de dados incompletos ou eliminação de informações excedentes através do nosso canal de Encarregado de Proteção de Dados: <strong>privacidade@arrematemh.com.br</strong>.
                </p>
              </div>
            </>
          )}

          {activeTab === 'edital' && (
            <>
              <div className="legal-modal__highlight-box">
                Edital Regulamentar de Pregão Eletrônico da <strong>Arremate MH Leilões</strong>. Vendas em caráter irrevogável, realizadas na forma do Decreto Federal nº 21.981/1932 e Código de Processo Civil.
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">1</span>
                  Condição dos Lotes: Venda "No Estado"
                </h4>
                <p className="legal-modal__section-text">
                  Todos os bens são leiloados no estado de conservação em que se encontram (<em>ad corpus</em>). Fotos, descritivos e laudos técnicos são informativos. É assegurado aos interessados o direito de vistoria prévia dos lotes mediante agendamento formal até 24 horas antes do encerramento do pregão.
                </p>
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">2</span>
                  Prorrogação Automática (Sistema Anti-Sniping)
                </h4>
                <p className="legal-modal__section-text">
                  Caso qualquer lance seja ofertado nos últimos 60 (sessenta) segundos antes do término programado de um lote, o cronômetro do leilão será automaticamente acrescido em mais 60 segundos, garantindo tempo hábil de disputa leal entre todos os participantes.
                </p>
              </div>

              <div className="legal-modal__section">
                <h4 className="legal-modal__section-title">
                  <span className="legal-modal__section-num">3</span>
                  Retirada e Transporte
                </h4>
                <p className="legal-modal__section-text">
                  As despesas com desmontagem, carregamento, frete, seguro e transferência documental perante órgãos de trânsito ou cartórios correm por conta exclusiva do arrematante, devendo ser concluídas no prazo máximo de 10 (dez) dias corridos após a compensação do pagamento.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="legal-modal__footer">
          <span className="legal-modal__footer-info">
            Ao navegar e licitar na Arremate MH, você concorda com estes termos.
          </span>
          <button
            type="button"
            className="legal-modal__ack-btn"
            onClick={onClose}
            id="btn-close-legal-modal"
          >
            ✓ Ciente e De Acordo
          </button>
        </div>
      </div>
    </div>
  );
};
