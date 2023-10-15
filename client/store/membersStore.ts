import { create } from "zustand";
import { IUser } from "./userStore";

interface MemberState {
  members: IUser[];
  setMembers: (members: IUser[]) => void;
}

export const useMembersStore = create<MemberState>((set) => ({
  members: [],
  setMembers: (members) => set({ members }),
}));
