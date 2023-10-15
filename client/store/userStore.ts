import { create } from "zustand";

export interface IUser {
  id: string;
  username: string;
}

interface UserState {
  user: IUser | null;
  setUser: (user: IUser) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
