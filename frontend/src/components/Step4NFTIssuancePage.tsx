import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, CheckCircle, ExternalLink, FileText, Wallet, Shield, Award } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { Page, Idea, AppState } from '../App';

interface Step4NFTIssuancePageProps {
  onNavigate: (page: Page, ideaId?: string) => void;
  ideas: Idea[];
  appState: AppState;
}

export function Step4NFTIssuancePage({ onNavigate, ideas, appState }: Step4NFTIssuancePageProps) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [nftIssued, setNftIssued] = useState(false);
  
  const selectedIdea = ideas.find(idea => idea.id === appState.selectedIdeaId);

  useEffect(() => {
    // Simulate NFT issuance process
    const timer = setTimeout(() => {
      setIsProcessing(false);
      setNftIssued(true);
      toast.success('IdeaProof NFT Successfully Issued!');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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

  const nftTokenId = `IP-${selectedIdea.id.toUpperCase()}-${Date.now().toString().slice(-6)}`;
  const issuanceDate = new Date().toLocaleDateString();
  const zetaScanUrl = `https://zetascan.com/nft/${nftTokenId}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Stepper */}
      <div className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('step3-winner-deposit', selectedIdea.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Deposit
            </Button>
          </div>

          {/* Stepper - All 4 steps completed */}
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
              <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <div className="ml-3">
                <div className="text-sm text-primary">Step 3</div>
                <div className="text-sm text-muted-foreground">Winner Deposit</div>
              </div>
            </div>
            
            <div className="flex-1 h-px bg-primary mx-4"></div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary border-2 border-primary flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="ml-3">
                <div className="text-sm text-primary">Step 4</div>
                <div className="text-sm text-foreground">NFT Issuance</div>
              </div>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="text-center">
            <h1 className="mb-4">Step 4 — NFT Issuance</h1>
            <p className="text-xl text-muted-foreground">Your IdeaProof NFT has been successfully issued</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Payment Confirmation */}
          <Card className="bg-card border-border rounded-2xl">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl">✅ Payment Received</h2>
                <p className="text-muted-foreground text-lg">
                  Escrow deposit of ${selectedIdea.currentBid} ZETA has been successfully received and verified
                </p>
                <div className="text-sm text-muted-foreground">
                  Transaction Hash: 0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Proof Certificate & Transaction Summary */}
            <div className="space-y-8">
              <Card className="bg-card border-border rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Proof Certificate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Issued Hash</span>
                      <span className="text-primary font-mono text-xs">
                        {selectedIdea.proofHash.slice(0, 12)}...
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Blockchain</span>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        ZetaChain
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Issue Date</span>
                      <span className="text-foreground">{issuanceDate}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Certificate ID</span>
                      <span className="text-foreground font-mono text-sm">CERT-{nftTokenId}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-border text-foreground hover:bg-secondary/50 rounded-xl"
                      onClick={() => window.open(zetaScanUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on ZetaScan
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Summary */}
              <Card className="bg-card border-border rounded-2xl">
                <CardHeader>
                  <CardTitle>Transaction Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="text-center space-y-2">
                      <div className="text-2xl">${selectedIdea.currentBid}</div>
                      <div className="text-sm text-muted-foreground">Final Bid Amount</div>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <div className="text-2xl">{selectedIdea.bidCount}</div>
                      <div className="text-sm text-muted-foreground">Total Bids</div>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <div className="text-2xl">{selectedIdea.views}</div>
                      <div className="text-sm text-muted-foreground">Total Views</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <div className="text-center space-y-2">
                      <h3 className="text-lg">{selectedIdea.title}</h3>
                      <p className="text-muted-foreground">{selectedIdea.summary}</p>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {selectedIdea.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - NFT Confirmation */}
            <Card className="bg-card border-border rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  NFT Issuance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isProcessing ? (
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground">Issuing NFT...</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 text-center">
                      <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                        <Award className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-lg mb-2">🎉 IdeaProof NFT Successfully Issued</h3>
                      <p className="text-sm text-muted-foreground">
                        Your unique NFT has been minted and transferred to your wallet
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">NFT Token ID</span>
                        <span className="text-primary font-mono text-sm">{nftTokenId}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Contract</span>
                        <span className="text-foreground font-mono text-xs">0xIDEA...PROOF</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Owner</span>
                        <span className="text-foreground font-mono text-xs">0x1a2b...c3d4</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Royalty</span>
                        <span className="text-foreground">5%</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border space-y-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-border text-foreground hover:bg-secondary/50 rounded-xl"
                        onClick={() => window.open(`https://opensea.io/assets/zeta/${nftTokenId}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on OpenSea
                      </Button>
                      
                      <Button
                        onClick={() => onNavigate('my-page')}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                      >
                        <Wallet className="w-4 h-4 mr-2" />
                        View in My Portfolio
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}