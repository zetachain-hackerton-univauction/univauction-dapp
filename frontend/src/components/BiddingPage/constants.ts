import type { BidEntry } from './types';

export const USER_BALANCE = 0.05; // User has $5000 available balance

export const MOCK_ACTIVE_BIDS: BidEntry[] = [
  {
    id: '1',
    walletAddress: '0x742d35...a3b9',
    token: 'ETH',
    amount: 0.004,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: '2',
    walletAddress: '0x8f9e21...c4d7',
    token: 'ETH',
    amount: 0.002,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: '3',
    walletAddress: '0x123abc...def9',
    token: 'ETH',
    amount: 0.0009,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
  }
];