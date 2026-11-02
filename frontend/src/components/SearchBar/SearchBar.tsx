import React from 'react';
import type { AuctionCategory } from '../../types/auction';
import './SearchBar.css';

export type SortOption = 'recent' | 'bid-high' | 'bid-low' | 'ending-soon';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: AuctionCategory;
  onCategoryChange: (category: AuctionCategory) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalResults: number;
}

const CATEGORIES: AuctionCategory[] = [
  'Todos',
  'Tecnologia',
  'Relógios',
  'Veículos',
  'Arte & Design',
  'Colecionáveis'
];

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  totalResults
}) => {
  return (
    <div className="search-bar" id="search-section">
      <div className="container search-bar__container">
        {/* Linha Principal de Busca e Ordenação */}
        <div className="search-bar__main">
          {/* Input de Busca */}
          <div className="search-bar__input-wrapper">
            <svg
              className="search-bar__icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              id="auction-search-input"
              className="search-bar__input"
              placeholder="Buscar categorias, lotes ou números..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="search-bar__clear-btn"
                onClick={() => onSearchChange('')}
                aria-label="Limpar busca"
              >
                ✕
              </button>
            )}
          </div>

          {/* Seletor de Ordenação */}
          <div className="search-bar__sort-wrapper">
            <label htmlFor="auction-sort" className="search-bar__sort-label">
              Ordenar por:
            </label>
            <select
              id="auction-sort"
              className="search-bar__select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
            >
              <option value="recent">Mais Recentes</option>
              <option value="bid-high">Maior Lance</option>
              <option value="bid-low">Menor Lance</option>
              <option value="ending-soon">Encerrando em Breve</option>
            </select>
          </div>
        </div>

        {/* Linha de Categorias e Contador */}
        <div className="search-bar__categories-row" id="categories">
          <div className="search-bar__chips" role="tablist" aria-label="Filtrar por Categoria">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`search-bar__chip ${isActive ? 'active' : ''}`}
                  onClick={() => onCategoryChange(category)}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="search-bar__count">
            <span>{totalResults} {totalResults === 1 ? 'leilão encontrado' : 'leilões encontrados'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
