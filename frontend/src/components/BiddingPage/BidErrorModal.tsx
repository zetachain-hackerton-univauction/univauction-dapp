import React from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface BidErrorModalProps {
  isOpen: boolean;
  errorMessage: string;
  onTryAgain: () => void;
  onCancel: () => void;
  onOpenChange: (open: boolean) => void;
}

export function BidErrorModal({ 
  isOpen, 
  errorMessage, 
  onTryAgain, 
  onCancel, 
  onOpenChange 
}: BidErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border rounded-2xl max-w-md mx-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-destructive/20 rounded-full">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <DialogTitle className="text-center text-xl text-foreground">
            Invalid Bid
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground leading-relaxed">
            {errorMessage}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 pt-2">
          <div className="flex gap-3">
            <Button
              onClick={onTryAgain}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
              Try Again
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-secondary/50 rounded-xl">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}