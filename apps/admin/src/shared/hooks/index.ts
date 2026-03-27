/**
 * Shared Hooks
 *
 * Export all reusable custom hooks
 */

export { useAppDispatch, useAppSelector } from "@/core/store/hooks";
export {
  useDebounce,
  useThrottle,
  usePrevious,
  useLocalStorage,
} from "./useOptimization";
