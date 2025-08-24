import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Search, Filter, Clock, Eye, Star, TrendingUp, SortAsc } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Page, Idea, AppState } from '../App';

interface ExplorePageProps {
  onNavigate: (page: Page, ideaId?: string, options?: { category?: string; filter?: string }) => void;
  ideas: Idea[];
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
}

export function ExplorePage({ onNavigate, ideas, appState, updateAppState }: ExplorePageProps) {
  const [sortBy, setSortBy] = useState<'newest' | 'price' | 'bids' | 'ending'>('newest');

  const categories = ['all', 'AI & Machine Learning', 'E-commerce', 'Blockchain', 'Education', 'Healthcare'];

  const filteredAndSortedIdeas = useMemo(() => {
    let filtered = ideas;

    // Apply search filter
    if (appState.searchQuery.trim()) {
      filtered = filtered.filter(idea =>
        idea.title.toLowerCase().includes(appState.searchQuery.toLowerCase()) ||
        idea.summary.toLowerCase().includes(appState.searchQuery.toLowerCase()) ||
        idea.tags.some(tag => tag.toLowerCase().includes(appState.searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (appState.selectedCategory !== 'all') {
      filtered = filtered.filter(idea => idea.category === appState.selectedCategory);
    }

    // Apply status filter
    if (appState.selectedFilter !== 'all') {
      switch (appState.selectedFilter) {
        case 'active':
          filtered = filtered.filter(idea => idea.isActive);
          break;
        case 'ended':
          filtered = filtered.filter(idea => idea.auctionEnded);
          break;
        case 'newest':
          // Show all, but will be sorted by newest
          break;
        case 'volume':
          // Show all, but will be sorted by volume
          break;
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.endTime.getTime() - a.endTime.getTime());
        break;
      case 'price':
        filtered.sort((a, b) => b.currentBid - a.currentBid);
        break;
      case 'bids':
        filtered.sort((a, b) => b.bidCount - a.bidCount);
        break;
      case 'ending':
        filtered.sort((a, b) => a.endTime.getTime() - b.endTime.getTime());
        break;
    }

    return filtered;
  }, [ideas, appState.searchQuery, appState.selectedCategory, appState.selectedFilter, sortBy]);

  const handleSearchChange = (value: string) => {
    updateAppState({ searchQuery: value });
  };

  const handleCategoryChange = (value: string) => {
    updateAppState({ selectedCategory: value });
  };

  const handleFilterChange = (value: string) => {
    updateAppState({ selectedFilter: value });
  };

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Explore Ideas
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover innovative ideas from creators worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card/50 border border-border backdrop-blur-sm rounded-3xl p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Search */}
            <div className="lg:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search ideas, tags, or categories..."
                value={appState.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-12 rounded-2xl border-border bg-input-background/50 focus:bg-input-background text-foreground h-12"
              />
            </div>
            
            {/* Category Filter */}
            <div className="lg:col-span-3">
              <Select value={appState.selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="rounded-2xl border-border bg-input-background/50 h-12">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Status Filter */}
            <div className="lg:col-span-2">
              <Select value={appState.selectedFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="rounded-2xl border-border bg-input-background/50 h-12">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Ideas</SelectItem>
                  <SelectItem value="active">Active Auctions</SelectItem>
                  <SelectItem value="ended">Ended Auctions</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="volume">High Volume</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Sort */}
            <div className="lg:col-span-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="rounded-2xl border-border bg-input-background/50 h-12">
                  <SortAsc className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price">Highest Bid</SelectItem>
                  <SelectItem value="bids">Most Bids</SelectItem>
                  <SelectItem value="ending">Ending Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Active filters display */}
          {(appState.searchQuery || appState.selectedCategory !== 'all' || appState.selectedFilter !== 'all') && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              {appState.searchQuery && (
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  Search: {appState.searchQuery}
                </Badge>
              )}
              {appState.selectedCategory !== 'all' && (
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  Category: {appState.selectedCategory}
                </Badge>
              )}
              {appState.selectedFilter !== 'all' && (
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  Filter: {appState.selectedFilter}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateAppState({ searchQuery: '', selectedCategory: 'all', selectedFilter: 'all' })}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-8">
          <p className="text-muted-foreground">
            Showing {filteredAndSortedIdeas.length} of {ideas.length} ideas
          </p>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredAndSortedIdeas.map((idea) => (
            <Card
              key={idea.id}
              className="cursor-pointer hover:scale-[1.02] transition-all duration-300 rounded-3xl border-border bg-card/30 backdrop-blur-sm overflow-hidden group relative"
              onClick={() => onNavigate('idea-detail', idea.id)}
            >
              <div className="relative">
                <ImageWithFallback
                  src={idea.imageUrl}
                  alt={idea.title}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                
                {/* Status badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {idea.bidCount > 10 && (
                    <Badge className="bg-primary/90 text-primary-foreground border-0 backdrop-blur-sm">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Hot
                    </Badge>
                  )}
                  {idea.auctionEnded ? (
                    <Badge className="bg-gray-500/90 text-white border-0 backdrop-blur-sm">
                      Ended
                    </Badge>
                  ) : (
                    <Badge className="bg-green-500/90 text-white border-0 backdrop-blur-sm">
                      Live
                    </Badge>
                  )}
                </div>

                {/* Category badge */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-secondary/90 text-secondary-foreground hover:bg-secondary border-border backdrop-blur-sm">
                    {idea.category}
                  </Badge>
                </div>

                {/* Time left or status */}
                <div className="absolute bottom-4 right-4">
                  <div className="bg-background/90 backdrop-blur-sm rounded-xl px-3 py-2 text-xs font-medium border border-border">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {idea.auctionEnded ? 'Ended' : idea.timeLeft}
                  </div>
                </div>

                {/* Preview indicator */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-background/90 backdrop-blur-sm rounded-xl px-3 py-2 text-xs font-medium border border-border">
                    <Eye className="w-3 h-3 inline mr-1" />
                    Preview
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3 line-clamp-1 text-foreground">
                  {idea.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                  {idea.summary}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {idea.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-secondary/50 text-secondary-foreground">
                      {tag}
                    </Badge>
                  ))}
                  {idea.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs bg-secondary/50 text-secondary-foreground">
                      +{idea.tags.length - 2}
                    </Badge>
                  )}
                </div>

                {/* Metrics */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {idea.auctionEnded ? 'Final Bid' : 'Current Bid'}
                    </span>
                    <span className="font-semibold text-primary">{idea.currentBid}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Review Score</span>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                      <span className="font-medium text-foreground">{idea.reviewScore}/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bids</span>
                    <span className="font-medium text-foreground">{idea.bidCount}</span>
                  </div>
                </div>
              </CardContent>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {filteredAndSortedIdeas.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No ideas found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or browse all ideas
            </p>
            <Button
              onClick={() => updateAppState({ searchQuery: '', selectedCategory: 'all', selectedFilter: 'all' })}
              variant="outline"
              className="rounded-2xl"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredAndSortedIdeas.length > 0 && (
          <div className="text-center mb-12">
            <Button
              variant="outline"
              className="rounded-2xl border-border bg-background/50 hover:bg-card/50 text-foreground px-8 py-3"
            >
              Load More Ideas
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}