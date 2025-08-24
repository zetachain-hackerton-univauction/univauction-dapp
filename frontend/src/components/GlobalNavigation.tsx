import { Lightbulb, Wallet, ChevronDown, LogOut, Loader2 } from "lucide-react";
import React, { useState } from "react";

import type { Page } from "../App";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface GlobalNavigationProps {
  connectWallet: () => void;
  disconnectWallet?: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  walletConnected: boolean;
  account?: string | null;
  isLoading?: boolean;
  error?: string | null;
}

export function GlobalNavigation({
  currentPage,
  onNavigate,
  walletConnected,
  connectWallet,
  disconnectWallet,
  account,
  isLoading = false,
  error,
}: GlobalNavigationProps) {
  const [showError, setShowError] = useState(false);

  // Helper function to truncate wallet address
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Show error temporarily
  React.useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 group"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Univauction
          </span>
        </button>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => onNavigate("explore")}
            className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-secondary/50 ${
              currentPage === "explore"
                ? "text-primary bg-secondary/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Explore
            {currentPage === "explore" && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => onNavigate("my-page")}
            className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-secondary/50 ${
              currentPage === "my-page"
                ? "text-primary bg-secondary/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            My Page
            {currentPage === "my-page" && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
            )}
          </button>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Error Display */}
          {showError && error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={() => onNavigate("list-idea")}
            className="relative bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-8 py-2.5 font-medium transition-all duration-300 group overflow-hidden"
          >
            <span className="relative z-10">List Idea</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>

          {/* Wallet Connection */}
          {walletConnected && account ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-2xl border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 px-6 py-2.5 font-medium transition-all duration-300"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {truncateAddress(account)}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(account)}
                  className="cursor-pointer"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Copy Address
                </DropdownMenuItem>
                {disconnectWallet && (
                  <DropdownMenuItem
                    onClick={disconnectWallet}
                    className="cursor-pointer text-red-400 focus:text-red-400"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={connectWallet}
              disabled={isLoading}
              variant="outline"
              className="rounded-2xl border-border px-6 py-2.5 font-medium transition-all duration-300 bg-background hover:bg-secondary/50 text-foreground disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
