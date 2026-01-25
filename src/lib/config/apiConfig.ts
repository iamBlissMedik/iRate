/**
 * API Configuration
 * Following Dependency Inversion Principle (DIP) - depend on abstractions
 * This allows easy switching between mock and real implementations
 */

export type ApiMode = 'mock' | 'real';

export interface ApiConfig {
  mode: ApiMode;
  baseUrl?: string;
  timeout?: number;
}

// Default configuration - can be overridden via environment variables
export const defaultApiConfig: ApiConfig = {
  mode: (process.env.NEXT_PUBLIC_API_MODE as ApiMode) || 'mock',
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com',
  timeout: 5000,
};

let currentConfig = { ...defaultApiConfig };

export const getApiConfig = (): ApiConfig => currentConfig;

export const setApiConfig = (config: Partial<ApiConfig>): void => {
  currentConfig = { ...currentConfig, ...config };
};
