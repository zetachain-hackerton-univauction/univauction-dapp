/**
 * Format ETH values for display
 */
export function formatEth(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0';
  
  // For values less than 0.001, show more decimal places
  if (numValue < 0.001) {
    return numValue.toFixed(6);
  }
  
  // For values less than 1, show 4 decimal places
  if (numValue < 1) {
    return numValue.toFixed(4);
  }
  
  // For larger values, show 2-3 decimal places
  return numValue.toFixed(3);
}

/**
 * Parse ETH input value
 */
export function parseEthInput(value: string): number {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}