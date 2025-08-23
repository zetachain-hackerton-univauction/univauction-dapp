import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { User, Trophy, Star, Download, DollarSign, Eye, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import type { Page, Idea, AppState, UserBid } from '../App';

interface MyPageProps {
  onNavigate: (page: Page, ideaId?: string) => void;
  ideas: Idea[];
  appState: AppState;
  walletConnected: boolean;
}

export function MyPage({ onNavigate, ideas, appState, walletConnected }: MyPageProps) {
  const [activeTab, setActiveTab] = useState('my-ideas');

  // Get user's ideas (ideas they've listed)
  const myIdeas = ideas.filter(idea => appState.userIdeas.includes(idea.id));

  // Get user's bids with idea details
  const myBidsWithIdeas = appState.userBids.map(bid => {
    const idea = ideas.find(i => i.id === bid.ideaId);
    return { ...bid, idea };
  }).filter(item => item.idea);

  // Get won auctions (bids with status 'Won')
  const wonAuctions = myBidsWithIdeas.filter(item => item.status === 'Won');

  // Calculate user stats
  const userStats = {
    totalEarnings: myIdeas.reduce((sum, idea) => sum + (idea.auctionEnded ? idea.currentBid : 0), 0),
    successfulSales: myIdeas.filter(idea => idea.auctionEnded).length,
    auctionsWon: wonAuctions.length,
    totalSpent: wonAuctions.reduce((sum, auction) => sum + auction.amount, 0),
    averageRating: myIdeas.length > 0 ? (myIdeas.reduce((sum, idea) => sum + idea.reviewScore, 0) / myIdeas.length) : 0,
    ideasListed: myIdeas.length,
  };

  const handleDownload = (ideaId: string) => {
    toast.success('Files downloaded successfully!');
  };

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            My Page
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your ideas, bids, and profile
          </p>
        </div>

        {/* Wallet Connection Warning */}
        {!walletConnected && (
          <Card className="mb-8 bg-yellow-500/10 border-yellow-500/20 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="font-medium text-foreground">Wallet Not Connected</p>
                  <p className="text-sm text-muted-foreground">Connect your wallet to access all features and view your complete activity.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 rounded-3xl bg-card/50 border border-border backdrop-blur-sm p-2">
            <TabsTrigger value="my-ideas" className="rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              My Ideas
            </TabsTrigger>
            <TabsTrigger value="my-bids" className="rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              My Bids
            </TabsTrigger>
            <TabsTrigger value="won-auctions" className="rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Won Auctions
            </TabsTrigger>
            <TabsTrigger value="profile" className="rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Profile
            </TabsTrigger>
          </TabsList>

          {/* My Ideas Tab */}
          <TabsContent value="my-ideas" className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-semibold">My Listed Ideas</h2>
              <Button
                onClick={() => onNavigate('list-idea')}
                className="bg-primary hover:bg-primary/90 rounded-2xl px-6"
              >
                List New Idea
              </Button>
            </div>
            
            {myIdeas.length === 0 ? (
              <Card className="bg-card/30 border-border backdrop-blur-sm rounded-3xl">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Ideas Listed Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start by listing your first idea on the marketplace
                  </p>
                  <Button
                    onClick={() => onNavigate('list-idea')}
                    className="bg-primary hover:bg-primary/90 rounded-2xl"
                  >
                    List Your First Idea
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {myIdeas.map((idea) => (
                  <Card
                    key={idea.id}
                    className="cursor-pointer hover:scale-[1.02] transition-all duration-300 rounded-3xl border-border bg-card/30 backdrop-blur-sm overflow-hidden group"
                    onClick={() => onNavigate('idea-detail', idea.id)}
                  >
                    <div className="relative">
                      <ImageWithFallback
                        src={idea.imageUrl}
                        alt={idea.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <Badge className={`${
                          idea.auctionEnded ? 'bg-gray-500/90' : 'bg-green-500/90'
                        } text-white border-0 backdrop-blur-sm`}>
                          {idea.auctionEnded ? 'Ended' : 'Active'}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-background/90 backdrop-blur-sm rounded-xl px-3 py-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Eye className="w-3 h-3" />
                              <span>{idea.views} views</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              <span>{idea.auctionEnded ? 'Ended' : idea.timeLeft}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-3 line-clamp-2">{idea.title}</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Current Bid</span>
                          <span className="font-semibold text-primary">${idea.currentBid}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Reserve Price</span>
                          <span className="font-medium text-foreground">${idea.reservePrice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Total Bids</span>
                          <span className="font-medium text-foreground">{idea.bidCount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Bids Tab */}
          <TabsContent value="my-bids" className="space-y-8">
            <h2 className="text-3xl font-semibold">My Active Bids</h2>
            
            {myBidsWithIdeas.length === 0 ? (
              <Card className="bg-card/30 border-border backdrop-blur-sm rounded-3xl">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Bids Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Explore ideas and place your first bid
                  </p>
                  <Button
                    onClick={() => onNavigate('explore')}
                    className="bg-primary hover:bg-primary/90 rounded-2xl"
                  >
                    Explore Ideas
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {myBidsWithIdeas.map((bidItem) => {
                  const { idea, amount, status, timestamp } = bidItem;
                  if (!idea) return null;
                  
                  return (
                    <Card
                      key={`${idea.id}-${timestamp.getTime()}`}
                      className="cursor-pointer hover:scale-[1.02] transition-all duration-300 rounded-3xl border-border bg-card/30 backdrop-blur-sm overflow-hidden group"
                      onClick={() => onNavigate('idea-detail', idea.id)}
                    >
                      <div className="relative">
                        <ImageWithFallback
                          src={idea.imageUrl}
                          alt={idea.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute top-4 right-4">
                          <Badge className={`${
                            status === 'Won' ? 'bg-green-500/90' :
                            status === 'Outbid' ? 'bg-red-500/90' :
                            'bg-blue-500/90'
                          } text-white border-0 backdrop-blur-sm`}>
                            {status}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-3 line-clamp-2">{idea.title}</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">My Bid</span>
                            <span className="font-semibold text-primary">${amount}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Current Highest</span>
                            <span className={`font-semibold ${
                              amount >= idea.currentBid ? 'text-green-500' : 'text-red-500'
                            }`}>
                              ${idea.currentBid}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <span className="font-medium text-foreground">{status}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Won Auctions Tab */}
          <TabsContent value="won-auctions" className="space-y-8">
            <h2 className="text-3xl font-semibold">Won Auctions</h2>
            
            {wonAuctions.length === 0 ? (
              <Card className="bg-card/30 border-border backdrop-blur-sm rounded-3xl">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Won Auctions Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Keep bidding to win your first auction
                  </p>
                  <Button
                    onClick={() => onNavigate('explore')}
                    className="bg-primary hover:bg-primary/90 rounded-2xl"
                  >
                    Browse Active Auctions
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {wonAuctions.map((wonItem) => {
                  const { idea, amount } = wonItem;
                  if (!idea) return null;
                  
                  return (
                    <Card
                      key={idea.id}
                      className="cursor-pointer hover:scale-[1.02] transition-all duration-300 rounded-3xl border-border bg-card/30 backdrop-blur-sm overflow-hidden group"
                      onClick={() => onNavigate('idea-detail', idea.id)}
                    >
                      <div className="relative">
                        <ImageWithFallback
                          src={idea.imageUrl}
                          alt={idea.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-green-500/90 text-white border-0 backdrop-blur-sm">
                            Won
                          </Badge>
                        </div>
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-yellow-500/90 text-white border-0 backdrop-blur-sm">
                            <Trophy className="w-3 h-3 mr-1" />
                            Winner
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-4 line-clamp-2">{idea.title}</h3>
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Winning Bid</span>
                            <span className="font-semibold text-green-500">${amount}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">NFT Status</span>
                            <span className="text-green-500 text-sm">Transferred</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Files</span>
                            <span className="text-green-500 text-sm">Available</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full rounded-2xl bg-green-500 hover:bg-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(idea.id);
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Files
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-8">
            <h2 className="text-3xl font-semibold">Profile & Statistics</h2>
            
            {/* User Info Card */}
            <Card className="bg-card/30 border-border backdrop-blur-sm rounded-3xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Anonymous User</h3>
                    <p className="text-muted-foreground">
                      {walletConnected ? 'Wallet Connected' : 'Wallet Not Connected'}
                    </p>
                    {walletConnected && (
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">
                          Average Rating: {userStats.averageRating.toFixed(1)}/5
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Achievements */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-secondary/20 rounded-2xl">
                    <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-lg font-bold">{userStats.auctionsWon}</div>
                    <div className="text-xs text-muted-foreground">Auctions Won</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/20 rounded-2xl">
                    <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-lg font-bold">{userStats.ideasListed}</div>
                    <div className="text-xs text-muted-foreground">Ideas Listed</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/20 rounded-2xl">
                    <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-lg font-bold">{userStats.successfulSales}</div>
                    <div className="text-xs text-muted-foreground">Successful Sales</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/20 rounded-2xl">
                    <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-lg font-bold">{userStats.averageRating.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">Avg Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-card/30 border-border backdrop-blur-sm rounded-3xl">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-2">${userStats.totalEarnings.toLocaleString()}</div>
                  <div className="text-muted-foreground mb-2">Total Earnings</div>
                  <div className="text-sm text-muted-foreground">
                    From {userStats.successfulSales} successful sales
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/30 border-border backdrop-blur-sm rounded-3xl">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{userStats.auctionsWon}</div>
                  <div className="text-muted-foreground mb-2">Auctions Won</div>
                  <div className="text-sm text-muted-foreground">
                    Total spent: ${userStats.totalSpent.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/30 border-border backdrop-blur-sm rounded-3xl">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{userStats.averageRating.toFixed(1)}</div>
                  <div className="text-muted-foreground mb-2">Average Rating</div>
                  <div className="text-sm text-muted-foreground">
                    From {userStats.ideasListed} ideas listed
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}