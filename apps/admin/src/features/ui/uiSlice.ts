import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  sidebarHovered: boolean;
  sidebarMobileOpen: boolean;
}

const initialState: UIState = {
  sidebarHovered: false,
  sidebarMobileOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSidebarHovered(state, action: PayloadAction<boolean>) {
      state.sidebarHovered = action.payload;
    },
    toggleSidebarMobile(state) {
      state.sidebarMobileOpen = !state.sidebarMobileOpen;
    },
    closeSidebarMobile(state) {
      state.sidebarMobileOpen = false;
    },
  },
});

export const { setSidebarHovered, toggleSidebarMobile, closeSidebarMobile } =
  uiSlice.actions;
export const uiReducer = uiSlice.reducer;
