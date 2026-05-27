"use client"

import { http, createConfig, createStorage } from "wagmi"
import { mainnet, sepolia, polygon, arbitrum } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"

// Somnia Testnet Configuration (preparation for mainnet)
export const somniaTestnet = {
  id: 50311,
  name: "Somnia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Somnia",
    symbol: "STT",
  },
  rpcUrls: {
    default: { http: ["https://dream-rpc.somnia.network"] },
  },
  blockExplorers: {
    default: { name: "Somnia Explorer", url: "https://somnia-testnet.socialscan.io" },
  },
  testnet: true,
} as const

// Somnia Mainnet Configuration (future-ready)
export const somniaMainnet = {
  id: 50312,
  name: "Somnia",
  nativeCurrency: {
    decimals: 18,
    name: "Somnia",
    symbol: "SOM",
  },
  rpcUrls: {
    default: { http: ["https://rpc.somnia.network"] },
  },
  blockExplorers: {
    default: { name: "Somnia Explorer", url: "https://explorer.somnia.network" },
  },
  testnet: false,
} as const

// Create wagmi config
export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, polygon, arbitrum, somniaTestnet],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
    }),
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
