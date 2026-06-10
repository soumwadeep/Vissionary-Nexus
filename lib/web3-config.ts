"use client"

import { http, createConfig, createStorage } from "wagmi"
import { mainnet, sepolia, polygon, arbitrum } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"

// Somnia Shannon Testnet Configuration (current official testnet)
export const somniaTestnet = {
  id: 50312,
  name: "Somnia Shannon Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Somnia Test Token",
    symbol: "STT",
  },
  rpcUrls: {
    default: { http: ["https://dream-rpc.somnia.network"] },
  },
  blockExplorers: {
    default: { name: "Somnia Shannon Explorer", url: "https://shannon-explorer.somnia.network" },
  },
  testnet: true,
} as const

// Somnia Mainnet Configuration (future-ready)
export const somniaMainnet = {
  id: 5031,
  name: "Somnia",
  nativeCurrency: {
    decimals: 18,
    name: "Somnia Token",
    symbol: "SOMI",
  },
  rpcUrls: {
    default: { http: ["https://api.infra.mainnet.somnia.network"] },
  },
  blockExplorers: {
    default: { name: "Somnia Explorer", url: "https://explorer.somnia.network" },
  },
  testnet: false,
} as const

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

// Create wagmi config
export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, polygon, arbitrum, somniaTestnet],
  connectors: [
    injected(),
    ...(walletConnectProjectId ? [walletConnect({ projectId: walletConnectProjectId })] : []),
  ],
  storage: createStorage({ storage: typeof window !== "undefined" ? window.localStorage : undefined }),
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [somniaTestnet.id]: http(),
  },
})

// Network metadata for UI
export const networkMeta = {
  [mainnet.id]: { color: "#627EEA", icon: "ETH" },
  [sepolia.id]: { color: "#627EEA", icon: "SEP" },
  [polygon.id]: { color: "#8247E5", icon: "MATIC" },
  [arbitrum.id]: { color: "#28A0F0", icon: "ARB" },
  [somniaTestnet.id]: { color: "#22c55e", icon: "STT" },
}
