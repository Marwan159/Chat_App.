import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice";
import { createSliceChat } from "./slices/chat-slice";

export const useAppStore = create()((...a) => ({
  ...createAuthSlice(...a),
  ...createSliceChat(...a),
}));
