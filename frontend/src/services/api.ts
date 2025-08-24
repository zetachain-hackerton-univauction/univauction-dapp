/**
 * API service functions for interacting with the backend
 * These will be intercepted by MSW in development
 */

export interface IdeaData {
  id: string;
  title: string;
  author: string;
  category: string;
  currentBid: number; // ETH
  reservePrice: number; // ETH
  imageUrl: string;
  summary: string;
  problem: string;
  solution: string;
  market: string;
  moat: string;
  tags: string[];
  timeLeft: string;
  bidCount: number;
  views: number;
  reviewScore: number;
  endTime: Date;
  isActive: boolean;
  status: string;
  auctionEnded: boolean;
  proofHash: string;
}

export interface BidData {
  amount: number; // ETH
  token: string;
  walletAddress: string;
  timestamp: string;
}

// API functions
export const api = {
  // Get all ideas
  async getIdeas(): Promise<{ ideas: IdeaData[] }> {
    const response = await fetch('/api/ideas');
    return response.json();
  },

  // Get specific idea
  async getIdea(id: string): Promise<IdeaData> {
    const response = await fetch(`/api/ideas/${id}`);
    return response.json();
  },

  // Place bid
  async placeBid(ideaId: string, amount: number, token: string): Promise<{ success: boolean; bidId: string }> {
    const response = await fetch(`/api/ideas/${ideaId}/bid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, token }),
    });
    return response.json();
  },

  // Create new idea
  async createIdea(ideaData: Partial<IdeaData>): Promise<{ success: boolean; ideaId: string }> {
    const response = await fetch('/api/ideas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ideaData),
    });
    return response.json();
  },

  // Get user's ideas
  async getUserIdeas(): Promise<{ ideas: IdeaData[] }> {
    const response = await fetch('/api/user/ideas');
    return response.json();
  },

  // Get user's bids
  async getUserBids(): Promise<{ bids: BidData[] }> {
    const response = await fetch('/api/user/bids');
    return response.json();
  },
};