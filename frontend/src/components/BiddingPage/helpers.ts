export const formatTimeAgo = (timestamp: Date): string => {
  const hours = Math.floor(
    (Date.now() - timestamp.getTime()) / (1000 * 60 * 60)
  );
  return `${hours}h ago`;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export const validateBidAmount = (
  bidAmount: string,
  userBalance: number,
  currentBid: number
) => {
  if (!bidAmount) return null;

  const amount = parseFloat(bidAmount);

  // Validate numeric input
  if (isNaN(amount) || amount <= 0) {
    return "Your bid exceeds your available balance or is not a valid amount. Please try again.";
  }

  // Check if bid exceeds user balance
  if (amount > userBalance) {
    return "Your bid exceeds your available balance or is not a valid amount. Please try again.";
  }

  // Check if bid is higher than current bid
  if (amount <= currentBid) {
    return "Bid must be higher than current bid";
  }

  return null;
};
