import protocol from "@zetachain/protocol-contracts";
import { getAddress } from "@zetachain/protocol-contracts";
import GatewayZEVM from "@zetachain/protocol-contracts/abi/GatewayZEVM.sol/GatewayZEVM.json";
import { ethers } from "ethers";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Crown,
  Eye,
  Trophy,
  User,
  Wallet,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner@2.0.3";

import type { AppState, Idea, Page } from "../App";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
const gatewayAddress = getAddress("gateway", "sepolia_testnet");

// Contract addresses (these would be configured per network)
const CONTRACTS = {
  CONNECTED: "0xaD4Ec4cbE903DDA13fF969c9199411E2b23a1046",
  GATEWAY_SEPOLIA: "0x6c533f7fe93fae114d0954697069df33c9b74fd7", // "0x0c487a766110c85d301d96e33579c5b317fa4995",
  SETH_ZRC20: "0x05BA149A7bd6dC1F937fA9046A9e05C05f3b18b0",
  SWAP_MINT_UNIVERSAL: "0x0c7e3D462385148d4A5803D371AD6bb3Ae17e513",
  SWAP_ONLY_UNIVERSAL: "0x6F0a1bebeeA75241cbdDBF65c779E6ac52109265",
  USDC_SEPOLIA_ZRC20: "0xcC683A782f4B30c138787CB5576a86AF66fdc31d",
};

interface TokenOption {
  address: string;
  decimals: number;
  icon: string;
  symbol: string;
}

const SUPPORTED_TOKENS: TokenOption[] = [
  {
    address: CONTRACTS.SWAP_MINT_UNIVERSAL,
    decimals: 18,
    icon: "Ξ",
    symbol: "ETH",
  },
];

interface Step3WinnerDepositPageProps {
  appState: AppState;
  ideas: Idea[];
  onNavigate: (page: Page, ideaId?: string) => void;
}

