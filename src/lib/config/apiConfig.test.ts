/**
 * Unit tests for API configuration
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { getApiConfig, setApiConfig, defaultApiConfig } from '../config/apiConfig';

describe('API Configuration', () => {
  beforeEach(() => {
    // Reset to defaults before each test
    setApiConfig({ ...defaultApiConfig });
  });

  it('should have default configuration', () => {
    const config = getApiConfig();
    
    expect(config.mode).toBe('mock');
    expect(config.baseUrl).toBeDefined();
    expect(config.timeout).toBe(5000);
  });

  it('should allow updating configuration', () => {
    setApiConfig({ mode: 'real', timeout: 10000 });
    
    const config = getApiConfig();
    
    expect(config.mode).toBe('real');
    expect(config.timeout).toBe(10000);
  });

  it('should merge partial configuration updates', () => {
    const originalUrl = getApiConfig().baseUrl;
    
    setApiConfig({ mode: 'real' });
    
    const config = getApiConfig();
    expect(config.mode).toBe('real');
    expect(config.baseUrl).toBe(originalUrl); // Not changed
  });
});
