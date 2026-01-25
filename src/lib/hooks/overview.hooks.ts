/**
 * Dashboard Overview Hook
 * Following Single Responsibility Principle (SRP) and Dependency Inversion Principle (DIP)
 * 
 * This hook is agnostic to external dependencies like toast notifications.
 * Error handling is delegated through callback injection, making it flexible and testable.
 */

'use client';

import * as React from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { DashboardOverviewResponse } from '@/types/dashboard';
import { getDashboardOverview } from '@/lib/api/overview.api';
import { QUERY_KEYS } from '@/constants/queryKeys';

export interface UseDashboardOverviewOptions {
  // Callback for error handling - allows consumers to decide how to handle errors
  onError?: (error: Error) => void;
  // Callback for success - allows consumers to perform actions on successful fetch
  onSuccess?: (data: DashboardOverviewResponse) => void;
  // Enable/disable the query
  enabled?: boolean;
}

export const useDashboardOverview = (
  options: UseDashboardOverviewOptions = {}
): UseQueryResult<DashboardOverviewResponse, Error> => {
  const { onError, onSuccess, enabled = true } = options;

  const result = useQuery<DashboardOverviewResponse, Error>({
    queryKey: QUERY_KEYS.DASHBOARD_OVERVIEW,
    queryFn: getDashboardOverview,
    enabled,
  });

  // Handle callbacks separately to avoid type conflicts
  // Use refs to avoid re-running effects when callbacks change
  const onErrorRef = React.useRef(onError);
  const onSuccessRef = React.useRef(onSuccess);

  React.useEffect(() => {
    onErrorRef.current = onError;
    onSuccessRef.current = onSuccess;
  }, [onError, onSuccess]);

  React.useEffect(() => {
    if (result.isError && result.error && onErrorRef.current) {
      onErrorRef.current(result.error);
    }
  }, [result.isError, result.error]);

  React.useEffect(() => {
    if (result.isSuccess && result.data && onSuccessRef.current) {
      onSuccessRef.current(result.data);
    }
  }, [result.isSuccess, result.data]);

  return result;
};
