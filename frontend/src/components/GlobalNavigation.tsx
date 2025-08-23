import React from 'react';
import { Button } from './ui/button';
import { Lightbulb, Wallet } from 'lucide-react';
import type { Page } from '../App';

interface GlobalNavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  walletConnected: boolean;
  connectWallet: () => void;
}

export function GlobalNavigation({ currentPage, onNavigate, walletConnected, connectWallet }: GlobalNavigationProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 group"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            IdeaAuction
          </span>
        </button>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => onNavigate('explore')}
            className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-secondary/50 ${
              currentPage === 'explore' 
                ? 'text-primary bg-secondary/30' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Explore
            {currentPage === 'explore' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => onNavigate('my-page')}
            className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-secondary/50 ${
              currentPage === 'my-page' 
                ? 'text-primary bg-secondary/30' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            My Page
            {currentPage === 'my-page' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
            )}
          </button>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => onNavigate('list-idea')}
            className="relative bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-8 py-2.5 font-medium transition-all duration-300 group overflow-hidden"
          >
            <span className="relative z-10">List Idea</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
          
          <Button
            onClick={connectWallet}
            variant="outline"
            className={`rounded-2xl border-border px-6 py-2.5 font-medium transition-all duration-300 ${
              walletConnected 
                ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20' 
                : 'bg-background hover:bg-secondary/50 text-foreground'
            }`}
          >
            <Wallet className="w-4 h-4 mr-2" />
            {walletConnected ? 'Connected' : 'Connect Wallet'}
          </Button>
        </div>
      </div>
    </header>
  );
}