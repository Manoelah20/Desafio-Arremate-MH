import type {
  AuctionCategory,
  AuctionItem,
  AuctionStatus,
} from './types/auction';

const DEFAULT_API_URL = import.meta.env.DEV
  ? 'http://localhost:3001'
  : 'https://desafio-arremate-mh-u8eb.vercel.app';
const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, '');

const TOKEN_KEY = 'arremate.auth.token';

interface ApiError {
  error?: string;
}

class ApiRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'leiloeiro' | 'licitante';
  balance: number | string;
  available_balance?: number;
}

export interface ApiBid {
  id: string;
  amount: number;
  bidder_name: string;
  created_at: string;
}

export interface ApiLot {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  external_data: {
    author?: string;
    cover_url?: string;
    year?: number;
    subjects?: string[];
    demo?: boolean;
    demo_key?: string;
    source?: string;
  } | null;
  initial_bid: number;
  min_increment: number;
  current_bid: number;
  status: 'agendado' | 'ao_vivo' | 'encerrado' | 'cancelado';
  starts_at: string;
  ends_at: string;
  total_bids?: number;
  winner_name?: string | null;
}

export interface ExternalBook {
  key: string;
  title: string;
  author: string;
  cover_url: string | null;
  year?: number;
  subjects: string[];
  source: string;
  demo?: boolean;
}

export interface CreateLotInput {
  title: string;
  description: string;
  image_url: string | null;
  external_data: ExternalBook;
  initial_bid: number;
  min_increment: number;
  starts_at: string;
  ends_at: string;
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...authHeaders(),
        ...(options.body
          ? { 'Content-Type': 'application/json' }
          : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      'Não foi possível conectar à API. Verifique se o backend está em execução.',
    );
  }

  const payload = (await response.json().catch(() => ({}))) as ApiError;

  if (!response.ok) {
    throw new ApiRequestError(
      payload.error || `A API respondeu com erro (${response.status}).`,
      response.status,
    );
  }

  return payload as T;
}

function categoryFromLot(lot: ApiLot): AuctionCategory {
  const searchable = `${lot.title} ${
    lot.external_data?.subjects?.join(' ') || ''
  }`.toLowerCase();

  if (/rel[oó]gio|watch/.test(searchable)) return 'Relógios';
  if (/carro|ve[ií]culo|autom[oó]vel/.test(searchable)) return 'Veículos';
  if (/arte|pintura|design/.test(searchable)) return 'Arte & Design';
  if (/computador|tecnologia/.test(searchable)) return 'Tecnologia';

  return 'Colecionáveis';
}

export function remainingTime(endsAt: string): string {
  const remaining = Math.max(
    0,
    new Date(endsAt).getTime() - Date.now(),
  );

  const totalMinutes = Math.floor(remaining / 60_000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days) return `${days}d ${hours}h`;
  if (hours) return `${hours}h ${minutes}m`;

  return `${minutes}m`;
}

export function mapLot(lot: ApiLot): AuctionItem {
  const category = categoryFromLot(lot);
  let status: AuctionStatus;

  if (lot.status === 'encerrado' || lot.status === 'cancelado') {
    status = 'ended';
  } else if (lot.status === 'agendado') {
    status = 'upcoming';
  } else {
    const minutesRemaining =
      (new Date(lot.ends_at).getTime() - Date.now()) / 60_000;

    status = minutesRemaining <= 30 ? 'ending_soon' : 'live';
  }

  return {
    id: lot.id,
    lotNumber: `LOTE-${lot.id.slice(0, 8).toUpperCase()}`,
    title: `Lote demonstrativo — ${category}`,
    description: 'Item e informações fictícios, incluídos apenas para testar a aplicação. Não representam produto disponível para venda.',
    category,
    currentBid: Number(lot.current_bid),
    startingBid: Number(lot.initial_bid),
    totalBids: Number(lot.total_bids || 0),
    endsIn: remainingTime(
      lot.status === 'agendado' ? lot.starts_at : lot.ends_at,
    ),
    status,
    imageUrl: '/demo-lot.svg',
    condition: 'Item ilustrativo; sem verificação',
    location: 'Ambiente de teste',
    bidIncrement: Number(lot.min_increment),
  };
}

export function getSavedToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiRequestError && error.status === 401;
}

export function clearSavedToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function fetchLots(): Promise<AuctionItem[]> {
  const { lots } = await request<{ lots: ApiLot[] }>('/api/lots');
  return lots.map(mapLot);
}

export async function fetchLotDetails(id: string): Promise<ApiBid[]> {
  const { bids } = await request<{
    lot: ApiLot;
    bids: ApiBid[];
  }>(`/api/lots/${encodeURIComponent(id)}`);

  return bids;
}

export async function searchExternalBooks(
  query: string,
): Promise<ExternalBook[]> {
  const params = new URLSearchParams({ q: query });

  const { results } = await request<{ results: ExternalBook[] }>(
    `/api/lots/search/external?${params}`,
  );

  return results;
}

export async function fetchAuctioneerLots(): Promise<ApiLot[]> {
  const { lots } = await request<{ lots: ApiLot[] }>(
    '/api/lots/auctioneer/my',
  );

  return lots;
}

export async function createLot(
  input: CreateLotInput,
): Promise<void> {
  await request('/api/lots', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function cancelLot(lotId: string): Promise<void> {
  await request(`/api/lots/${encodeURIComponent(lotId)}`, {
    method: 'DELETE',
  });
}

export async function authenticate(
  mode: 'login' | 'register',
  values: {
    name?: string;
    email: string;
    password: string;
  },
): Promise<AuthUser> {
  const { token, user } = await request<{
    token: string;
    user: AuthUser;
  }>(`/api/auth/${mode}`, {
    method: 'POST',
    body: JSON.stringify(values),
  });

  localStorage.setItem(TOKEN_KEY, token);

  return user;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const { user } = await request<{ user: AuthUser }>(
    '/api/auth/me',
  );

  return user;
}

export async function placeBid(
  lotId: string,
  amount: number,
): Promise<void> {
  await request('/api/bids', {
    method: 'POST',
    body: JSON.stringify({
      lot_id: lotId,
      amount,
    }),
  });
}

export function getSocketUrl(): string {
  return API_URL;
}
