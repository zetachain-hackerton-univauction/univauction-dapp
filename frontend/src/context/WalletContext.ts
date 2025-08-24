import { createContext } from "react";

import type { EIP6963ProviderDetail } from "../types/wallet";

interface WalletContextType {
  account: string | null;
  connectWallet: (provider: EIP6963ProviderDetail) => Promise<{
    account?: string | null;
    error?: string;
    success: boolean;
  }>;
  connecting: boolean;
  decimalChainId: number | null;
  disconnectWallet: () => void;
  error: string | null;
  isConnected: boolean;
  isSupportedChain: boolean;
  providers: EIP6963ProviderDetail[];
  reconnecting: boolean;
  selectedProvider: EIP6963ProviderDetail | null;
}

export const WalletContext = createContext<WalletContextType>({
  connectWallet: async () => ({ success: false }),
  connecting: false,
  account: null,
  decimalChainId: null,
  disconnectWallet: () => {},
  error: null,
  isConnected: false,
  isSupportedChain: false,
  providers: [],
  reconnecting: false,
  selectedProvider: null,
});
