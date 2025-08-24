/**
 * Static data service to replace API calls
 * Contains all mock data for the application
 */

import type { Idea, UserBid } from '../App';

// Static ideas data
export const staticIdeas: Idea[] = [
  {
    auctionEnded: false,
    author: "TechInnovator",
    bidCount: 8,
    category: "AI & Machine Learning",
    currentBid: 0.5,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1729839206142-d03c98f921fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGhvbWUlMjB0ZWNobm9sb2d5JTIwQUklMjByb2JvdHxlbnwxfHx8fDE3NTU4NTMwODd8MA&ixlib=rb-4.1.0&q=80&w=400&h=300&fit=crop",
    isActive: true,
    market: "Global smart home market projected to reach $537B by 2030.",
    moat: "Proprietary learning algorithms with patent-pending technology.",
    problem: "Current smart home systems are fragmented and lack intelligence.",
    proofHash: "0x7b8c9d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d",
    reservePrice: 0.4,
    reviewScore: 4.8,
    solution: "Our AI assistant integrates all devices with learning capabilities.",
    status: "Active",
    summary: "Revolutionary voice assistant that learns from user behavior and adapts to household routines.",
    tags: ["AI", "IoT", "Smart Home"],
    timeLeft: "2d 14h 32m",
    title: "AI-Powered Smart Home Assistant",
    views: 156,
  },
  {
    auctionEnded: false,
    author: "EcoFashion",
    bidCount: 5,
    category: "E-commerce",
    currentBid: 0.004,
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1586363129094-d7a38564fae1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZhc2hpb24lMjBlY28lMjBjbG90aGluZ3xlbnwxfHx8fDE3NTU3NTg5ODV8MA&ixlib=rb-4.1.0&q=80&w=400&h=300&fit=crop",
    isActive: true,
    market: "Sustainable fashion market growing at 15% CAGR.",
    moat: "Exclusive partnerships with verified sustainable brands.",
    problem: "Fast fashion dominates, lacking sustainable alternatives.",
    proofHash: "0x9e8f7a6b5c4d3e2f1a9b8c7d6e5f4a3b2c1d9e8f7a",
    reservePrice: 0.32,
    reviewScore: 4.6,
    solution: "Curated marketplace for verified sustainable fashion brands.",
    status: "Active",
    summary: "Platform connecting eco-conscious consumers with sustainable fashion brands.",
    tags: ["Fashion", "Sustainability", "E-commerce"],
    timeLeft: "5d 8h 12m",
    title: "Sustainable Fashion Marketplace",
    views: 89,
  },
  {
    auctionEnded: false,
    author: "GreenChain",
    bidCount: 12,
    category: "Blockchain",
    currentBid: 0.84,
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1644343262170-e40d72e19a84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwbmV0d29yayUyMGNyeXB0b2N1cnJlbmN5fGVufDF8fHx8MTc1NTg1MzA4OHww&ixlib=rb-4.1.0&q=80&w=400&h=300&fit=crop",
    isActive: true,
    market: "Carbon credit market expected to reach $100B by 2030.",
    moat: "First-mover advantage in blockchain carbon credits.",
    problem: "Carbon credit markets lack transparency and verification.",
    proofHash: "0x5f4e3d2c1b0a9e8f7a6b5c4d3e2f1a9b8c7d6e5f4",
    reservePrice: 0.8,
    reviewScore: 4.9,
    solution: "Blockchain-based platform ensuring transparent trading.",
    status: "Active",
    summary: "Transparent carbon credit trading platform using blockchain technology.",
    tags: ["Blockchain", "Environment", "FinTech"],
    timeLeft: "1d 3h 45m",
    title: "Blockchain Carbon Credits",
    views: 234,
  },
  {
    auctionEnded: false,
    author: "WellnessAI",
    bidCount: 7,
    category: "Healthcare",
    currentBid: 0.672,
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1630406866478-a2fca6070d25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtZW50YWwlMjBoZWFsdGglMjBtZWRpdGF0aW9uJTIwdGhlcmFweXxlbnwxfHx8fDE3NTU4NTMwODh8MA&ixlib=rb-4.1.0&q=80&w=400&h=300&fit=crop",
    isActive: true,
    market: "Mental health app market growing at 23% CAGR.",
    moat: "Proprietary AI trained on licensed therapy protocols.",
    problem: "Mental health support is often inaccessible and expensive.",
    proofHash: "0x3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3",
    reservePrice: 0.6,
    reviewScore: 4.7,
    solution: "AI companion providing 24/7 mental health support.",
    status: "Active",
    summary: "AI-driven mental wellness platform with personalized therapy recommendations.",
    tags: ["AI", "Healthcare", "Mental Health"],
    timeLeft: "4d 6h 22m",
    title: "Mental Health AI Companion",
    views: 112,
  },
  {
    auctionEnded: true,
    author: "EduChain",
    bidCount: 3,
    category: "Education",
    currentBid: 0,
    endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1753613648191-4771cf76f034?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZyUyMGVkdWNhdGlvbiUyMGRpZ2l0YWx8ZW58MXx8fHwxNzU1ODUzMDg4fDA&ixlib=rb-4.1.0&q=80&w=400&h=300&fit=crop",
    isActive: false,
    market: "Online education market projected to reach $350B by 2025.",
    moat: "Token economics incentivizing quality content creation.",
    problem: "Traditional education is centralized and expensive.",
    proofHash: "0x8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8",
    reservePrice: 0.48,
    reviewScore: 4.5,
    solution: "Decentralized platform where anyone can teach and learn.",
    status: "Ended",
    summary: "Peer-to-peer education platform with tokenized learning rewards.",
    tags: ["Education", "Blockchain", "DeFi"],
    timeLeft: "Ended",
    title: "Decentralized Learning Platform",
    views: 78,
  },
];

