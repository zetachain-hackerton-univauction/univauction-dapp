import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { ArrowLeft, Clock, DollarSign, Shield, Eye, FileText, Trophy, User, Star, Play, Download, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import type { Page, Idea, AppState } from '../App';

interface IdeaDetailPageProps {
  ideas: Idea[];
  appState: AppState;
  onNavigate: (page: Page, ideaId?: string) => void;
  addUserBid: (ideaId: string, amount: number) => void;
  walletConnected: boolean;
}

export function IdeaDetailPage({ ideas, appState, onNavigate, addUserBid, walletConnected }: IdeaDetailPageProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [bidSalt, setBidSalt] = useState('');
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidStep, setBidStep] = useState<'commit' | 'reveal' | 'success'>('commit');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  const idea = ideas.find(i => i.id === appState.selectedIdeaId);

  if (!idea) {
    return (
      <div className="min-h-screen bg-background pt-8">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Idea not found</h1>
          <Button onClick={() => onNavigate('explore')} className="rounded-2xl">
            Back to Explore
          </Button>
        </div>
      </div>
    );
  }

  // Calculate time remaining
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = idea.endTime.getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft({ days, hours, minutes });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [idea.endTime]);

  const handleCommitBid = () => {
    if (!walletConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!bidAmount || !bidSalt) {
      toast.error('Please fill in all fields');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (amount <= idea.currentBid) {
      toast.error('Bid must be higher than current bid');
      return;
    }

    if (amount < idea.reservePrice) {
      toast.error('Bid must meet reserve price');
      return;
    }

    addUserBid(idea.id, amount);
    setBidStep('success');
    toast.success('Bid committed successfully! Remember your salt for the reveal phase.');
  };

  const handleRevealBid = () => {
    setBidStep('success');
    toast.success('Bid revealed successfully!');
  };

  const resetBidModal = () => {
    setBidStep('commit');
    setBidAmount('');
    setBidSalt('');
    setShowBidModal(false);
  };

  const progressPercent = Math.min(((idea.currentBid / idea.reservePrice) * 100), 100);

  const renderBidModalContent = () => {
    switch (bidStep) {
      case 'commit':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="bid-amount" className="text-foreground">Bid Amount (USD)</Label>
              <Input
                id="bid-amount"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Minimum: ${Math.max(idea.currentBid + 50, idea.reservePrice)}`}
                className="mt-2 rounded-2xl border-border bg-input-background"
              />
            </div>
            <div>
              <Label htmlFor="bid-salt" className="text-foreground">Salt (Secret Key)</Label>
              <Input
                id="bid-salt"
                value={bidSalt}
                onChange={(e) => setBidSalt(e.target.value)}
                placeholder="Enter a secret phrase"
                className="mt-2 rounded-2xl border-border bg-input-background"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Keep this secret! You'll need it to reveal your bid.
              </p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground font-medium">
                    Notice: A deposit of $100 is required to participate.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This will be refunded if you don't win the auction.
                  </p>
                </div>
              </div>
            </div>
            <Button onClick={handleCommitBid} className="w-full rounded-2xl bg-primary hover:bg-primary/90">
              Commit Bid
            </Button>
          </div>
        );

      case 'reveal':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Reveal Your Bid</h3>
              <p className="text-muted-foreground">The auction has ended. Please reveal your bid to participate in settlement.</p>
            </div>
            <div>
              <Label htmlFor="reveal-amount">Your Bid Amount</Label>
              <Input
                id="reveal-amount"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="mt-2 rounded-2xl border-border bg-input-background"
              />
            </div>
            <div>
              <Label htmlFor="reveal-salt">Your Salt</Label>
              <Input
                id="reveal-salt"
                value={bidSalt}
                onChange={(e) => setBidSalt(e.target.value)}
                className="mt-2 rounded-2xl border-border bg-input-background"
              />
            </div>
            <Button onClick={handleRevealBid} className="w-full rounded-2xl bg-primary hover:bg-primary/90">
              Reveal Bid
            </Button>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {bidStep === 'success' && !idea.auctionEnded ? 'Bid Committed!' : 'Bid Revealed!'}
              </h3>
              <p className="text-muted-foreground">
                {bidStep === 'success' && !idea.auctionEnded 
                  ? 'Your bid has been committed. You can track the auction progress below.' 
                  : 'Your bid has been revealed and will be considered in the final settlement.'}
              </p>
            </div>
            <Button onClick={resetBidModal} className="w-full rounded-2xl">
              Close
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => onNavigate('explore')}
            variant="ghost"
            className="mb-4 rounded-2xl hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explore
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="relative">
              <ImageWithFallback
                src={idea.imageUrl}
                alt={idea.title}
                className="w-full h-96 object-cover rounded-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-3xl"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-background/90 backdrop-blur-xl rounded-2xl p-4 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-foreground">Watermarked Preview</span>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      {idea.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <Card className="rounded-3xl border-border bg-card/30 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold mb-4 text-foreground">{idea.title}</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">{idea.summary}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-primary/10 text-primary px-4 py-2 rounded-2xl border border-primary/20">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-medium">{idea.reviewScore}/5</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  {idea.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-secondary/50 text-secondary-foreground px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>by {idea.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Review Score: {idea.reviewScore}/5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{idea.views} views</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detail Sections */}
            <div className="space-y-8">
              <Card className="rounded-3xl border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Problem</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-lg">{idea.problem}</p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Solution</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-lg">{idea.solution}</p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Market Opportunity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-lg">{idea.market}</p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Competitive Moat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-lg">{idea.moat}</p>
                </CardContent>
              </Card>

              {/* Files Section */}
              <Card className="rounded-3xl border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <FileText className="w-6 h-6" />
                    Project Files
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {idea.auctionEnded ? (
                    <div className="text-center py-8">
                      <Download className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <p className="text-foreground font-medium mb-2">Files Available for Download</p>
                      <p className="text-sm text-muted-foreground mb-6">
                        Auction has ended. Winner can download all project files.
                      </p>
                      <Button className="rounded-2xl bg-green-500 hover:bg-green-600">
                        <Download className="w-4 h-4 mr-2" />
                        Download All Files
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">Files are locked until auction ends</p>
                      <p className="text-sm text-muted-foreground">
                        Winner will get access to all project files and documentation
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Proof Hash */}
              <Card className="rounded-3xl border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Shield className="w-6 h-6" />
                    Proof of Originality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-secondary/20 rounded-2xl p-4">
                    <p className="text-sm text-muted-foreground mb-2">IPFS Hash:</p>
                    <p className="font-mono text-sm break-all text-foreground">{idea.proofHash}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Auction Status */}
            <Card className="rounded-3xl border-border bg-card/30 backdrop-blur-sm sticky top-8">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-primary mb-2">
                    ${idea.currentBid.toLocaleString()}
                  </div>
                  <div className="text-muted-foreground">
                    {idea.auctionEnded ? 'Final Bid' : 'Current Highest Bid'}
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Reserve Price</span>
                    <span className="font-medium text-foreground">${idea.reservePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Bids</span>
                    <span className="font-medium text-foreground">{idea.bidCount}</span>
                  </div>
                  {!idea.auctionEnded && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Time Left</span>
                      <div className="text-right">
                        <div className="font-medium text-foreground">
                          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-sm text-foreground">{Math.round(progressPercent)}%</span>
                    </div>
                    <Progress 
                      value={progressPercent} 
                      className="h-3 bg-secondary rounded-full"
                    />
                  </div>
                </div>

                <Separator className="my-8 bg-border" />

                {/* Countdown or Auction Ended */}
                {idea.auctionEnded ? (
                  <div className="text-center mb-8">
                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <p className="font-medium text-foreground mb-2">Auction Ended</p>
                    <Button className="w-full rounded-2xl" onClick={() => onNavigate('my-page')}>
                      View Settlement
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-3 mb-8">
                      <div className="text-center p-4 bg-secondary/20 rounded-2xl">
                        <div className="text-2xl font-bold text-primary">{timeLeft.days}</div>
                        <div className="text-xs text-muted-foreground">Days</div>
                      </div>
                      <div className="text-center p-4 bg-secondary/20 rounded-2xl">
                        <div className="text-2xl font-bold text-primary">{timeLeft.hours}</div>
                        <div className="text-xs text-muted-foreground">Hours</div>
                      </div>
                      <div className="text-center p-4 bg-secondary/20 rounded-2xl">
                        <div className="text-2xl font-bold text-primary">{timeLeft.minutes}</div>
                        <div className="text-xs text-muted-foreground">Minutes</div>
                      </div>
                    </div>

                    {walletConnected ? (
                      <Dialog open={showBidModal} onOpenChange={setShowBidModal}>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90 rounded-2xl py-4 text-lg"
                          >
                            <DollarSign className="w-5 h-5 mr-2" />
                            Place Bid
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-card border-border">
                          <DialogHeader>
                            <DialogTitle className="text-foreground">
                              {bidStep === 'commit' ? 'Place Your Bid' : 
                               bidStep === 'reveal' ? 'Reveal Your Bid' : 'Bid Submitted'}
                            </DialogTitle>
                          </DialogHeader>
                          {renderBidModalContent()}
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button 
                        onClick={() => onNavigate('bidding', idea.id)}
                        className="w-full bg-primary hover:bg-primary/90 rounded-2xl py-4 text-lg"
                      >
                        <DollarSign className="w-5 h-5 mr-2" />
                        Connect Wallet to Bid
                      </Button>
                    )}
                  </>
                )}

                {!walletConnected && (
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Connect your wallet to participate in bidding
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}