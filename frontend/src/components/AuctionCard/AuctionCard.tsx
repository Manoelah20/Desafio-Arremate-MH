import React, { useState } from 'react';
import type { AuctionItem } from '../../types/auction';
import './AuctionCard.css';

interface AuctionCardProps {
  item: AuctionItem;
  onViewAuction: (item: AuctionItem) => void;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ item, onViewAuction }) => {
  const [imageError, setImageError] = useState(false);

  const formattedBid = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(item.currentBid);

  const getStatusBadge = () => {
    switch (item.status) {
      case 'ending_soon':
        return (
          <span className="auction-card__badge auction-card__badge--ending">
            <span className="auction-card__badge-pulse"></span>
            Encerra em breve
          </span>
        );
      case 'upcoming':
        return (
          <span className="auction-card__badge auction-card__badge--upcoming">
            Em Breve
          </span>
        );
      case 'ended':
        return (
          <span className="auction-card__badge auction-card__badge--upcoming">
            Encerrado
          </span>
        );
      case 'live':
      default:
        return (
          <span className="auction-card__badge auction-card__badge--live">
            <span className="auction-card__badge-pulse"></span>
            Ao Vivo
          </span>
        );
    }
  };

  return (
    <article className="auction-card">
      {/* Imagem e Badges */}
      <div className="auction-card__media">
        {getStatusBadge()}
        <span className="auction-card__lot-number">{item.lotNumber}</span>

        {!imageError ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="auction-card__image"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="auction-card__image-fallback">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <span>{item.category}</span>
          </div>
        )}

        <div className="auction-card__overlay"></div>
      </div>

      {/* Conteúdo do Card */}
      <div className="auction-card__content">
        <div className="auction-card__meta-top">
          <span className="auction-card__category">{item.category}</span>
          <span className="auction-card__timer">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {item.endsIn}
          </span>
        </div>

        <h3 className="auction-card__title" title={item.title}>
          {item.title}
        </h3>

        <p className="auction-card__condition">{item.condition}</p>

        {/* Divisor */}
        <div className="auction-card__divider"></div>

        {/* Informações de Lance */}
        <div className="auction-card__bid-container">
          <div className="auction-card__bid-group">
            <span className="auction-card__bid-label">Lance Atual</span>
            <span className="auction-card__bid-value">{formattedBid}</span>
          </div>
          <div className="auction-card__bids-count">
            <span>{item.totalBids} lances</span>
          </div>
        </div>

        {/* Botão de Ação */}
        <button
          type="button"
          className="auction-card__btn"
          onClick={() => onViewAuction(item)}
          id={`btn-view-${item.id}`}
        >
          <span>Ver leilão</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </article>
  );
};
