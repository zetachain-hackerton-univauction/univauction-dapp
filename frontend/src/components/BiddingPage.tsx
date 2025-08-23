import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, CheckCircle, Wallet, Clock, User, Timer, Zap } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { Page, Idea, AppState } from '../App';
import type { BidEntry } from './BiddingPage/types';
import { USER_BALANCE, MOCK_ACTIVE_BIDS } from './BiddingPage/constants';
import { formatTimeAgo, formatTime, validateBidAmount } from './BiddingPage/helpers';
import { BidErrorModal } from './BiddingPage/BidErrorModal';

interface BiddingPageProps {
  onNavigate: (page: Page, ideaId?: string) => void;
  ideas: Idea[];
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
  addUserBid: (ideaId: string, amount: number) => void;
}

export function BiddingPage({ onNavigate, ideas, appState, addUserBid }: BiddingPageProps) {
  const [selectedToken, setSelectedToken] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [comment, setComment] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(59); // seconds
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeBids, setActiveBids] = useState<BidEntry[]>(MOCK_ACTIVE_BIDS);

  const selectedIdea = ideas.find(idea => idea.id === appState.selectedIdeaId);

  // Countdown timer effect
  React.useEffect(() => {
    if (!isTimerActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsTimerActive(false);
          setTimeout(() => onNavigate('step3-winner-deposit', selectedIdea?.id), 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, timeRemaining, onNavigate, selectedIdea?.id]);

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

  const handlePlaceBid = () => {
    if (!selectedToken || !bidAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const validationError = validateBidAmount(bidAmount, USER_BALANCE, selectedIdea.currentBid);
    
    if (validationError) {
      if (validationError === 'Bid must be higher than current bid') {
        toast.error(validationError);
      } else {
        setErrorMessage(validationError);
        setShowErrorModal(true);
      }
      return;
    }

    const amount = parseFloat(bidAmount);

    // Add to active bids
    const newBid: BidEntry = {
      id: Date.now().toString(),
      walletAddress: '0x1a2b3c...d4e5',
      token: selectedToken,
      amount: amount,
      timestamp: new Date(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face'
    };

    setActiveBids(prev => [newBid, ...prev]);
    addUserBid(selectedIdea.id, amount);
    
    // Reset form
    setSelectedToken('');
    setBidAmount('');
    setComment('');
    
    toast.success('Bid placed successfully!');
  };

  const handleTryAgain = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  const handleCancel = () => {
    setShowErrorModal(false);
    setErrorMessage('');
    setBidAmount('');
  };

  const handleFastExpire = () => {
    setTimeRemaining(3);
    setIsTimerActive(true);
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
              onClick={() => onNavigate('idea-detail', selectedIdea.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Idea
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
              <div className="w-8 h-8 rounded-full bg-primary border-2 border-primary flex items-center justify-center">
                <span className="text-primary-foreground text-sm">2</span>
              </div>
              <div className="ml-3">
                <div className="text-sm text-primary">Step 2</div>
                <div className="text-sm text-foreground">Auction</div>
              </div>
            </div>
            
            <div className="flex-1 h-px bg-muted mx-4"></div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-muted border-2 border-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">3</span>
              </div>
              <div className="ml-3">
                <div className="text-sm text-muted-foreground">Step 3</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="text-center">
            <h1 className="mb-4">Place Your Bid</h1>
            <p className="text-xl text-muted-foreground">Bid with any token via ZetaChain</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Idea Summary */}
            <div>
              <Card className="bg-card border-border rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Idea Summary</span>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      {selectedIdea.category}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="mb-2">{selectedIdea.title}</h3>
                    <p className="text-muted-foreground">{selectedIdea.summary}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Current Bid</span>
                      <span className="text-2xl text-primary">${selectedIdea.currentBid}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Time Left</span>
                      <span className="flex items-center text-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        {selectedIdea.timeLeft}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Bids</span>
                      <span className="text-foreground">{selectedIdea.bidCount} bids</span>
                    </div>
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

            {/* Right Column - Bidding Form */}
            <div className="space-y-8">
              {/* Connected Wallet */}
              <Card className="bg-card border-border rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Connected Wallet</div>
                        <div className="font-mono text-sm">0x1a2b3c4d5e6f7890...a1b2c3d4</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Available Balance</div>
                      <div className="text-sm text-primary">${USER_BALANCE.toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Countdown Timer */}
              <Card className="bg-card border-border rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Timer className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Time Remaining</div>
                        <div className="text-2xl font-bold text-primary">
                          {formatTime(timeRemaining)}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleFastExpire}
                      variant="outline"
                      size="sm"
                      className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Fast Expire Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Bidding Form */}
              <Card className="bg-card border-border rounded-2xl">
                <CardHeader>
                  <CardTitle>Place Your Bid</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="token">Select Token</Label>
                    <Select value={selectedToken} onValueChange={setSelectedToken}>
                      <SelectTrigger className="w-full bg-input-background border-border rounded-xl">
                        <SelectValue placeholder="Choose token to bid with" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ZETA">ZETA</SelectItem>
                        <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                        <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                        <SelectItem value="USDT">Tether (USDT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Bid Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder={`Minimum: $${selectedIdea.currentBid + 1}`}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="bg-input-background border-border rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">Optional Comment</Label>
                    <Textarea
                      id="comment"
                      placeholder="Add a message with your bid..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="bg-input-background border-border rounded-xl resize-none"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handlePlaceBid}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl py-3"
                  >
                    Place Bid Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Active Bids Table */}
          <div className="mt-12">
            <Card className="bg-card border-border rounded-2xl">
              <CardHeader>
                <CardTitle>Active Bids</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-border bg-background/50">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Bidder</TableHead>
                        <TableHead className="text-muted-foreground">Wallet Address</TableHead>
                        <TableHead className="text-muted-foreground">Token</TableHead>
                        <TableHead className="text-muted-foreground">Amount</TableHead>
                        <TableHead className="text-muted-foreground">Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeBids.map((bid, index) => (
                        <TableRow key={bid.id} className="border-border hover:bg-secondary/30">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={bid.avatar} />
                                <AvatarFallback>
                                  <User className="w-4 h-4" />
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-foreground">
                                {index === 0 ? 'You' : `Bidder ${index + 1}`}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm text-muted-foreground">
                              {bid.walletAddress}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-border text-foreground">
                              {bid.token}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-primary">
                              {bid.token === 'ETH' || bid.token === 'BTC' 
                                ? `${bid.amount} ${bid.token}`
                                : `$${bid.amount.toLocaleString()}`
                              }
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatTimeAgo(bid.timestamp)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <BidErrorModal
        isOpen={showErrorModal}
        errorMessage={errorMessage}
        onTryAgain={handleTryAgain}
        onCancel={handleCancel}
        onOpenChange={setShowErrorModal}
      />
    </div>
  );
}