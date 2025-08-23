import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { ArrowLeft, ArrowRight, Upload, Check, FileText, Settings, Gavel, Shield, DollarSign, Clock, Lightbulb, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import type { Page } from '../App';

interface ListIdeaPageProps {
  onNavigate: (page: Page) => void;
  addUserIdea: (ideaId: string) => void;
}

export function ListIdeaPage({ onNavigate, addUserIdea }: ListIdeaPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    category: '',
    tags: [] as string[],
    files: [] as File[],
    problem: '',
    solution: '',
    market: '',
    moat: '',
    isExclusive: true,
    reservePrice: '',
    duration: '7',
    deposit: '100',
  });

  const steps = [
    { number: 1, title: 'Info', icon: FileText, description: 'Basic information about your idea' },
    { number: 2, title: 'Upload', icon: Upload, description: 'Upload files and generate proof' },
    { number: 3, title: 'License', icon: Settings, description: 'Set licensing terms' },
    { number: 4, title: 'Launch', icon: Gavel, description: 'Configure auction parameters' },
  ];

  const categories = [
    'AI & Machine Learning',
    'Blockchain',
    'Healthcare',
    'E-commerce',
    'Education',
    'FinTech',
    'IoT',
    'Mobile Apps',
    'Web Applications',
    'SaaS',
  ];

  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.summary && formData.category;
      case 2:
        return formData.problem && formData.solution && formData.market && formData.moat;
      case 3:
        return true; // License step always allows proceed
      case 4:
        return formData.reservePrice && formData.duration;
      default:
        return false;
    }
  };

  const submitIdea = () => {
    const newIdeaId = `user-idea-${Date.now()}`;
    addUserIdea(newIdeaId);
    setIsSubmitted(true);
    toast.success('Idea listed successfully! Your auction is now live.');
  };

  const getStepProgress = () => (currentStep / 4) * 100;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background pt-8">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Check className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">Idea Listed Successfully!</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your idea "{formData.title}" has been minted as an NFT and is now live on the auction platform. 
              Bidders can start placing bids immediately.
            </p>
            
            <Card className="max-w-md mx-auto rounded-3xl border-border bg-card/30 backdrop-blur-sm mb-8">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Idea NFT ID:</span>
                    <span className="font-mono text-primary">#ID{Date.now().toString().slice(-6)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Reserve Price:</span>
                    <span className="font-semibold text-foreground">${formData.reservePrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Auction Duration:</span>
                    <span className="font-semibold text-foreground">{formData.duration} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">License Type:</span>
                    <span className="font-semibold text-foreground">
                      {formData.isExclusive ? 'Exclusive' : 'Non-Exclusive'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
              <Button
                onClick={() => onNavigate('my-page')}
                className="bg-primary hover:bg-primary/90 rounded-2xl px-8"
              >
                View in My Ideas
              </Button>
              <Button
                onClick={() => onNavigate('explore')}
                variant="outline"
                className="rounded-2xl border-border px-8"
              >
                Browse Other Ideas
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <Label htmlFor="title" className="text-foreground text-base">Idea Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter a compelling title for your idea"
                className="mt-3 rounded-2xl border-border bg-input-background text-foreground h-12"
              />
            </div>
            
            <div>
              <Label htmlFor="summary" className="text-foreground text-base">Executive Summary *</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Provide a brief overview of your idea (elevator pitch)"
                maxLength={500}
                className="mt-3 rounded-2xl border-border bg-input-background text-foreground resize-none"
                rows={6}
              />
              <div className="text-right text-sm text-muted-foreground mt-2">
                {formData.summary.length}/500
              </div>
            </div>

            <div>
              <Label htmlFor="category" className="text-foreground text-base">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="mt-3 rounded-2xl border-border bg-input-background h-12">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tags" className="text-foreground text-base">Tags</Label>
              <div className="flex gap-3 mt-3">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a relevant tag"
                  className="rounded-2xl border-border bg-input-background h-12"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button onClick={addTag} variant="outline" className="rounded-2xl border-border bg-background hover:bg-secondary px-6">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 px-3 py-1"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div>
              <Label className="text-foreground text-base">Upload Supporting Files</Label>
              <div className="mt-4 border-2 border-dashed border-border rounded-2xl p-12 text-center bg-card/30">
                <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                <p className="text-muted-foreground mb-6 text-lg">
                  Upload documents, prototypes, mockups, or any supporting materials
                </p>
                <Button variant="outline" className="rounded-2xl border-border bg-background hover:bg-secondary px-8">
                  Choose Files
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Supported formats: PDF, DOC, PNG, JPG, ZIP (Max 50MB)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Label htmlFor="problem" className="text-foreground text-base">Problem Statement *</Label>
                <Textarea
                  id="problem"
                  value={formData.problem}
                  onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                  placeholder="What problem does your idea solve?"
                  className="mt-3 rounded-2xl border-border bg-input-background text-foreground resize-none"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="solution" className="text-foreground text-base">Solution Overview *</Label>
                <Textarea
                  id="solution"
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  placeholder="How does your idea solve the problem?"
                  className="mt-3 rounded-2xl border-border bg-input-background text-foreground resize-none"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="market" className="text-foreground text-base">Market Opportunity *</Label>
                <Textarea
                  id="market"
                  value={formData.market}
                  onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                  placeholder="What's the market size and opportunity?"
                  className="mt-3 rounded-2xl border-border bg-input-background text-foreground resize-none"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="moat" className="text-foreground text-base">Competitive Advantage *</Label>
                <Textarea
                  id="moat"
                  value={formData.moat}
                  onChange={(e) => setFormData({ ...formData, moat: e.target.value })}
                  placeholder="What makes your idea unique?"
                  className="mt-3 rounded-2xl border-border bg-input-background text-foreground resize-none"
                  rows={4}
                />
              </div>
            </div>

            <Card className="rounded-3xl border-border bg-primary/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-lg">Blockchain Proof Generated</p>
                    <p className="text-sm text-muted-foreground">
                      Your idea content has been hashed and timestamped on the blockchain for proof of originality
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div>
              <Label className="text-foreground text-base">License Type</Label>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-6 border border-border rounded-2xl bg-card/30 backdrop-blur-sm">
                  <div className="flex items-center space-x-4">
                    <Switch
                      checked={formData.isExclusive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isExclusive: checked })}
                    />
                    <div>
                      <p className="font-medium text-foreground text-lg">Exclusive License</p>
                      <p className="text-sm text-muted-foreground">
                        Winner gets exclusive rights to use, develop, and commercialize the idea
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-500">Higher Value</div>
                    <div className="text-sm text-muted-foreground">Recommended</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-6 border border-border rounded-2xl bg-card/30 backdrop-blur-sm">
                  <div className="flex items-center space-x-4">
                    <Switch
                      checked={!formData.isExclusive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isExclusive: !checked })}
                    />
                    <div>
                      <p className="font-medium text-foreground text-lg">Non-Exclusive License</p>
                      <p className="text-sm text-muted-foreground">
                        Winner gets usage rights, but you can license the idea to others
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-blue-500">Lower Risk</div>
                    <div className="text-sm text-muted-foreground">Multiple sales</div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="rounded-3xl border-border bg-secondary/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-lg">Smart Contract Protection</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      All licensing terms are automatically enforced through smart contracts on the blockchain.
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Automatic royalty distribution</li>
                      <li>• Immutable ownership records</li>
                      <li>• Transparent usage tracking</li>
                      <li>• Legal enforceability in 150+ countries</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Label htmlFor="reserve-price" className="text-foreground text-base">Reserve Price (USD) *</Label>
                <div className="relative mt-3">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    id="reserve-price"
                    type="number"
                    value={formData.reservePrice}
                    onChange={(e) => setFormData({ ...formData, reservePrice: e.target.value })}
                    placeholder="1000"
                    className="pl-12 rounded-2xl border-border bg-input-background text-foreground h-12"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Minimum price you're willing to accept
                </p>
              </div>

              <div>
                <Label htmlFor="duration" className="text-foreground text-base">Auction Duration *</Label>
                <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                  <SelectTrigger className="mt-3 rounded-2xl border-border bg-input-background h-12">
                    <Clock className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="7">7 Days (Recommended)</SelectItem>
                    <SelectItem value="14">14 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="rounded-3xl border-border bg-yellow-500/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-yellow-500 mt-1" />
                  <div>
                    <p className="font-medium text-foreground text-lg mb-2">Listing Requirements</p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• <strong>Listing Fee:</strong> $50 (refunded if reserve price is met)</li>
                      <li>• <strong>Platform Fee:</strong> 5% of final sale price</li>
                      <li>• <strong>Escrow Deposit:</strong> ${formData.deposit} (returned after auction)</li>
                      <li>• <strong>Identity Verification:</strong> Required for auctions over $10,000</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border bg-card/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-primary" />
                  Auction Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Title:</span>
                      <span className="font-medium text-foreground max-w-48 truncate">{formData.title || 'Untitled'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium text-foreground">{formData.category || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">License:</span>
                      <span className="font-medium text-foreground">{formData.isExclusive ? 'Exclusive' : 'Non-Exclusive'}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Reserve Price:</span>
                      <span className="font-medium text-primary">${formData.reservePrice || '0'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium text-foreground">{formData.duration} days</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Tags:</span>
                      <span className="font-medium text-foreground">{formData.tags.length} tags</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <Button
            onClick={() => onNavigate('landing')}
            variant="ghost"
            className="mb-6 rounded-2xl hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            List Your Idea
          </h1>
          <p className="text-xl text-muted-foreground">
            Submit your innovative idea to the global auction marketplace
          </p>
        </div>

        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex items-center ${
                  step.number < steps.length ? 'flex-1' : ''
                }`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      currentStep >= step.number
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-sm font-medium text-foreground">{step.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{step.description}</div>
                  </div>
                </div>
                {step.number < steps.length && (
                  <div className="flex-1 mx-6">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentStep > step.number ? 'bg-primary' : 'bg-secondary'
                      }`}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Progress value={getStepProgress()} className="h-3 bg-secondary rounded-full" />
        </div>

        {/* Form Content */}
        <Card className="rounded-3xl border-border bg-card/30 backdrop-blur-sm mb-12">
          <CardContent className="p-12">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mb-12">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="outline"
            className="rounded-2xl px-8 py-3 border-border bg-background hover:bg-secondary disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < 4 ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="bg-primary hover:bg-primary/90 rounded-2xl px-8 py-3 disabled:opacity-50"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={submitIdea}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl px-8 py-3 disabled:opacity-50"
            >
              <Gavel className="w-4 h-4 mr-2" />
              Launch Auction
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}