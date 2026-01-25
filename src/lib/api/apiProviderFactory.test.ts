/**
 * Unit tests for API Provider Factory
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ApiProviderFactory } from '../api/apiProviderFactory';
import { MockDashboardApiProvider } from '../api/mockApiProvider';
import { RealDashboardApiProvider } from '../api/realApiProvider';
import { setApiConfig, getApiConfig } from '../config/apiConfig';

describe('ApiProviderFactory', () => {
  beforeEach(() => {
    ApiProviderFactory.clearCache();
  });

  afterEach(() => {
    ApiProviderFactory.clearCache();
  });

  it('should return MockDashboardApiProvider when mode is mock', () => {
    setApiConfig({ mode: 'mock' });
    
    const provider = ApiProviderFactory.getDashboardApiProvider();
    
    expect(provider).toBeInstanceOf(MockDashboardApiProvider);
  });

  it('should return RealDashboardApiProvider when mode is real', () => {
    setApiConfig({ mode: 'real' });
    
    const provider = ApiProviderFactory.getDashboardApiProvider();
    
    expect(provider).toBeInstanceOf(RealDashboardApiProvider);
  });

  it('should cache provider instances', () => {
    setApiConfig({ mode: 'mock' });
    
    const provider1 = ApiProviderFactory.getDashboardApiProvider();
    const provider2 = ApiProviderFactory.getDashboardApiProvider();
    
    expect(provider1).toBe(provider2); // Same instance
  });

  it('should fall back to mock for unknown modes', () => {
    setApiConfig({ mode: 'invalid' as any });
    
    const provider = ApiProviderFactory.getDashboardApiProvider();
    
    expect(provider).toBeInstanceOf(MockDashboardApiProvider);
  });

  it('should clear cache when requested', () => {
    setApiConfig({ mode: 'mock' });
    
    const provider1 = ApiProviderFactory.getDashboardApiProvider();
    ApiProviderFactory.clearCache();
    const provider2 = ApiProviderFactory.getDashboardApiProvider();
    
    expect(provider1).not.toBe(provider2); // Different instances
  });
});
