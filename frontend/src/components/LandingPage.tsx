import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { IdeaTrendChart } from './IdeaTrendChart';
import { Lightbulb, TrendingUp, Users, DollarSign, Eye, Gavel, CheckCircle, Clock, Star, Trophy, ArrowRight, FileText, Shield, Zap, Globe } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Page, Idea, AppState } from '../App';

interface LandingPageProps {
  onNavigate: (page: Page, ideaId?: string, options?: { category?: string; filter?: string }) => void;
  ideas: Idea[];
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
  connectWallet: () => void;
  addUserBid: (ideaId: string, amount: number) => void;
  addUserIdea: (ideaId: string) => void;
}

export function LandingPage({ onNavigate, ideas, appState }: LandingPageProps) {
  const activeIdeas = ideas.filter(idea => idea.isActive);
  const endedAuctions = ideas.filter(idea => idea.auctionEnded);
  const totalVolume = ideas.reduce((sum, idea) => sum + idea.currentBid, 0);
  const totalViews = ideas.reduce((sum, idea) => sum + idea.views, 0);
  const totalUsers = 1247; // Mock data

  const topCategories = [
    { name: 'AI & Machine Learning', growth: '+28.33%', value: '$489,451', color: 'text-[#47cd89]' },
    { name: 'Blockchain', growth: '+15.28%', value: '$325,678', color: 'text-[#47cd89]' },
    { name: 'Healthcare', growth: '-10.89%', value: '$198,234', color: 'text-[#f59f9f]' },
    { name: 'E-commerce', growth: '+41.06%', value: '$156,890', color: 'text-[#47cd89]' },
  ];

  const trendingIdeas = [
    { name: 'Airtable', value: '$42,875.69', shares: '157K ideas', growth: '$4,890.78 (+15.97%)', icon: '🅰️' },
    { name: 'Canva', value: '$38,148.78', shares: '100K ideas', growth: '$3,789.15 (+14.35%)', icon: '🎨' },
    { name: 'Microsoft', value: '$31,258.70', shares: '50K ideas', growth: '$3,490.05 (+13.87%)', icon: '🏢' },
    { name: 'Figma', value: '$20,415.47', shares: '100K ideas', growth: '$3,050.18 (+13.05%)', icon: '🎯' },
    { name: 'Apple', value: '$18,789.17', shares: '40.1K ideas', growth: '$2,150.36 (+12.97%)', icon: '🍎' },
    { name: 'Spotify', value: '$16,478.69', shares: '15K ideas', growth: '$2,005.78 (+11.75%)', icon: '🎵' },
  ];

  // Get trending ideas (most bids)
  const mostTrendingIdeas = ideas
    .filter(idea => idea.isActive)
    .sort((a, b) => b.bidCount - a.bidCount)
    .slice(0, 6);

  // Get closing soon auctions
  const closingSoonIdeas = ideas
    .filter(idea => idea.isActive)
    .sort((a, b) => a.endTime.getTime() - b.endTime.getTime())
    .slice(0, 5);

  // Get top 5 ideas by current bid (leaderboard)
  const topIdeas = ideas
    .sort((a, b) => b.currentBid - a.currentBid)
    .slice(0, 5);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0e17 0%, #161d29 100%)' }}>
      {/* Background Grid Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 901">
          <defs>
            <pattern id="grid" width="113" height="113" patternUnits="userSpaceOnUse">
              <path d="M 113 0 L 0 0 0 113" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.6"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Geometric Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-[7%] top-[11%] w-6 h-6">
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path d="M12 0L12 24" stroke="url(#paint0_linear_orange)" />
            <path d="M24 12L0 12" stroke="url(#paint1_linear_orange)" />
            <defs>
              <linearGradient id="paint0_linear_orange" x1="12" y1="24" x2="12" y2="0">
                <stop stopColor="#C34124" stopOpacity="0" />
                <stop offset="0.50284" stopColor="#F99A85" />
                <stop offset="1" stopColor="#C34124" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="paint1_linear_orange" x1="0" y1="12" x2="24" y2="12">
                <stop stopColor="#C34124" stopOpacity="0" />
                <stop offset="0.50284" stopColor="#F99A85" />
                <stop offset="1" stopColor="#C34124" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="absolute right-[16%] top-[11%] w-6 h-6">
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path d="M12 0L12 24" stroke="url(#paint0_linear_white)" />
            <path d="M24 12L0 12" stroke="url(#paint1_linear_white)" />
            <defs>
              <linearGradient id="paint0_linear_white" x1="12" y1="24" x2="12" y2="0">
                <stop stopColor="white" stopOpacity="0" />
                <stop offset="0.50284" stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="paint1_linear_white" x1="0" y1="12" x2="24" y2="12">
                <stop stopColor="white" stopOpacity="0" />
                <stop offset="0.50284" stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="absolute right-[9%] bottom-[15%] w-6 h-6 opacity-75">
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path d="M12 0L12 24" stroke="url(#paint0_linear_white2)" />
            <path d="M24 12L0 12" stroke="url(#paint1_linear_white2)" />
            <defs>
              <linearGradient id="paint0_linear_white2" x1="12" y1="24" x2="12" y2="0">
                <stop stopColor="white" stopOpacity="0" />
                <stop offset="0.50284" stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="paint1_linear_white2" x1="0" y1="12" x2="24" y2="12">
                <stop stopColor="white" stopOpacity="0" />
                <stop offset="0.50284" stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="absolute left-[7%] top-[11%] w-6 h-6">
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path d="M12 0L12 24" stroke="url(#paint0_linear_green)" />
            <path d="M24 12L0 12" stroke="url(#paint1_linear_green)" />
            <defs>
              <linearGradient id="paint0_linear_green" x1="12" y1="24" x2="12" y2="0">
                <stop stopColor="#DDFB24" stopOpacity="0" />
                <stop offset="0.50284" stopColor="#DDFB24" />
                <stop offset="1" stopColor="#DDFB24" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="paint1_linear_green" x1="0" y1="12" x2="24" y2="12">
                <stop stopColor="#DDFB24" stopOpacity="0" />
                <stop offset="0.50284" stopColor="#DDFB24" />
                <stop offset="1" stopColor="#DDFB24" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Floating rectangles */}
        <div className="absolute left-[23%] top-[12.5%] w-[110px] h-[111px] bg-white/[0.07] border border-[#37393a] opacity-47 rounded-sm"></div>
        <div className="absolute right-[31%] top-[0.1%] w-[111px] h-[111px] bg-white/[0.07] border border-[#37393a] opacity-47 rounded-sm"></div>
        <div className="absolute right-[15%] top-[25%] w-[111px] h-28 bg-white/[0.07] border border-[#37393a] opacity-47 rounded-sm"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-8 text-center max-w-4xl">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-[56px] leading-[72px] tracking-[-1.12px] font-normal">
                <span className="text-[#eeeeee]">Universal</span>{' '}
                <span className="text-[#EFFF4C] font-medium">Auction & Action</span>{' '}
                <span className="text-[#eeeeee]">of Ideas</span>
              </h1>
              <p className="text-[20px] leading-[30px] text-[#aaaaaa] max-w-[839px] mx-auto">
                Connect innovators worldwide. Auction your concepts, bid on breakthrough ideas, and turn creativity into opportunity with transparent blockchain-based trading.
              </p>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-center justify-center gap-4">
                <Button 
                  onClick={() => onNavigate('list-idea')}
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-[500px] text-[18px] leading-[20px] font-medium shadow-[0px_1px_2px_0px_rgba(9,44,16,0.63)] hover:bg-primary/90"
                >
                  List Your Idea
                </Button>
                <Button 
                  onClick={() => onNavigate('explore')}
                  variant="outline"
                  className="border-primary text-primary px-8 py-4 rounded-[500px] text-[18px] leading-[20px] font-medium hover:bg-primary/10"
                >
                  Browse Ideas
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-8 text-[16px] leading-[28px] text-[#f2f2f2]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Global marketplace access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Secure blockchain trading</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>IP protection guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Platform Metrics */}
      <section className="pb-12">
        <div className="bg-[#0a0e17] rounded-t-[32px] relative">
          <div className="container mx-auto px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-center mb-6">
              <div className="space-y-1 text-center">
                <h2 className="text-[30px] leading-[38px] font-medium bg-gradient-to-b from-[#f5f5f6] to-transparent bg-clip-text text-transparent">
                  Live Platform Metrics
                </h2>
                <p className="text-[16px] leading-[24px] text-[#94969c]">
                  Real-time insights into the global idea marketplace
                </p>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Registered Ideas */}
              <Card 
                className="bg-gradient-to-br from-[#0c111d] to-[rgba(12,17,29,0)] border border-[#1f242f] rounded-xl p-6 cursor-pointer hover:border-primary/30 transition-all duration-300"
                onClick={() => onNavigate('explore', undefined, { filter: 'newest' })}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-primary" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-[#47cd89]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#ffffff]">{ideas.length}</div>
                    <div className="text-sm text-[#94969c]">Registered Ideas</div>
                  </div>
                  <div className="text-xs text-[#47cd89]">+12 this week</div>
                </div>
              </Card>

              {/* Completed Auctions */}
              <Card 
                className="bg-gradient-to-br from-[#0c111d] to-[rgba(12,17,29,0)] border border-[#1f242f] rounded-xl p-6 cursor-pointer hover:border-primary/30 transition-all duration-300"
                onClick={() => onNavigate('explore', undefined, { filter: 'ended' })}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-[#47cd89]/20 rounded-xl flex items-center justify-center">
                      <Gavel className="w-6 h-6 text-[#47cd89]" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-[#47cd89]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#ffffff]">{endedAuctions.length}</div>
                    <div className="text-sm text-[#94969c]">Completed Auctions</div>
                  </div>
                  <div className="text-xs text-[#47cd89]">+3 this week</div>
                </div>
              </Card>

              {/* Active Users */}
              <Card 
                className="bg-gradient-to-br from-[#0c111d] to-[rgba(12,17,29,0)] border border-[#1f242f] rounded-xl p-6 cursor-pointer hover:border-primary/30 transition-all duration-300"
                onClick={() => onNavigate('my-page')}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-[#47cd89]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#ffffff]">{totalUsers.toLocaleString()}</div>
                    <div className="text-sm text-[#94969c]">Active Users</div>
                  </div>
                  <div className="text-xs text-[#47cd89]">+89 this week</div>
                </div>
              </Card>

              {/* Trading Volume */}
              <Card 
                className="bg-gradient-to-br from-[#0c111d] to-[rgba(12,17,29,0)] border border-[#1f242f] rounded-xl p-6 cursor-pointer hover:border-primary/30 transition-all duration-300"
                onClick={() => onNavigate('explore', undefined, { filter: 'volume' })}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-purple-400" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-[#47cd89]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#ffffff]">${totalVolume.toLocaleString()}</div>
                    <div className="text-sm text-[#94969c]">Trading Volume</div>
                  </div>
                  <div className="text-xs text-[#47cd89]">+28% this month</div>
                </div>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              {/* Portfolio Card */}
              <Card className="bg-gradient-to-br from-[#0c111d] to-[rgba(12,17,29,0)] border border-[#1f242f] rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-[132px] left-[83px] w-[319px] h-[265px] rotate-[295.552deg] opacity-[0.04] pointer-events-none">
                  <div className="w-[161px] h-[277px] relative">
                    <div className="absolute inset-0 scale-[2.6]">
                      <div 
                        className="w-[161px] h-[277px] rounded-full"
                        style={{
                          background: 'radial-gradient(ellipse 80.5px 138.5px at center, #47CD89, transparent)',
                          filter: 'blur(65.95px)'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[16px] leading-[24px] text-[#ffffff] uppercase tracking-wide">Trending Ideas</span>
                      <Button variant="ghost" size="icon" className="text-[#94969c]">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-[44px] leading-[44px] tracking-[-1.04px] bg-gradient-to-b from-[#ffffff] from-[24.106%] to-transparent bg-clip-text text-transparent">
                      <span className="text-[28px] font-light">$</span>
                      <span>{totalVolume.toLocaleString()}</span>
                      <span className="text-[28px] font-light">.48</span>
                    </div>
                  </div>

                  <div className="h-px bg-[#333741]"></div>

                  <div className="flex gap-6">
                    <div className="space-y-1">
                      <span className="text-[12px] leading-[24px] text-[#94969c] uppercase tracking-wide">Active</span>
                      <div className="text-[16px] leading-[25.5px] tracking-[-0.32px] text-[#f5f5f6]">
                        <span className="font-light">{activeIdeas.length}</span> Ideas
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[12px] leading-[24px] text-[#94969c] uppercase tracking-wide">Volume Growth</span>
                      <div className="flex items-center gap-2">
                        <div className="text-[16px] leading-[25.5px] tracking-[-0.32px] text-[#47cd89]">
                          <span className="font-light">+</span>28.33<span className="font-light">%</span>
                        </div>
                        <Badge className="bg-[#0b322b] text-[#47cd89] text-[12px] leading-[18px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          +28.33%
                          <TrendingUp className="w-4 h-4" />
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quarterly Gains */}
              <Card className="bg-gradient-to-br from-[#0c111d] to-[rgba(12,17,29,0)] border border-[#1f242f] rounded-xl p-6 relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[16px] leading-[24px] text-[#ffffff] uppercase tracking-wide">Category Performance</span>
                    <Button variant="ghost" size="icon" className="text-[#94969c]">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-end gap-1 h-[100px]">
                      {topCategories.map((category, index) => {
                        const heights = [63, 27, 50, 33];
                        const isNegative = category.growth.startsWith('-');
                        
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center justify-end h-full relative">
                            <div 
                              className={`w-full rounded-t-lg relative overflow-hidden ${
                                isNegative ? 'bg-[#320b0b]' : 'bg-[#0b322b]'
                              }`}
                              style={{ height: `${heights[index]}px` }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-[12px] leading-[24px] font-medium ${
                                  isNegative ? 'text-[#f59f9f]' : 'text-[#47cd89]'
                                }`}>
                                  {category.growth}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="h-px bg-white/20"></div>
                    
                    <div className="flex justify-between">
                      {['AI', 'Blockchain', 'Health', 'Commerce'].map((quarter) => (
                        <div key={quarter} className="flex-1 text-center">
                          <span className="text-[14px] leading-[25.5px] tracking-[-0.28px] text-[#f5f5f6]">
                            {quarter}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Watched Ideas */}
              <Card className="bg-gradient-to-br from-[#0c111d] to-[rgba(12,17,29,0)] border border-[#1f242f] rounded-xl p-6 relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[16px] leading-[24px] text-[#ffffff] uppercase tracking-wide">Hot Ideas</span>
                    <Button variant="ghost" size="icon" className="text-[#94969c]">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-0">
                    <div className="flex bg-[#0f141d] py-2 text-[12px] leading-[18px] font-medium text-[#94969c]">
                      <div className="flex-1 px-3">Idea</div>
                      <div className="flex-1 px-3">Current Bid</div>
                      <div className="flex-1 px-3">Trend</div>
                    </div>
                    
                    {activeIdeas.slice(0, 3).map((idea, index) => {
                      const icons = ['🏠', '🛍️', '⛓️'];
                      const isNegative = index === 0;
                      
                      return (
                        <div 
                          key={idea.id} 
                          className={`flex py-3 text-[14px] border-t border-[#1f242f] cursor-pointer hover:bg-[#0f131d] transition-colors ${
                            index === 1 ? 'bg-[#0f131d] rounded-lg' : ''
                          }`}
                          onClick={() => onNavigate('idea-detail', idea.id)}
                        >
                          <div className="flex-1 px-3 flex items-center gap-1">
                            <span className="text-lg">{icons[index]}</span>
                            <span className="text-[#f5f5f6]">{idea.title.split(' ').slice(0, 2).join(' ')}</span>
                          </div>
                          <div className="flex-1 px-3 flex items-center gap-1">
                            <span className={isNegative ? 'text-[#f59f9f]' : 'text-[#47cd89]'}>
                              ${idea.currentBid}
                            </span>
                            <TrendingUp className={`w-4 h-4 ${isNegative ? 'text-[#f59f9f] scale-y-[-1]' : 'text-[#47cd89]'}`} />
                          </div>
                          <div className="flex-1 px-3">
                            <span className="text-[#f5f5f6]">{idea.bidCount} bids</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>

              {/* Large Chart Card */}
              <Card className="lg:col-span-2 bg-gradient-to-br from-[#0c111d] to-[rgba(12,17,29,0)] border border-[#1f242f] rounded-xl p-6 relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-primary-foreground text-xl">💡</span>
                        </div>
                        <span className="text-[24px] leading-[20px] text-[#f5f5f6]">Idea Market Trends</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="text-[24px] leading-[25.5px] tracking-[-0.48px] font-medium text-[#f5f5f6]">
                        ${totalVolume.toLocaleString()}
                      </div>
                      <Badge className="bg-[#0b322b] text-[#47cd89] text-[12px] leading-[18px] px-2 py-0.5 rounded-full flex items-center gap-1">
                        +15.75%
                        <TrendingUp className="w-4 h-4" />
                      </Badge>
                    </div>
                  </div>

                  <div className="h-[370px] relative">
                    <IdeaTrendChart />
                  </div>
                </div>
              </Card>

              {/* Top Gainers */}
              <Card className="bg-gradient-to-br from-[#0c111d] to-[rgba(12,17,29,0)] border border-[#1f242f] rounded-xl p-6 relative overflow-hidden">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[16px] leading-[24px] text-[#ffffff] uppercase tracking-wide">Closing Soon</span>
                    <Button variant="ghost" size="icon" className="text-[#94969c]">
                      <Clock className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {closingSoonIdeas.slice(0, 6).map((idea, index) => (
                      <Card 
                        key={idea.id} 
                        className="bg-[#0f131d] border border-[#1f242f] rounded-lg p-3 cursor-pointer hover:border-[#ddfb24]/30 transition-all duration-300"
                        onClick={() => onNavigate('idea-detail', idea.id)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">💡</span>
                              <span className="text-[14px] text-[#f5f5f6] truncate max-w-[120px]">{idea.title}</span>
                            </div>
                            <div className="text-[12px] text-[#47cd89] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {idea.timeLeft}
                            </div>
                          </div>
                          <div className="flex items-end justify-between text-[12px]">
                            <span className="text-[#94969c]">${idea.currentBid}</span>
                            <span className="text-[#47cd89]">{idea.bidCount} bids</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Trending Ideas Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              <Card className="bg-gradient-to-br from-[#0c111d] to-[rgba(12,17,29,0)] border border-[#1f242f] rounded-xl p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[16px] leading-[24px] text-[#ffffff] uppercase tracking-wide">
                      Trending Projects
                    </span>
                    <Button variant="ghost" size="icon" className="text-[#94969c]">
                      <TrendingUp className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {trendingIdeas.slice(0, 6).map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#0f131d] transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{project.icon}</span>
                          <div>
                            <div className="text-[14px] text-[#f5f5f6] font-medium">{project.name}</div>
                            <div className="text-[12px] text-[#94969c]">{project.shares}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[14px] text-[#f5f5f6] font-medium">{project.value}</div>
                          <div className="text-[12px] text-[#47cd89]">{project.growth}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-[#0c111d] to-[rgba(12,17,29,0)] border border-[#1f242f] rounded-xl p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[16px] leading-[24px] text-[#ffffff] uppercase tracking-wide">
                      Recent Activity
                    </span>
                    <Button variant="ghost" size="icon" className="text-[#94969c]">
                      <Eye className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {[
                      { action: 'New Idea Listed', project: 'Smart City Platform', time: '2 hours ago', type: 'success' },
                      { action: 'Auction Ended', project: 'AI Healthcare Bot', time: '4 hours ago', type: 'warning' },
                      { action: 'High Bid Placed', project: 'Green Energy Solution', time: '6 hours ago', type: 'info' },
                      { action: 'New User Joined', project: 'From Silicon Valley', time: '8 hours ago', type: 'default' },
                      { action: 'Idea Verified', project: 'Blockchain Voting', time: '12 hours ago', type: 'success' },
                      { action: 'Winner Announced', project: 'Food Delivery Drone', time: '1 day ago', type: 'success' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#0f131d] transition-colors">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-[#47cd89]' :
                          activity.type === 'warning' ? 'bg-[#f59e0b]' :
                          activity.type === 'info' ? 'bg-[#3b82f6]' :
                          'bg-[#94969c]'
                        }`}></div>
                        <div className="flex-1">
                          <div className="text-[14px] text-[#f5f5f6]">{activity.action}</div>
                          <div className="text-[12px] text-[#94969c]">{activity.project}</div>
                        </div>
                        <div className="text-[12px] text-[#94969c]">{activity.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Leaderboard Section */}
            <div className="space-y-8">
              <div className="space-y-4 text-center">
                <h2 className="text-[30px] leading-[38px] font-medium bg-gradient-to-b from-[#f5f5f6] to-transparent bg-clip-text text-transparent">
                  Leaderboard
                </h2>
                <p className="text-[16px] leading-[24px] text-[#94969c]">
                  Top ideas by current bid value
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-[#0c111d] to-[rgba(12,17,29,0)] border border-[#1f242f] rounded-xl p-8">
                  <div className="space-y-6">
                    {topIdeas.map((idea, index) => (
                      <Card 
                        key={idea.id} 
                        className={`p-6 cursor-pointer hover:border-primary/30 transition-all duration-300 ${
                          index === 0 ? 'bg-gradient-to-r from-primary/10 to-transparent border-primary/30' : 'bg-[#0f131d] border-[#1f242f]'
                        }`}
                        onClick={() => onNavigate('idea-detail', idea.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                              index === 0 ? 'bg-primary text-primary-foreground' : 
                              index === 1 ? 'bg-[#C0C0C0] text-black' : 
                              index === 2 ? 'bg-[#CD7F32] text-white' : 
                              'bg-[#1f242f] text-[#94969c]'
                            }`}>
                              {index === 0 ? '👑' : index + 1}
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-lg font-semibold text-[#f5f5f6]">{idea.title}</h3>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-[#94969c]">by {idea.author}</span>
                                <Badge className="bg-secondary/50 text-secondary-foreground">
                                  {idea.category}
                                </Badge>
                                <div className="flex items-center gap-1 text-[#94969c]">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span>{idea.reviewScore}/5</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <div className="text-2xl font-bold text-primary">${idea.currentBid.toLocaleString()}</div>
                            <div className="text-sm text-[#94969c]">{idea.bidCount} bids</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-[40px] leading-[48px] font-medium bg-gradient-to-b from-[#f5f5f6] to-transparent bg-clip-text text-transparent">
                Ready to turn your ideas into opportunities?
              </h2>
              <p className="text-[18px] leading-[28px] text-[#94969c] max-w-2xl mx-auto">
                Join thousands of innovators trading breakthrough concepts on the world's first decentralized idea marketplace.
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Button 
                onClick={() => onNavigate('list-idea')}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-[500px] text-[18px] leading-[20px] font-medium shadow-[0px_1px_2px_0px_rgba(9,44,16,0.63)] hover:bg-primary/90"
              >
                <Lightbulb className="w-5 h-5 mr-2" />
                List Your First Idea
              </Button>
              <Button 
                onClick={() => onNavigate('explore')}
                variant="outline"
                className="border-[#333741] text-[#f5f5f6] px-8 py-4 rounded-[500px] text-[18px] leading-[20px] font-medium hover:bg-[#1f242f]"
              >
                <Globe className="w-5 h-5 mr-2" />
                Explore Marketplace
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}