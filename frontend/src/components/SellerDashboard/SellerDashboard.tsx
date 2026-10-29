import { useEffect, useState, type FormEvent } from 'react';
import {
  cancelLot,
  createLot,
  fetchAuctioneerLots,
  searchExternalBooks,
  type ApiLot,
  type ExternalBook,
} from '../../api';
import './SellerDashboard.css';

interface SellerDashboardProps {
  onClose: () => void;
  onCreated: () => void;
}

function localDateTime(value: Date): string {
  const adjusted = new Date(value.getTime() - value.getTimezoneOffset() * 60_000);
  return adjusted.toISOString().slice(0, 16);
}

function currency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export const SellerDashboard = ({ onClose, onCreated }: SellerDashboardProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ExternalBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<ExternalBook | null>(null);
  const [lots, setLots] = useState<ApiLot[]>([]);
  const [initialBid, setInitialBid] = useState('100');
  const [increment, setIncrement] = useState('10');
  const [startsAt, setStartsAt] = useState(() => localDateTime(new Date(Date.now() + 60_000)));
  const [endsAt, setEndsAt] = useState(() => localDateTime(new Date(Date.now() + 86_460_000)));
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const refreshLots = async () => {
    try {
      setLots(await fetchAuctioneerLots());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Não foi possível carregar seus lotes.');
    }
  };

  useEffect(() => {
    void fetchAuctioneerLots()
      .then(setLots)
      .catch((requestError: unknown) => setError(
        requestError instanceof Error ? requestError.message : 'Não foi possível carregar seus lotes.',
      ));
  }, []);

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    setError(null);
    setMessage(null);
    setIsSearching(true);
    try {
      setResults(await searchExternalBooks(query.trim()));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'A busca externa falhou.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedBook) {
      setError('Busque e selecione um item da Open Library primeiro.');
      return;
    }
    setError(null);
    setMessage(null);
    setIsSaving(true);
    try {
      await createLot({
        title: selectedBook.title,
        description: `${selectedBook.author}${selectedBook.year ? ` · Publicado em ${selectedBook.year}` : ''}${selectedBook.subjects.length ? ` · ${selectedBook.subjects.join(', ')}` : ''}`,
        image_url: selectedBook.cover_url,
        external_data: selectedBook,
        initial_bid: Number(initialBid),
        min_increment: Number(increment),
        starts_at: new Date(startsAt).toISOString(),
        ends_at: new Date(endsAt).toISOString(),
      });
      setSelectedBook(null);
      setMessage('Lote publicado com sucesso.');
      await refreshLots();
      onCreated();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Não foi possível publicar o lote.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async (lot: ApiLot) => {
    if (!window.confirm(`Cancelar o lote "${lot.title}"? Esta ação não pode ser desfeita.`)) return;
    setError(null);
    try {
      await cancelLot(lot.id);
      await refreshLots();
      onCreated();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Não foi possível cancelar o lote.');
    }
  };

  return (
    <div className="seller-dashboard__backdrop" role="dialog" aria-modal="true" aria-labelledby="seller-dashboard-title" onClick={onClose}>
      <section className="seller-dashboard" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="seller-dashboard__close" onClick={onClose} aria-label="Fechar painel">×</button>
        <header className="seller-dashboard__header">
          <span>PAINEL DO LEILOEIRO</span>
          <h2 id="seller-dashboard-title">Gerenciar lotes</h2>
          <p>Busque itens na Open Library, configure o leilão e acompanhe seus lotes.</p>
        </header>

        {error && <p className="seller-dashboard__message seller-dashboard__message--error" role="alert">{error}</p>}
        {message && <p className="seller-dashboard__message" role="status">{message}</p>}

        <form className="seller-dashboard__search" onSubmit={handleSearch}>
          <label htmlFor="book-search">Buscar item na Open Library</label>
          <div>
            <input id="book-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Título ou autor" required />
            <button type="submit" disabled={isSearching}>{isSearching ? 'Buscando...' : 'Buscar'}</button>
          </div>
        </form>

        {results.length > 0 && (
          <div className="seller-dashboard__results" aria-label="Resultados da busca">
            {results.map((book) => (
              <button
                type="button"
                key={book.key}
                className={`seller-dashboard__book ${selectedBook?.key === book.key ? 'seller-dashboard__book--selected' : ''}`}
                onClick={() => setSelectedBook(book)}
              >
                {book.cover_url && <img src={book.cover_url} alt="" loading="lazy" />}
                <span><strong>{book.title}</strong><small>{book.author}{book.year ? ` · ${book.year}` : ''}</small></span>
              </button>
            ))}
          </div>
        )}

        {selectedBook && (
          <form className="seller-dashboard__lot-form" onSubmit={handleCreate}>
            <h3>Novo lote: {selectedBook.title}</h3>
            <div className="seller-dashboard__fields">
              <label>Lance inicial (R$)<input type="number" min="0.01" step="0.01" value={initialBid} onChange={(event) => setInitialBid(event.target.value)} required /></label>
              <label>Incremento (R$)<input type="number" min="0.01" step="0.01" value={increment} onChange={(event) => setIncrement(event.target.value)} required /></label>
              <label>Início<input type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} required /></label>
              <label>Encerramento<input type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} required /></label>
            </div>
            <button type="submit" disabled={isSaving}>{isSaving ? 'Publicando...' : 'Publicar lote'}</button>
          </form>
        )}

        <section className="seller-dashboard__lots">
          <h3>Seus lotes ({lots.length})</h3>
          {lots.length === 0 ? <p>Você ainda não publicou lotes.</p> : lots.map((lot) => (
            <article key={lot.id} className="seller-dashboard__lot">
              <div>
                <strong>{lot.title}</strong>
                <span>{lot.status.replace('_', ' ')} · {Number(lot.total_bids || 0)} lances · {currency(Number(lot.current_bid))}</span>
              </div>
              {lot.status !== 'encerrado' && lot.status !== 'cancelado' && Number(lot.total_bids || 0) === 0 && (
                <button type="button" onClick={() => { void handleCancel(lot); }}>Cancelar</button>
              )}
            </article>
          ))}
        </section>
      </section>
    </div>
  );
};
