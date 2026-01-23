import { AppDispatch, RootState } from "@/store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";


// Use instead of plain `useDispatch`
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Use instead of plain `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