export function Step3WinnerDepositPage({
  onNavigate,
  ideas,
  appState,
}: Step3WinnerDepositPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenOption>(
    SUPPORTED_TOKENS[0]
  );
  const [depositAmount, setDepositAmount] = useState("");
  const [estimatedETH, setEstimatedETH] = useState("0");
  const [swapFee, setSwapFee] = useState("0");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const selectedIdea = ideas.find(
    (idea) => idea.id === appState.selectedIdeaId
  );

  if (!selectedIdea) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4">Idea not found</h2>
          <Button onClick={() => onNavigate("explore")}>Back to Explore</Button>
        </div>
      </div>
    );
  }

  /**
   * Show confirmation modal before proceeding with deposit
   */
  const handleDepositClick = () => {
    // Validate deposit amount first
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid deposit amount");
      return;
    }

    // Show confirmation modal with ETH conversion
    setShowConfirmModal(true);
  };

  const handleDeposit = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to continue");
      return;
    }

    try {
      // 1) 연결된 지갑 가져오기
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      // 2) 입력할 ETH 수량
      const ethValue = ethers.utils.parseEther("0.01"); // 예: 0.01 ETH

      // 3) Sepolia Gateway 컨트랙트 인스턴스
      const gateway = new ethers.Contract(
        gatewayAddress ?? "", // Sepolia Gateway 주소
        GatewayZEVM.abi, // Gateway ABI (zetachain npm 패키지 or json)
        signer
      );

      console.log("gateway: ", gateway);

      // 4) SwapOnlyUniversal 주소 (ZetaChain에 배포된 UniversalContract)
      const target = CONTRACTS.SWAP_ONLY_UNIVERSAL;

      // 5) message payload: (outputZRC20)
      const message = ethers.utils.defaultAbiCoder.encode(
        ["address"],
        [CONTRACTS.USDC_SEPOLIA_ZRC20] // 예: ETH → USDC.zrc20 로 스왑
      );

      // 6) revert options
      const revertOptions = {
        abortAddress: ethers.constants.AddressZero,
        callOnRevert: false,
        onRevertGasLimit: 200000,
        revertAddress: userAddress,
        revertMessage: ethers.utils.toUtf8Bytes("Swap failed"),
      };

      // 7) depositAndCall 실행
      const tx = await gateway.depositAndCall(
        target,
        ethValue, // amount (ETH 수량)
        CONTRACTS.SETH_ZRC20, // inputZRC20 (ETH.zrc20 주소)
        message, // payload
        revertOptions,
        { value: ethValue } // ETH 전송
      );

      console.log("Tx sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("Tx mined:", receipt);

      if (receipt.status === 1) {
        alert("🎉 Swap successful! Check ZetaChain explorer for details.");
      } else {
        throw new Error("Transaction failed");
      }
    } catch (err) {
      console.error(err);
      alert("Swap failed: " + (err.message || err));
    }
  };

  /**
   * Estimate ETH amount after swap (simplified calculation)
   * In production, this would call a price oracle or DEX router
   */
  const estimateSwapOutput = async (token: TokenOption, amount: string) => {
    if (!amount || parseFloat(amount) <= 0) {
      setEstimatedETH("0");
      setSwapFee("0");
      return;
    }

    // Simplified price estimation (in production, use real price feeds)
    const mockPrices: { [key: string]: number } = {
      ETH: 1.0,
    };

    const price = mockPrices[token.symbol] || 1;
    const ethAmount = parseFloat(amount) * price;
    const fee = ethAmount * 0.003; // 0.3% swap fee

    setEstimatedETH((ethAmount - fee).toFixed(4));
    setSwapFee(fee.toFixed(2));
  };

  // Update estimates when token or amount changes
  useEffect(() => {
    estimateSwapOutput(selectedToken, depositAmount);
  }, [selectedToken, depositAmount]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Stepper */}
      <div className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("bidding", selectedIdea.id)}
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
                <div className="text-sm text-muted-foreground">
                  NFT Issuance
                </div>
              </div>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="text-center">
            <h1 className="mb-4">Step 3 — Winner Deposit</h1>
            <p className="text-xl text-muted-foreground">
              Deposit ETH (Sepolia) to mint your IdeaProof NFT
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* ZetaChain Integration Notice */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    ⚡ ETH (Sepolia) Deposit via ZetaChain
                  </h3>
                  <p className="text-muted-foreground">
                    Currently supporting ETH deposits from Sepolia testnet.
                    ZetaChain will automatically convert your ETH to ZRC-20
                    tokens, swap them to ETH, and mint your NFT with the final
                    value.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                      <div className="text-sm text-muted-foreground">
                        Winner
                      </div>
                      <div className="font-mono text-sm">
                        0x1a2b3c4d5e6f7890...a1b2c3d4
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Winning Bid</span>
                      <span className="text-2xl text-primary">
                        {selectedIdea.currentBid} ETH
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Required Deposit
                      </span>
                      <Badge
                        variant="outline"
                        className="border-border text-foreground"
                      >
                        ≥ {selectedIdea.currentBid} ETH equivalent
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Swap Estimation */}
              {selectedToken.symbol !== "ETH" && depositAmount && (
                <Card className="bg-card border-border rounded-2xl">
                  <CardHeader>
                    <CardTitle>Swap Estimation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Input</span>
                      <span className="text-foreground">
                        {depositAmount} {selectedToken.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Swap Fee (0.3%)
                      </span>
                      <span className="text-foreground">{swapFee} ETH</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Estimated ETH
                      </span>
                      <span className="text-primary text-lg">
                        {estimatedETH} ETH
                      </span>
                    </div>
                    {parseFloat(estimatedETH) < selectedIdea.currentBid && (
                      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                        <p className="text-sm text-destructive">
                          ⚠️ Estimated output is below required amount. Please
                          increase your deposit.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

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
                    <span className="text-foreground">
                      {selectedIdea.bidCount} bids
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Reserve Price
                      </span>
                    </div>
                    <span className="text-foreground">
                      {selectedIdea.reservePrice} ETH
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Total Views</span>
                    </div>
                    <span className="text-foreground">
                      {selectedIdea.views} views
                    </span>
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

            {/* Right Column - Deposit Interface */}
            <div>
              <Card className="bg-card border-border rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary" />
                    ETH (Sepolia) Deposit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Token Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Select Token</label>
                    <div className="grid grid-cols-2 gap-2">
                      {SUPPORTED_TOKENS.map((token) => (
                        <button
                          key={token.symbol}
                          onClick={() => setSelectedToken(token)}
                          className={`p-3 rounded-xl border transition-colors ${
                            selectedToken.symbol === token.symbol
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{token.icon}</span>
                            <span className="font-medium">{token.symbol}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Deposit Amount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full p-3 border border-border rounded-xl bg-background focus:border-primary focus:outline-none"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {selectedToken.symbol}
                      </div>
                    </div>
                  </div>

                  {/* Deposit Summary */}
                  <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Deposit Token
                      </span>
                      <span className="text-sm font-medium">
                        {selectedToken.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Final NFT Value
                      </span>
                      <span className="text-sm font-medium">
                        {selectedToken.symbol === "ETH"
                          ? depositAmount || "0"
                          : estimatedETH}{" "}
                        ETH
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Processing
                      </span>
                      <span className="text-sm font-medium">
                        Cross-chain via ZetaChain
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleDepositClick}
                    disabled={
                      isProcessing ||
                      !depositAmount ||
                      parseFloat(depositAmount) <= 0
                    }
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl py-3"
                  >
                    {isProcessing
                      ? "Processing Deposit..."
                      : `Deposit ${selectedToken.symbol} & Mint NFT`}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Your tokens will be deposited to ZetaChain, automatically
                    swapped to ETH if needed, and used to mint your IdeaProof
                    NFT
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-primary" />
              </div>

              <h3 className="text-xl font-semibold">Confirm Deposit</h3>

              <div className="space-y-3 text-left">
                <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Deposit Amount
                    </span>
                    <span className="font-medium">
                      {depositAmount} {selectedToken.symbol}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Current ETH Price
                    </span>
                    <span className="font-medium">1.0 ETH</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Swap Fee (0.3%)
                    </span>
                    <span className="font-medium">{swapFee} ETH</span>
                  </div>

                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Final ETH Value
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {estimatedETH} ETH
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/30 rounded-xl p-3">
                  <p className="text-sm text-muted-foreground">
                    Your {depositAmount} ETH will be deposited to ZetaChain,
                    automatically swapped to {estimatedETH} ETH, and used to
                    mint your IdeaProof NFT.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeposit}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Confirm Deposit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