// Static user bids data
export const staticUserBids: UserBid[] = [
  { amount: 2000, ideaId: "3", status: "Outbid", timestamp: new Date() },
  { amount: 1200, ideaId: "5", status: "Won", timestamp: new Date() },
];

// Static user ideas data
export const staticUserIdeas: string[] = ["1", "2"];

// Static data service functions
export const staticDataService = {
  // Get all ideas
  getIdeas: async (): Promise<Idea[]> => {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    return [...staticIdeas];
  },

  // Get specific idea by ID
  getIdeaById: async (id: string): Promise<Idea | null> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return staticIdeas.find(idea => idea.id === id) || null;
  },

  // Place a bid on an idea
  placeBid: async (ideaId: string, amount: number): Promise<{ success: boolean; bidId?: string; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const idea = staticIdeas.find(i => i.id === ideaId);
    if (!idea) {
      return { success: false, error: 'Idea not found' };
    }

    if (amount <= idea.currentBid) {
      return { success: false, error: 'Bid must be higher than current bid' };
    }

    // Update the idea with new bid
    idea.currentBid = amount;
    idea.bidCount += 1;

    return { 
      success: true, 
      bidId: `bid_${Date.now()}` 
    };
  },

  // Create a new idea
  createIdea: async (ideaData: Partial<Idea>): Promise<{ success: boolean; ideaId?: string; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newIdea: Idea = {
      id: `idea_${Date.now()}`,
      author: "Current User",
      bidCount: 0,
      currentBid: 0,
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isActive: true,
      status: "Active",
      views: 0,
      auctionEnded: false,
      reviewScore: 0,
      timeLeft: "7d 0h 0m",
      ...ideaData,
    } as Idea;

    staticIdeas.push(newIdea);
    
    return { 
      success: true, 
      ideaId: newIdea.id 
    };
  },

  // Get user's ideas
  getUserIdeas: async (): Promise<Idea[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return staticIdeas.filter(idea => staticUserIdeas.includes(idea.id));
  },

  // Get user's bids
  getUserBids: async (): Promise<UserBid[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...staticUserBids];
  },
};