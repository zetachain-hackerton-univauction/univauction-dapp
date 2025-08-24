import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ArrowLeft, CheckCircle, Trophy, Shield, Award, User, Copy, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import type { Page, Idea, AppState } from '../App';

interface Step3CompletePageProps {
  onNavigate: (page: Page, ideaId?: string) => void;
  ideas: Idea[];
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
}

export function Step3CompletePage({ onNavigate, ideas, appState }: Step3CompletePageProps) {
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

  const winnerData = {
    walletAddress: '0x1a2b3c4d5e6f7890...a1b2c3d4',
    winningBid: selectedIdea.currentBid + 150,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face'
  };

  const certificateHash = 'QmX7Y8Z9A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T';
  const nftThumbnail = 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=200&h=200&fit=crop';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
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
              onClick={() => onNavigate('explore')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Explore
            </Button>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-8 max-w-2xl">
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
                <Trophy className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="ml-3">
                <div className="text-sm text-primary">Step 3</div>
                <div className="text-sm text-foreground">Winner</div>
              </div>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="text-center">
            <h1 className="mb-4">Step 3 Complete</h1>
            <p className="text-xl text-muted-foreground">Auction has ended</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Congratulations Banner */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <h2 className="mb-2">Auction Successfully Completed!</h2>
              <p className="text-muted-foreground">
                The bidding has ended and the winner has been determined.
              </p>
            </CardContent>
          </Card>

          {/* Winner Summary Card */}
          <Card className="bg-card border-border rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Award className="w-6 h-6 text-primary" />
                Winner Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-primary/5 rounded-2xl border border-primary/20">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={winnerData.avatar} />
                    <AvatarFallback>
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm text-muted-foreground">Winner</div>
                    <div className="font-mono text-sm text-foreground">{winnerData.walletAddress}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Winning Bid</div>
                  <div className="text-2xl text-primary">${winnerData.winningBid.toLocaleString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-secondary/20 rounded-2xl">
                  <div className="text-2xl text-primary">{selectedIdea.bidCount}</div>
                  <div className="text-sm text-muted-foreground">Total Bids</div>
                </div>
                <div className="text-center p-4 bg-secondary/20 rounded-2xl">
                  <div className="text-2xl text-primary">${selectedIdea.reservePrice.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Reserve Price</div>
                </div>
                <div className="text-center p-4 bg-secondary/20 rounded-2xl">
                  <div className="text-2xl text-primary">{selectedIdea.views}</div>
                  <div className="text-sm text-muted-foreground">Total Views</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proof Certificate Info */}
          <Card className="bg-card border-border rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" />
                Proof Certificate Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-secondary/20 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">IdeaProof NFT</span>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    Issued
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Certificate Hash</div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-foreground break-all">{certificateHash}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(certificateHash, 'Certificate hash')}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Issued to</div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-foreground">{winnerData.walletAddress}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(winnerData.walletAddress, 'Wallet address')}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Blockchain</div>
                    <div className="text-sm text-foreground">ZetaChain Network</div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-border text-foreground hover:bg-secondary/50 rounded-xl"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on ZetaScan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* NFT Confirmation */}
          <Card className="bg-card border-border rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Award className="w-6 h-6 text-primary" />
                NFT Confirmation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl border border-primary/20">
                <div className="relative">
                  <ImageWithFallback
                    src={nftThumbnail}
                    alt="IdeaProof NFT"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-primary/30"
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="mb-2">IdeaProof NFT Successfully Issued</h4>
                  <p className="text-muted-foreground">
                    The IdeaProof NFT has been successfully issued to the winner. 
                    This certificate proves ownership and authenticity of the idea.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="text-center pt-8">
            <Button
              onClick={() => onNavigate('explore')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-8 py-3"
            >
              Back to Explore
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}