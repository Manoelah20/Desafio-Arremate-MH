import React from 'react';
import type { AuctionItem } from '../../types/auction';
import { AuctionCard } from '../AuctionCard/AuctionCard';
import './AuctionGrid.css';

interface AuctionGridProps {
  auctions: AuctionItem[];
  onViewAuction: (item: AuctionItem) => void;
  onResetFilters: () => void;
}

export const AuctionGrid: React.FC<AuctionGridProps> = ({
  auctions,
  onViewAuction,
  onResetFilters
}) => {
  return (
    <section className="auction-grid-section" id="auctions">
      <div className="container">
        {/* Cabeçalho da Seção */}
        <div className="auction-grid__header">
          <div>
            <div className="auction-grid__tag">
              <span className="auction-grid__tag-dot"></span>
              <span>Lotes Selecionados</span>
            </div>
            <h2 className="auction-grid__title">Lotes de demonstração</h2>
          </div>
          <p className="auction-grid__desc">
            Explore os fluxos de lances fictícios e atualizações em tempo real. Nenhum lote representa uma oferta comercial.
          </p>
        </div>

        {/* Grade de Cards */}
        {auctions.length > 0 ? (
          <div className="auction-grid">
            {auctions.map((item) => (
              <AuctionCard
                key={item.id}
                item={item}
                onViewAuction={onViewAuction}
              />
            ))}
          </div>
        ) : (
          /* Estado Vazio quando a busca não retorna resultados */
          <div className="auction-grid__empty">
            <div className="auction-grid__empty-icon">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
                <path d="m9.5 9.5 3 3" />
                <path d="m12.5 9.5-3 3" />
              </svg>
            </div>
            <h3 className="auction-grid__empty-title">Nenhum lote demonstrativo encontrado</h3>
            <p className="auction-grid__empty-desc">
              Não encontramos nenhum lote correspondente aos filtros ou termo buscado. Tente buscar por outra palavra-chave ou categoria.
            </p>
            <button
              type="button"
              className="auction-grid__empty-btn"
              onClick={onResetFilters}
            >
              Limpar Filtros e Ver Todos
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
