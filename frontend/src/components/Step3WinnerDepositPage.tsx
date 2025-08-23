import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ArrowLeft, CheckCircle, Crown, Wallet, Eye, Clock, User, Trophy } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { Page, Idea, AppState } from '../App';

interface Step3WinnerDepositPageProps {
  onNavigate: (page: Page, ideaId?: string) => void;
  ideas: Idea[];
  appState: AppState;
}

export function Step3WinnerDepositPage({ onNavigate, ideas, appState }: Step3WinnerDepositPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const selectedIdea = ideas.find(idea => idea.id === appState.selectedIdeaId);

  if (!selectedIdea) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4">Idea not found</h2>
          <Button onClick={() => onNavigate('explore')}>Back to Explore</Button>
        </div>
      </div>
    );
  }

  const handleDeposit = async () => {
    setIsProcessing(true);
    
    // Simulate deposit processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Deposit successful! Proceeding to NFT issuance...');
    
    setTimeout(() => {
      onNavigate('step4-nft-issuance', selectedIdea.id);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Stepper */}
      <div className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('bidding', selectedIdea.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Auction
            </Button>
          </div>

          {/* Stepper - Now with 4 steps */}
          <div className="flex items-center justify-between mb-8 max-w-3xl">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <div className="ml-3">
                <div className="text-sm text-primary">Step 1</div>
                <div className="text-sm text-muted-foreground">Review Idea</div>
              </div>
            </div>
            
            <div className="flex-1 h-px bg-primary mx-4"></div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <div className="ml-3">
                <div className="text-sm text-primary">Step 2</div>
                <div className="text-sm text-muted-foreground">Auction</div>
              </div>
            </div>
            
            <div className="flex-1 h-px bg-primary mx-4"></div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary border-2 border-primary flex items-center justify-center">
                <span className="text-primary-foreground text-sm">3</span>
              </div>
              <div className="ml-3">
                <div className="text-sm text-primary">Step 3</div>
                <div className="text-sm text-foreground">Winner Deposit</div>
              </div>
            </div>
            
            <div className="flex-1 h-px bg-muted mx-4"></div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-muted border-2 border-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">4</span>
              </div>
              <div className="ml-3">
                <div className="text-sm text-muted-foreground">Step 4</div>
                <div className="text-sm text-muted-foreground">NFT Issuance</div>
              </div>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="text-center">
            <h1 className="mb-4">Step 3 — Winner Deposit</h1>
            <p className="text-xl text-muted-foreground">Secure your winning bid with escrow deposit</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Auction Completion Message */}
          <Card className="bg-card border-border rounded-2xl">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl">🎉 Auction Complete!</h2>
                <p className="text-muted-foreground text-lg">
                  The auction for "{selectedIdea.title}" has ended successfully
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Winning Bidder & Auction Stats */}
            <div className="space-y-8">
              {/* Winning Bidder */}
              <Card className="bg-card border-border rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-primary" />
                    Winning Bidder
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face" />
                      <AvatarFallback>
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm text-muted-foreground">Winner</div>
                      <div className="font-mono text-sm">0x1a2b3c4d5e6f7890...a1b2c3d4</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Winning Bid</span>
                      <span className="text-2xl text-primary">${selectedIdea.currentBid}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Token</span>
                      <Badge variant="outline" className="border-border text-foreground">
                        ZETA
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Auction Statistics */}
              <Card className="bg-card border-border rounded-2xl">
                <CardHeader>
                  <CardTitle>Auction Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Total Bids</span>
                    </div>
                    <span className="text-foreground">{selectedIdea.bidCount} bids</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Reserve Price</span>
                    </div>
                    <span className="text-foreground">${selectedIdea.reservePrice}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Total Views</span>
                    </div>
                    <span className="text-foreground">{selectedIdea.views} views</span>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Category</span>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {selectedIdea.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Deposit Action */}
            <div>
              <Card className="bg-card border-border rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary" />
                    Escrow Deposit Required
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      As the winning bidder, you must deposit the winning amount into escrow before the IdeaProof NFT can be issued. This ensures secure transaction completion.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Deposit Amount</span>
                      <span className="text-2xl text-primary">${selectedIdea.currentBid}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Token</span>
                      <Badge variant="outline" className="border-border text-foreground">
                        ZETA
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Escrow Contract</span>
                      <span className="font-mono text-xs text-primary">
                        0xA1B2C3...D4E5F6
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        Connected Wallet
                      </div>
                      <div className="font-mono text-sm">0x1a2b3c4d5e6f7890...a1b2c3d4</div>
                      <div className="text-sm text-primary">Balance: $5,000 ZETA</div>
                    </div>
                  </div>

                  <Button
                    onClick={handleDeposit}
                    disabled={isProcessing}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl py-3"
                  >
                    {isProcessing ? 'Processing Deposit...' : 'Deposit to Escrow'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Funds will be held in escrow until NFT issuance is complete
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Idea Summary */}
          <Card className="bg-card border-border rounded-2xl">
            <CardHeader>
              <CardTitle>Idea Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2">{selectedIdea.title}</h3>
                <p className="text-muted-foreground">{selectedIdea.summary}</p>
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Proof Hash</span>
                  <span className="text-primary font-mono text-xs">
                    {selectedIdea.proofHash.slice(0, 20)}...
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}