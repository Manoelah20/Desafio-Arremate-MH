export type AuctionCategory =
  | 'Todos'
  | 'Tecnologia'
  | 'Relógios'
  | 'Veículos'
  | 'Arte & Design'
  | 'Colecionáveis';

export type AuctionStatus = 'live' | 'ending_soon' | 'upcoming' | 'ended';

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  category: AuctionCategory;
  currentBid: number;
  startingBid: number;
  totalBids: number;
  endsIn: string;
  status: AuctionStatus;
  imageUrl: string;
  condition: string;
  location: string;
  lotNumber: string;
  bidIncrement: number;
}
