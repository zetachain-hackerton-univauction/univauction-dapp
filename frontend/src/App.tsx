import React, { useState } from 'react';
import { GlobalNavigation } from './components/GlobalNavigation';
import { LandingPage } from './components/LandingPage';
import { ExplorePage } from './components/ExplorePage';
import { MyPage } from './components/MyPage';
import { ListIdeaPage } from './components/ListIdeaPage';
import { IdeaDetailPage } from './components/IdeaDetailPage';
import { BiddingPage } from './components/BiddingPage';
import { Step3WinnerDepositPage } from './components/Step3WinnerDepositPage';
import { Step4NFTIssuancePage } from './components/Step4NFTIssuancePage';
import { Toaster } from './components/ui/sonner';

export type Page = 'landing' | 'explore' | 'my-page' | 'list-idea' | 'idea-detail' | 'bidding' | 'step3-winner-deposit' | 'step4-nft-issuance';

export interface Idea {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  imageUrl: string;
  reservePrice: number;
  currentBid: number;
  timeLeft: string;
  author: string;
  reviewScore: number;
  problem: string;
  solution: string;
  market: string;
  moat: string;
  proofHash: string;
  isActive: boolean;
  auctionEnded: boolean;
  views: number;
  status: 'Active' | 'Ended' | 'Won' | 'Lost';
  bidCount: number;
  endTime: Date;
}

export interface UserBid {
  ideaId: string;
  amount: number;
  timestamp: Date;
  status: 'Active' | 'Outbid' | 'Won' | 'Lost';
}

export interface AppState {
  currentPage: Page;
  selectedIdeaId: string | null;
  searchQuery: string;
  selectedCategory: string;
  selectedFilter: string;
  userBids: UserBid[];
  userIdeas: string[];
  walletConnected: boolean;
}

