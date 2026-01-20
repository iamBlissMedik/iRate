/**
 * Redux Store Configuration
 *
 * Centralized store setup with TypeScript support
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/auth.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add more feature slices here as they're created
    // wallet: walletReducer,
    // transaction: transactionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in serialization check
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Infer types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
