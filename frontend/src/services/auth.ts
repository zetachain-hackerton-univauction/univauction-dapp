/**
 * Authentication service for JWT token management
 */

export interface AuthTokenData {
  token: string;
  expiresAt: number;
  walletAddress: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  expiresIn?: number;
  error?: string;
}

/**
 * Static authentication with wallet address
 * No API calls - uses local mock data
 */
export const authenticateWithWallet = async (
  walletAddress: string,
  signature?: string
): Promise<LoginResponse> => {
  console.log('🔐 Starting authentication for wallet:', walletAddress);
  
  // Simulate API delay for realistic UX
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    // Validate wallet address format
    if (!walletAddress || !walletAddress.startsWith('0x') || walletAddress.length !== 42) {
      throw new Error('Invalid wallet address format');
    }

    // Create mock JWT token
    const payload = {
      sub: walletAddress.toLowerCase(),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      wallet: walletAddress.toLowerCase(),
      role: 'user'
    };
    
    const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(payload))}.mock_signature_${Date.now()}`;

    console.log('✅ Authentication successful for wallet:', walletAddress);
    
    return {
      success: true,
      token: mockToken,
      expiresIn: 24 * 60 * 60 // 24 hours in seconds
    };
  } catch (error) {
    console.error('❌ Authentication failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed'
    };
  }
};

/**
 * Store authentication token in localStorage
 */
export const storeAuthToken = (tokenData: AuthTokenData): void => {
  try {
    localStorage.setItem('auth_token', JSON.stringify(tokenData));
  } catch (error) {
    console.error('Failed to store auth token:', error);
  }
};

/**
 * Retrieve authentication token from localStorage
 */
export const getStoredAuthToken = (): AuthTokenData | null => {
  try {
    const stored = localStorage.getItem('auth_token');
    if (!stored) return null;
    
    const tokenData: AuthTokenData = JSON.parse(stored);
    
    // Check if token is expired
    if (Date.now() > tokenData.expiresAt) {
      removeAuthToken();
      return null;
    }
    
    return tokenData;
  } catch (error) {
    console.error('Failed to retrieve auth token:', error);
    return null;
  }
};

/**
 * Remove authentication token from localStorage
 */
export const removeAuthToken = (): void => {
  try {
    localStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Failed to remove auth token:', error);
  }
};

/**
 * Check if user is currently authenticated
 */
export const isAuthenticated = (): boolean => {
  const tokenData = getStoredAuthToken();
  return tokenData !== null;
};

/**
 * Get the current user's wallet address from stored token
 */
export const getCurrentUserAddress = (): string | null => {
  const tokenData = getStoredAuthToken();
  return tokenData?.walletAddress || null;
};