// Mock data
const mockIdeas: Idea[] = [
  {
    id: '1',
    title: 'AI-Powered Smart Home Assistant',
    summary: 'Revolutionary voice assistant that learns from user behavior and adapts to household routines.',
    category: 'AI & Machine Learning',
    tags: ['AI', 'IoT', 'Smart Home'],
    imageUrl: 'https://images.unsplash.com/photo-1729839206142-d03c98f921fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGhvbWUlMjB0ZWNobm9sb2d5JTIwQUklMjByb2JvdHxlbnwxfHx8fDE3NTU4NTMwODd8MA&ixlib=rb-4.1.0&q=80&w=400&h=300&fit=crop',
    reservePrice: 1000,
    currentBid: 1250,
    timeLeft: '2d 14h 32m',
    author: 'TechInnovator',
    reviewScore: 4.8,
    problem: 'Current smart home systems are fragmented and lack intelligence.',
    solution: 'Our AI assistant integrates all devices with learning capabilities.',
    market: 'Global smart home market projected to reach $537B by 2030.',
    moat: 'Proprietary learning algorithms with patent-pending technology.',
    proofHash: '0x7b8c9d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d',
    isActive: true,
    auctionEnded: false,
    views: 156,
    status: 'Active',
    bidCount: 8,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Sustainable Fashion Marketplace',
    summary: 'Platform connecting eco-conscious consumers with sustainable fashion brands.',
    category: 'E-commerce',
    tags: ['Fashion', 'Sustainability', 'E-commerce'],
    imageUrl: 'https://images.unsplash.com/photo-1586363129094-d7a38564fae1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZhc2hpb24lMjBlY28lMjBjbG90aGluZ3xlbnwxfHx8fDE3NTU3NTg5ODV8MA&ixlib=rb-4.1.0&q=80&w=400&h=300&fit=crop',
    reservePrice: 800,
    currentBid: 890,
    timeLeft: '5d 8h 12m',
    author: 'EcoFashion',
    reviewScore: 4.6,
    problem: 'Fast fashion dominates, lacking sustainable alternatives.',
    solution: 'Curated marketplace for verified sustainable fashion brands.',
    market: 'Sustainable fashion market growing at 15% CAGR.',
    moat: 'Exclusive partnerships with verified sustainable brands.',
    proofHash: '0x9e8f7a6b5c4d3e2f1a9b8c7d6e5f4a3b2c1d9e8f7a',
    isActive: true,
    auctionEnded: false,
    views: 89,
    status: 'Active',
    bidCount: 5,
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Blockchain Carbon Credits',
    summary: 'Transparent carbon credit trading platform using blockchain technology.',
    category: 'Blockchain',
    tags: ['Blockchain', 'Environment', 'FinTech'],
    imageUrl: 'https://images.unsplash.com/photo-1644343262170-e40d72e19a84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwbmV0d29yayUyMGNyeXB0b2N1cnJlbmN5fGVufDF8fHx8MTc1NTg1MzA4OHww&ixlib=rb-4.1.0&q=80&w=400&h=300&fit=crop',
    reservePrice: 2000,
    currentBid: 2100,
    timeLeft: '1d 3h 45m',
    author: 'GreenChain',
    reviewScore: 4.9,
    problem: 'Carbon credit markets lack transparency and verification.',
    solution: 'Blockchain-based platform ensuring transparent trading.',
    market: 'Carbon credit market expected to reach $100B by 2030.',
    moat: 'First-mover advantage in blockchain carbon credits.',
    proofHash: '0x5f4e3d2c1b0a9e8f7a6b5c4d3e2f1a9b8c7d6e5f4',
    isActive: true,
    auctionEnded: false,
    views: 234,
    status: 'Active',
    bidCount: 12,
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    title: 'Mental Health AI Companion',
    summary: 'AI-driven mental wellness platform with personalized therapy recommendations.',
    category: 'Healthcare',
    tags: ['AI', 'Healthcare', 'Mental Health'],
    imageUrl: 'https://images.unsplash.com/photo-1630406866478-a2fca6070d25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50YWwlMjBoZWFsdGglMjBtZWRpdGF0aW9uJTIwdGhlcmFweXxlbnwxfHx8fDE3NTU4NTMwODh8MA&ixlib=rb-4.1.0&q=80&w=400&h=300&fit=crop',
    reservePrice: 1500,
    currentBid: 1680,
    timeLeft: '4d 6h 22m',
    author: 'WellnessAI',
    reviewScore: 4.7,
    problem: 'Mental health support is often inaccessible and expensive.',
    solution: 'AI companion providing 24/7 mental health support.',
    market: 'Mental health app market growing at 23% CAGR.',
    moat: 'Proprietary AI trained on licensed therapy protocols.',
    proofHash: '0x3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3',
    isActive: true,
    auctionEnded: false,
    views: 112,
    status: 'Active',
    bidCount: 7,
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    title: 'Decentralized Learning Platform',
    summary: 'Peer-to-peer education platform with tokenized learning rewards.',
    category: 'Education',
    tags: ['Education', 'Blockchain', 'DeFi'],
    imageUrl: 'https://images.unsplash.com/photo-1753613648191-4771cf76f034?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZyUyMGVkdWNhdGlvbiUyMGRpZ2l0YWx8ZW58MXx8fHwxNzU1ODUzMDg4fDA&ixlib=rb-4.1.0&q=80&w=400&h=300&fit=crop',
    reservePrice: 1200,
    currentBid: 0,
    timeLeft: 'Ended',
    author: 'EduChain',
    reviewScore: 4.5,
    problem: 'Traditional education is centralized and expensive.',
    solution: 'Decentralized platform where anyone can teach and learn.',
    market: 'Online education market projected to reach $350B by 2025.',
    moat: 'Token economics incentivizing quality content creation.',
    proofHash: '0x8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8',
    isActive: false,
    auctionEnded: true,
    views: 78,
    status: 'Ended',
    bidCount: 3,
    endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    currentPage: 'landing',
    selectedIdeaId: null,
    searchQuery: '',
    selectedCategory: 'all',
    selectedFilter: 'all',
    userBids: [
      { ideaId: '3', amount: 2000, timestamp: new Date(), status: 'Outbid' },
      { ideaId: '5', amount: 1200, timestamp: new Date(), status: 'Won' },
    ],
    userIdeas: ['1', '2'],
    walletConnected: false,
  });

  const navigateToPage = (page: Page, ideaId?: string, options?: { category?: string; filter?: string }) => {
    setAppState(prev => ({
      ...prev,
      currentPage: page,
      selectedIdeaId: ideaId || null,
      selectedCategory: options?.category || prev.selectedCategory,
      selectedFilter: options?.filter || prev.selectedFilter,
    }));
  };

  const updateAppState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  const connectWallet = () => {
    setAppState(prev => ({ ...prev, walletConnected: true }));
  };

  const addUserBid = (ideaId: string, amount: number) => {
    const newBid: UserBid = {
      ideaId,
      amount,
      timestamp: new Date(),
      status: 'Active',
    };
    setAppState(prev => ({
      ...prev,
      userBids: [...prev.userBids, newBid],
    }));
  };

  const addUserIdea = (ideaId: string) => {
    setAppState(prev => ({
      ...prev,
      userIdeas: [...prev.userIdeas, ideaId],
    }));
  };

  const renderCurrentPage = () => {
    const props = {
      onNavigate: navigateToPage,
      ideas: mockIdeas,
      appState,
      updateAppState,
      connectWallet,
      addUserBid,
      addUserIdea,
    };

    switch (appState.currentPage) {
      case 'landing':
        return <LandingPage {...props} />;
      case 'explore':
        return <ExplorePage {...props} />;
      case 'my-page':
        return <MyPage {...props} />;
      case 'list-idea':
        return <ListIdeaPage onNavigate={navigateToPage} addUserIdea={addUserIdea} />;
      case 'idea-detail':
        return <IdeaDetailPage {...props} />;
      case 'bidding':
        return <BiddingPage {...props} />;
      case 'step3-winner-deposit':
        return <Step3WinnerDepositPage {...props} />;
      case 'step4-nft-issuance':
        return <Step4NFTIssuancePage {...props} />;
      default:
        return <LandingPage {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GlobalNavigation 
        currentPage={appState.currentPage} 
        onNavigate={navigateToPage}
        walletConnected={appState.walletConnected}
        connectWallet={connectWallet}
      />
      <main>
        {renderCurrentPage()}
      </main>
      <Toaster />
    </div>
  );
}