
// Type declarations for Google Analytics 4
interface Window {
  gtag: (
    command: 'config' | 'event',
    targetId: string,
    config?: Record<string, unknown>
  ) => void;
  dataLayer: unknown[];
}

