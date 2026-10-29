import { useState, useMemo, useCallback, useEffect } from 'react';
import { io } from 'socket.io-client';
import type { AuctionCategory, AuctionItem } from './types/auction';
import {
  clearSavedToken,
  fetchCurrentUser,
  fetchLotDetails,
  fetchLots,
  getSavedToken,
  getSocketUrl,
  isUnauthorizedError,
  placeBid,
  remainingTime,
  type ApiBid,
  type AuthUser,
} from './api';
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { SearchBar, type SortOption } from './components/SearchBar/SearchBar';
import { AuctionGrid } from './components/AuctionGrid/AuctionGrid';
import { HowItWorks } from './components/HowItWorks/HowItWorks';
import { Footer } from './components/Footer/Footer';
import { AuctionModal } from './components/AuctionModal/AuctionModal';
import { AuthModal } from './components/AuthModal/AuthModal';
import { SellerDashboard } from './components/SellerDashboard/SellerDashboard';
import { LegalModal, type LegalTab } from './components/LegalModal/LegalModal';
import './App.css';

function App() {
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AuctionCategory>('Todos');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [selectedAuction, setSelectedAuction] = useState<AuctionItem | null>(null);
  const [selectedBids, setSelectedBids] = useState<ApiBid[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSellerDashboardOpen, setIsSellerDashboardOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab | null>(null);

  const refreshAuctions = useCallback(async () => {
    try {
      setAuctions(await fetchLots());
      setApiError(null);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Não foi possível carregar os leilões.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLots()
      .then(setAuctions)
      .catch((error: unknown) => setApiError(
        error instanceof Error ? error.message : 'Não foi possível carregar os leilões.',
      ))
      .finally(() => setIsLoading(false));
    const refreshTimer = window.setInterval(() => { void refreshAuctions(); }, 20_000);
    return () => window.clearInterval(refreshTimer);
  }, [refreshAuctions]);

  useEffect(() => {
    if (!getSavedToken()) return;
    fetchCurrentUser()
      .then(setUser)
      .catch((error: unknown) => {
        if (isUnauthorizedError(error)) {
          clearSavedToken();
          setUser(null);
          setApiError('Sua sessão expirou. Entre novamente para participar dos leilões.');
        }
      });
  }, []);

  useEffect(() => {
    const lotId = selectedAuction?.id;
    if (!lotId) return;
    const socket = io(getSocketUrl());
    socket.emit('join_lot', lotId);
    socket.on('new_bid', (event: {
      lot_id: string;
      current_bid: number;
      ends_at: string;
      bid: ApiBid;
    }) => {
      if (event.lot_id !== lotId) return;
      const applyBid = (item: AuctionItem): AuctionItem => ({
        ...item,
        currentBid: event.current_bid,
        totalBids: item.totalBids + 1,
        endsIn: remainingTime(event.ends_at),
      });
      setAuctions((current) => current.map((item) => item.id === lotId ? applyBid(item) : item));
      setSelectedAuction((current) => current?.id === lotId ? applyBid(current) : current);
      setSelectedBids((current) => [...current, event.bid]);
    });
    socket.on('lot_closed', (event: { lot_id: string }) => {
      if (event.lot_id !== lotId) return;
      setAuctions((current) => current.map((item) => item.id === lotId ? { ...item, status: 'ended' } : item));
      setSelectedAuction((current) => current?.id === lotId ? { ...current, status: 'ended' } : current);
    });
    return () => {
      socket.emit('leave_lot', lotId);
      socket.disconnect();
    };
  }, [selectedAuction?.id]);

  // Filtragem e ordenação dos leilões
  const filteredAuctions = useMemo(() => {
    let result = [...auctions];

    // Filtro por Categoria
    if (selectedCategory !== 'Todos') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Filtro por Termo de Busca
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          item.lotNumber.toLowerCase().includes(term) ||
          item.location.toLowerCase().includes(term)
      );
    }

    // Ordenação
    switch (sortBy) {
      case 'bid-high':
        result.sort((a, b) => b.currentBid - a.currentBid);
        break;
      case 'bid-low':
        result.sort((a, b) => a.currentBid - b.currentBid);
        break;
      case 'ending-soon':
        result.sort((a, b) => {
          if (a.status === 'ending_soon' && b.status !== 'ending_soon') return -1;
          if (b.status === 'ending_soon' && a.status !== 'ending_soon') return 1;
          return a.endsIn.localeCompare(b.endsIn);
        });
        break;
      case 'recent':
      default:
        // Mantém a ordem original dos dados
        break;
    }

    return result;
  }, [auctions, selectedCategory, searchTerm, sortBy]);

  // Navegação suave entre seções
  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Resetar todos os filtros
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todos');
    setSortBy('recent');
  };

  const handleViewAuction = async (item: AuctionItem) => {
    setSelectedAuction(item);
    setSelectedBids([]);
    try {
      setSelectedBids(await fetchLotDetails(item.id));
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Não foi possível carregar os lances.');
    }
  };

  const handlePlaceBid = async (lotId: string, amount: number) => {
    await placeBid(lotId, amount);
    void refreshAuctions();
    void fetchLotDetails(lotId).then(setSelectedBids).catch((error: unknown) => {
      setApiError(error instanceof Error ? error.message : 'Lance registrado, mas não foi possível atualizar o histórico.');
    });
    void fetchCurrentUser().then(setUser).catch((error: unknown) => {
      setApiError(error instanceof Error ? error.message : 'Lance registrado, mas não foi possível atualizar o saldo.');
    });
  };

  const handleLogout = () => {
    clearSavedToken();
    setUser(null);
  };

  const handleAuthenticated = (authenticatedUser: AuthUser) => {
    setUser(authenticatedUser);
    void fetchCurrentUser().then(setUser).catch((error: unknown) => {
      setApiError(error instanceof Error ? error.message : 'Não foi possível carregar seu saldo.');
    });
  };

  return (
    <div className="app">
      {/* Cabeçalho */}
      <Header
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onNavigateSection={handleNavigateSection}
        userName={user?.name || null}
        userRole={user?.role}
        availableBalance={user?.available_balance}
        committedBalance={user?.balance !== undefined && user.available_balance !== undefined
          ? Number(user.balance) - Number(user.available_balance)
          : undefined}
        onLogout={handleLogout}
        onOpenSellerDashboard={() => setIsSellerDashboardOpen(true)}
      />
      {(apiError || isLoading) && (
        <div className={`app__status ${apiError ? 'app__status--error' : ''}`} role="status">
          {apiError || 'Conectando aos leilões...'}
          {apiError && <button type="button" onClick={() => { setIsLoading(true); void refreshAuctions(); }}>Tentar novamente</button>}
        </div>
      )}

      {/* Seção Hero de Apresentação */}
      <Hero
        onExploreClick={() => handleNavigateSection('search-section')}
        onHowItWorksClick={() => handleNavigateSection('how-it-works')}
      />

      {/* Campo de Busca e Filtros */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalResults={filteredAuctions.length}
      />

      {/* Grade de Leilões em Destaque */}
      <AuctionGrid
        auctions={filteredAuctions}
        onViewAuction={(item) => { void handleViewAuction(item); }}
        onResetFilters={handleResetFilters}
      />

      {/* Seção Como Funciona */}
      <HowItWorks />

      {/* Rodapé Oficial */}
      <Footer
        onNavigateSection={handleNavigateSection}
        onOpenLegal={(tab) => setLegalModalTab(tab)}
      />

      {/* Modal de Detalhes do Leilão */}
      <AuctionModal
        item={selectedAuction}
        bids={selectedBids}
        user={user}
        onClose={() => setSelectedAuction(null)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onPlaceBid={handlePlaceBid}
      />

      {/* Modal de Autenticação / Entrar */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={handleAuthenticated}
      />

      {isSellerDashboardOpen && (
        <SellerDashboard
          onClose={() => setIsSellerDashboardOpen(false)}
          onCreated={() => { void refreshAuctions(); }}
        />
      )}

      {/* Modal de Informações Legais (Termos, Privacidade e Edital) */}
      <LegalModal
        key={legalModalTab}
        isOpen={legalModalTab !== null}
        initialTab={legalModalTab || 'terms'}
        onClose={() => setLegalModalTab(null)}
      />
    </div>
  );
}

export default App;
