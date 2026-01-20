import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
} from "axios";
import { env } from "@/core/config/env";

/** * Validation error structure from API
 */
export interface ValidationError {
  field: string;
  message: string;
}

/** * Custom API Error class
 */
export class ApiClientError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public errors?: ValidationError[],
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

/**
 * Token storage interface (abstraction for easy testing/swapping)
 */
interface TokenStorage {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setAccessToken(token: string): void;
  setRefreshToken(token: string): void;
  clearTokens(): void;
}

/**
 * LocalStorage implementation of TokenStorage
 */
class LocalStorageTokenStorage implements TokenStorage {
  private ACCESS_TOKEN_KEY = "accessToken";
  private REFRESH_TOKEN_KEY = "refreshToken";

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setAccessToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  setRefreshToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}

/**
 * API Client class
 *
 * Centralized HTTP client with:
 * - Automatic token management
 * - Request/response interceptors
 * - Error handling
 * - Retry logic
 */
export class ApiClient {
  private axiosInstance: AxiosInstance;
  private tokenStorage: TokenStorage;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  constructor(tokenStorage: TokenStorage = new LocalStorageTokenStorage()) {
    this.tokenStorage = tokenStorage;

    // Create Axios instance
    this.axiosInstance = axios.create({
      baseURL: env.apiBaseUrl,
      timeout: env.apiTimeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add access token to headers
        const token = this.tokenStorage.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add idempotency key for mutating operations
        if (["post", "put", "patch", "delete"].includes(config.method || "")) {
          if (!config.headers["Idempotency-Key"]) {
            config.headers["Idempotency-Key"] = this.generateIdempotencyKey();
          }
        }

        // Add request timestamp for monitoring
        config.headers["X-Request-Time"] = new Date().toISOString();

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Extract data from standard response wrapper
        return response.data;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 401 Unauthorized - Try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => {
                return this.axiosInstance(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newAccessToken = await this.refreshAccessToken();
            this.tokenStorage.setAccessToken(newAccessToken);

            // Retry all queued requests
            this.failedQueue.forEach((promise) => {
              promise.resolve();
            });
            this.failedQueue = [];

            // Retry original request
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.failedQueue.forEach((promise) => {
              promise.reject(refreshError);
            });
            this.failedQueue = [];
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Transform error to custom ApiClientError
        return Promise.reject(this.handleError(error));
      },
    );
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<string> {
    const refreshToken = this.tokenStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      // Call refresh endpoint (without interceptors to avoid infinite loop)
      const response = await axios.post(
        `${env.apiBaseUrl}/auth/refresh`,
        { refreshToken },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      const { accessToken } = response.data.data || response.data;
      return accessToken;
    } catch (error) {
      this.tokenStorage.clearTokens();
      throw error;
    }
  }

  /**
   * Handle authentication failure (redirect to login)
   */
  private handleAuthFailure(): void {
    this.tokenStorage.clearTokens();

    // Only redirect on client side
    if (typeof window !== "undefined") {
      window.location.href = "/login?session=expired";
    }
  }

  /**
   * Transform Axios error to ApiClientError
   */
  private handleError(error: AxiosError): ApiClientError {
    const response = error.response;

    if (response) {
      // Server responded with error
      const data = response.data as {
        message?: string;
        code?: string;
        errors?: ValidationError[];
      };
      return new ApiClientError(
        response.status,
        data?.message || error.message,
        data?.code,
        data?.errors,
      );
    } else if (error.request) {
      // Request made but no response (network error)
      return new ApiClientError(
        0,
        "Network error. Please check your connection.",
      );
    } else {
      // Something else happened
      return new ApiClientError(0, error.message);
    }
  }

  /**
   * Generate unique idempotency key
   */
  private generateIdempotencyKey(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * HTTP GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.get<T>(url, config) as Promise<T>;
  }

  /**
   * HTTP POST request
   */
  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.axiosInstance.post<T>(url, data, config) as Promise<T>;
  }

  /**
   * HTTP PUT request
   */
  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.axiosInstance.put<T>(url, data, config) as Promise<T>;
  }

  /**
   * HTTP PATCH request
   */
  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.axiosInstance.patch<T>(url, data, config) as Promise<T>;
  }

  /**
   * HTTP DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.delete<T>(url, config) as Promise<T>;
  }

  /**
   * Set authentication tokens
   */
  setTokens(accessToken: string, refreshToken: string): void {
    this.tokenStorage.setAccessToken(accessToken);
    this.tokenStorage.setRefreshToken(refreshToken);
  }

  /**
   * Clear authentication tokens
   */
  clearTokens(): void {
    this.tokenStorage.clearTokens();
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.tokenStorage.getAccessToken();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.tokenStorage.getAccessToken();
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for testing
export { LocalStorageTokenStorage };
