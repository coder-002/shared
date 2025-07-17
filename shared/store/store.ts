import { create } from "zustand";

type TitleState = {
  main: string;
  sub: string;
  setTitle: (main: string, sub: string) => void;
  resetTitle: () => void;
};

export const useTitle = create<TitleState>((set) => ({
  main: "",
  sub: "",
  setTitle: (main, sub) => set({ main, sub }),
  resetTitle: () => set({ main: "", sub: "" }),
}));

export const useUserMetaStore = create(() => ({
  userMetaKey: "initial" as string,
}));
