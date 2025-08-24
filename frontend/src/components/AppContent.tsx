import React, { useEffect, useState } from "react";

import type { AppState, Idea, Page, UserBid } from "../App";
import { useWallet } from "../hooks/useWallet";
import {
  authenticateWithWallet,
  getStoredAuthToken,
  isAuthenticated,
  removeAuthToken,
  storeAuthToken,
} from "../services/auth";
import { staticIdeas, staticUserBids, staticUserIdeas } from "../services/staticData";
import { BiddingPage } from "./BiddingPage";
import { ExplorePage } from "./ExplorePage";
import { GlobalNavigation } from "./GlobalNavigation";
import { IdeaDetailPage } from "./IdeaDetailPage";
import { LandingPage } from "./LandingPage";
import { ListIdeaPage } from "./ListIdeaPage";
import { MyPage } from "./MyPage";
import { Step3WinnerDepositPage } from "./Step3WinnerDepositPage";
import { Step4NFTIssuancePage } from "./Step4NFTIssuancePage";

interface AppContentProps {}

export const AppContent: React.FC<AppContentProps> = () => {
  const {
    account,
    connectWallet: walletConnect,
    disconnectWallet,
    isConnected,
    providers,
    connecting,
    error: walletError,
  } = useWallet();

  const [appState, setAppState] = useState<AppState>({
    currentPage: "landing",
    searchQuery: "",
    selectedCategory: "all",
    selectedFilter: "all",
    selectedIdeaId: null,
    userBids: staticUserBids,
    userIdeas: staticUserIdeas,
    walletConnected: false,
  });

  const [ideas, setIdeas] = useState<Idea[]>(staticIdeas);

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkExistingAuth = () => {
      const isAuth = isAuthenticated();
      setAppState((prev) => ({
        ...prev,
        walletConnected: isAuth && isConnected,
      }));
    };

    checkExistingAuth();
  }, [isConnected]);

  // Handle wallet connection changes
  useEffect(() => {
    if (isConnected && account) {
      handleWalletAuthentication(account);
    } else if (!isConnected) {
      // Wallet disconnected, clear auth
      removeAuthToken();
      setAppState((prev) => ({ ...prev, walletConnected: false }));
    }
  }, [isConnected, account]);

  const handleWalletAuthentication = async (walletAddress: string) => {
    try {
      console.log("🔐 Starting authentication process for:", walletAddress);
      setAuthLoading(true);
      setAuthError(null);

      // Check if we already have a valid token for this address
      const existingToken = getStoredAuthToken();
      if (
        existingToken &&
        existingToken.walletAddress.toLowerCase() ===
          walletAddress.toLowerCase()
      ) {
        console.log("✅ Using existing valid token");
        setAppState((prev) => ({ ...prev, walletConnected: true }));
        setAuthLoading(false);
        return;
      }

      // Clear any old tokens
      if (existingToken) {
        console.log("🗑️ Clearing old token for different address");
        removeAuthToken();
      }

      // Authenticate with the backend (mock API)
      console.log("📡 Calling authentication API...");
      const authResult = await authenticateWithWallet(walletAddress);

      if (authResult.success && authResult.token && authResult.expiresIn) {
        // Store the JWT token
        const tokenData = {
          expiresAt: Date.now() + authResult.expiresIn * 1000,
          token: authResult.token,
          walletAddress: walletAddress.toLowerCase(),
        };

        console.log("💾 Storing authentication token");
        storeAuthToken(tokenData);
        setAppState((prev) => ({ ...prev, walletConnected: true }));
        console.log("🎉 Authentication completed successfully");
      } else {
        console.error("❌ Authentication failed:", authResult.error);
        setAuthError(authResult.error || "Authentication failed");
        // Disconnect wallet on auth failure
        disconnectWallet();
      }
    } catch (error) {
      console.error("❌ Authentication error:", error);
      setAuthError("Authentication failed. Please try again.");
      disconnectWallet();
    } finally {
      setAuthLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      console.log("🔗 Starting wallet connection process...");
      setAuthError(null);

      // Check if providers are available
      if (!providers || providers.length === 0) {
        setAuthError(
          "No wallet providers found. Please install MetaMask or another Web3 wallet."
        );
        return;
      }

      // Use MetaMask as default provider (you can modify this to show a provider selection UI)
      const metamaskProvider = providers.find(
        (p) =>
          p.info.name.toLowerCase().includes("metamask") ||
          p.info.rdns === "io.metamask" ||
          p.info.rdns === "io.metamask.flask"
      );

      if (!metamaskProvider) {
        // Fallback to first available provider
        const firstProvider = providers[0];
        console.log(
          "MetaMask not found, using first available provider:",
          firstProvider.info.name
        );

        const result = await walletConnect(firstProvider);

        if (!result.success) {
          setAuthError(result.error || "Failed to connect wallet");
        }
        return;
      }

      console.log("🦊 Connecting to MetaMask...");
      const result = await walletConnect(metamaskProvider);

      if (!result.success) {
        setAuthError(result.error || "Failed to connect wallet");
      } else {
        console.log("✅ Wallet connected successfully");
      }
      // Authentication will be handled in the useEffect above
    } catch (error) {
      console.error("❌ Wallet connection error:", error);
      setAuthError("Failed to connect wallet. Please try again.");
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    removeAuthToken();
    setAppState((prev) => ({ ...prev, walletConnected: false }));
  };

  const navigateToPage = (
    page: Page,
    ideaId?: string,
    options?: { category?: string; filter?: string }
  ) => {
    setAppState((prev) => ({
      ...prev,
      currentPage: page,
      selectedCategory: options?.category || prev.selectedCategory,
      selectedFilter: options?.filter || prev.selectedFilter,
      selectedIdeaId: ideaId || null,
    }));
  };

  const updateAppState = (updates: Partial<AppState>) => {
    setAppState((prev) => ({ ...prev, ...updates }));
  };

  const addUserBid = (ideaId: string, amount: number) => {
    const newBid: UserBid = {
      amount,
      ideaId,
      status: "Active",
      timestamp: new Date(),
    };
    
    // Update user bids
    setAppState((prev) => ({
      ...prev,
      userBids: [...prev.userBids, newBid],
    }));

    // Update the idea with new bid amount and count
    setIdeas((prevIdeas) =>
      prevIdeas.map((idea) =>
        idea.id === ideaId
          ? {
              ...idea,
              currentBid: amount,
              bidCount: idea.bidCount + 1,
            }
          : idea
      )
    );
  };

  const addUserIdea = (ideaId: string) => {
    setAppState((prev) => ({
      ...prev,
      userIdeas: [...prev.userIdeas, ideaId],
    }));
  };

  const createNewIdea = (newIdea: Partial<Idea>) => {
    const idea: Idea = {
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
      category: "Technology",
      imageUrl: "https://images.unsplash.com/photo-1729839206142-d03c98f921fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGhvbWUlMjB0ZWNobm9sb2d5JTIwQUklMjByb2JvdHxlbnwxfHx8fDE3NTU4NTMwODd8MA&ixlib=rb-4.1.0&q=80&w=400&h=300&fit=crop",
      market: "",
      moat: "",
      problem: "",
      proofHash: `0x${Date.now().toString(16)}`,
      reservePrice: 0.1,
      solution: "",
      summary: "",
      tags: [],
      title: "",
      ...newIdea,
    } as Idea;

    // Add to ideas list
    setIdeas((prev) => [...prev, idea]);
    
    // Add to user's ideas
    addUserIdea(idea.id);
    
    return idea.id;
  };

  const renderCurrentPage = () => {
    const props = {
      addUserBid,
      addUserIdea,
      appState,
      connectWallet,
      ideas,
      onNavigate: navigateToPage,
      updateAppState,
    };

    switch (appState.currentPage) {
      case "landing":
        return <LandingPage {...props} />;
      case "explore":
        return <ExplorePage {...props} />;
      case "my-page":
        return <MyPage {...props} />;
      case "list-idea":
        return (
          <ListIdeaPage 
            onNavigate={navigateToPage} 
            addUserIdea={addUserIdea}
            createNewIdea={createNewIdea}
          />
        );
      case "idea-detail":
        return <IdeaDetailPage {...props} />;
      case "bidding":
        return <BiddingPage {...props} />;
      case "step3-winner-deposit":
        return <Step3WinnerDepositPage {...props} />;
      case "step4-nft-issuance":
        return <Step4NFTIssuancePage {...props} />;
      default:
        return <LandingPage {...props} />;
    }
  };

  // Show loading state during authentication
  const isLoading = connecting || authLoading;
  const displayError = walletError || authError;

  // Add error boundary for debugging
  if (displayError) {
    console.error('App error:', displayError);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <GlobalNavigation
        currentPage={appState.currentPage}
        onNavigate={navigateToPage}
        walletConnected={appState.walletConnected}
        connectWallet={connectWallet}
        disconnectWallet={handleDisconnectWallet}
        account={account}
        isLoading={isLoading}
        error={displayError}
      />
      <main className="min-h-screen">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                {authLoading ? 'Authenticating...' : 'Connecting wallet...'}
              </p>
            </div>
          </div>
        ) : displayError ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-md mx-auto p-6">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Connection Error
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {displayError}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        ) : (
          renderCurrentPage()
        )}
      </main>
    </div>
  );
};
