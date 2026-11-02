import { useState, useMemo, useCallback, useEffect } from 'react';
import { io } from 'socket.io-client';
import { supabase } from './supabase';
import type { AuctionCategory, AuctionItem } from './types/auction';
import {
  clearSavedToken,
  fetchCurrentUser,
  fetchLotDetails,
  fetchLots,
  getSocketUrl,
  getSavedToken,
  isUnauthorizedError,
  placeBid,
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
    const refreshLot = (event: unknown) => {
      if (!event || typeof event !== 'object' || !('lot_id' in event) || event.lot_id !== lotId) return;
      void Promise.all([fetchLots(), fetchLotDetails(lotId)])
        .then(([latestLots, latestBids]) => {
          setAuctions(latestLots);
          const latestLot = latestLots.find((lot) => lot.id === lotId);
          if (latestLot) setSelectedAuction(latestLot);
          setSelectedBids(latestBids);
        })
        .catch((error: unknown) => console.error('[realtime/refresh]', error));
    };

    let cleanupRealtime = () => {};
    if (supabase) {
      const channel = supabase.channel(`lot:${lotId}`, { config: { private: false } });
      channel
        .on('broadcast', { event: 'new_bid' }, ({ payload }) => {
          refreshLot(payload);
        })
        .on('broadcast', { event: 'lot_closed' }, ({ payload }) => {
          refreshLot(payload);
        })
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.error(`[realtime] Inscrição do lote ${lotId} falhou: ${status}`);
          }
        });
      cleanupRealtime = () => { void supabase.removeChannel(channel); };
    } else {
      const socket = io(getSocketUrl());
      socket.emit('join_lot', lotId);
      socket.on('new_bid', refreshLot);
      socket.on('lot_closed', refreshLot);
      cleanupRealtime = () => {
        socket.emit('leave_lot', lotId);
        socket.disconnect();
      };
    }

    const refreshTimer = window.setInterval(() => refreshLot({ lot_id: lotId }), 20_000);

    return () => {
      window.clearInterval(refreshTimer);
      cleanupRealtime();
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
    setSelectedAuction((current) => current?.id === lotId
      ? { ...current, currentBid: amount, totalBids: current.totalBids + 1 }
      : current);

    const [lotsResult, bidsResult, userResult] = await Promise.allSettled([
      fetchLots(),
      fetchLotDetails(lotId),
      fetchCurrentUser(),
    ]);
    const refreshErrors: string[] = [];

    if (lotsResult.status === 'fulfilled') {
      setAuctions(lotsResult.value);
      const updatedLot = lotsResult.value.find((lot) => lot.id === lotId);
      if (updatedLot) setSelectedAuction(updatedLot);
    } else {
      refreshErrors.push('a lista de lotes');
    }

    if (bidsResult.status === 'fulfilled') {
      setSelectedBids(bidsResult.value);
    } else {
      refreshErrors.push('o histórico de lances');
    }

    if (userResult.status === 'fulfilled') {
      setUser(userResult.value);
    } else {
      refreshErrors.push('o saldo da conta');
    }

    setApiError(refreshErrors.length
      ? `Lance registrado, mas não foi possível atualizar ${refreshErrors.join(', ')}.`
      : null);
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
      <aside className="app__demo-notice" role="note" aria-label="Aviso sobre o ambiente de demonstração">
        <div className="app__demo-notice-content">
          <strong>Protótipo para demonstração e testes</strong>
          <span>
            Lotes, valores, saldos e lances são demonstrativos; as fotos apenas
            ilustram categorias e não correspondem aos itens. Não há produtos à
            venda, pagamentos, entregas ou vínculo com terceiros.
          </span>
        </div>
      </aside>

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
        onCategorySelect={(category) => {
          setSelectedCategory(category);
          handleNavigateSection('search-section');
        }}
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

      {/* Informações do protótipo (regras, dados e lotes demonstrativos) */}
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
