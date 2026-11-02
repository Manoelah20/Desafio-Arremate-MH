import React, { useEffect, useState } from 'react';
import type { AuctionItem } from '../../types/auction';
import type { ApiBid, AuthUser } from '../../api';
import './AuctionModal.css';

interface AuctionModalProps {
  item: AuctionItem | null;
  bids: ApiBid[];
  user: AuthUser | null;
  onClose: () => void;
  onOpenAuth: () => void;
  onPlaceBid: (itemId: string, amount: number) => Promise<void>;
}

export const AuctionModal: React.FC<AuctionModalProps> = ({
  item,
  bids,
  user,
  onClose,
  onOpenAuth,
  onPlaceBid
}) => {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const formattedCurrentBid = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(item.currentBid);

  const formattedStartingBid = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(item.startingBid);

  const formattedIncrement = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(item.bidIncrement);

  const nextSuggestedBid = item.totalBids > 0
    ? item.currentBid + item.bidIncrement
    : item.startingBid;
  const formattedNextBid = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(nextSuggestedBid);

  const canBid = item.status === 'live' || item.status === 'ending_soon';
  const handleBidClick = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!canBid || user.role !== 'licitante') return;

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await onPlaceBid(item.id, nextSuggestedBid);
      setFeedbackMessage(`Seu lance de ${formattedNextBid} foi registrado.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível registrar o lance.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auction-modal__backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="auction-modal__content" onClick={(e) => e.stopPropagation()}>
        {/* Botão Fechar */}
        <button
          type="button"
          className="auction-modal__close-btn"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          ✕
        </button>

        <div className="auction-modal__grid">
          {/* Coluna da Imagem */}
          <div className="auction-modal__media">
            <img
              src={failedImageUrl === item.imageUrl ? item.imageFallbackUrl : item.imageUrl}
              alt={item.title}
              className="auction-modal__image"
              onError={() => setFailedImageUrl(item.imageUrl)}
            />
            <div className="auction-modal__media-footer">
              <span className="auction-modal__media-pill">{item.category}</span>
              <span className="auction-modal__media-pill">{item.location}</span>
              <span className="auction-modal__media-pill">{item.condition}</span>
            </div>
          </div>

          {/* Coluna de Detalhes */}
          <div className="auction-modal__details">
            <div className="auction-modal__header">
              <span className="auction-modal__lot">{item.lotNumber}</span>
              <span className="auction-modal__timer">
                <span className="auction-modal__timer-dot"></span>
                Teste termina em {item.endsIn}
              </span>
            </div>

            <h2 className="auction-modal__title">{item.title}</h2>
            <p className="auction-modal__description">{item.description}</p>

            {/* Caixa de Valores */}
            <div className="auction-modal__pricing-card">
              <div className="auction-modal__pricing-row">
                <div>
                  <span className="auction-modal__label">Lance de teste atual</span>
                  <div className="auction-modal__current-bid">{formattedCurrentBid}</div>
                </div>
                <div className="auction-modal__bids-badge">
                  {item.totalBids} lances demonstrativos
                </div>
              </div>

              <div className="auction-modal__pricing-meta">
                <span>Lance inicial de teste: <strong>{formattedStartingBid}</strong></span>
                <span>Incremento de teste: <strong>{formattedIncrement}</strong></span>
              </div>
            </div>

            <div className="auction-modal__history">
              <strong>Últimos lances de teste</strong>
              {bids.length ? (
                <ul>
                  {bids.slice(-5).reverse().map((bid) => (
                    <li key={bid.id}>
                      <span>Conta de teste</span>
                      <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bid.amount)}</strong>
                    </li>
                  ))}
                </ul>
              ) : <p>Ainda não há lances de teste neste lote.</p>}
            </div>

            {(feedbackMessage || errorMessage) && (
              <div className="auction-modal__feedback" role="alert">
                {errorMessage ? `⚠ ${errorMessage}` : `✓ ${feedbackMessage}`}
              </div>
            )}

            <div className="auction-modal__actions">
              <button
                type="button"
                className="auction-modal__bid-btn"
                onClick={handleBidClick}
                disabled={!canBid || (user !== null && user.role !== 'licitante') || isSubmitting}
              >
                {!canBid
                  ? item.status === 'upcoming' ? 'Teste ainda não começou' : 'Teste encerrado'
                  : user && user.role !== 'licitante'
                    ? 'Apenas contas de teste podem ofertar'
                    : isSubmitting
                      ? 'Registrando lance de teste...'
                      : `${user ? 'Fazer lance de teste' : 'Entrar para testar'} (${formattedNextBid})`}
              </button>
              <button
                type="button"
                className="auction-modal__cancel-btn"
                onClick={onClose}
              >
                Voltar aos lotes de teste
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
