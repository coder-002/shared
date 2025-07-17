import { create } from "zustand";

interface LayoutState {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}
interface SidebarDrawerState {
  visible: boolean;
  setVisible: (value: boolean) => void;
}

interface IDarkModel {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

interface ThemeState {
  brand: string;
  setBrand: (brand: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  brand: "default",
  setBrand: (brand) => set({ brand }),
}));

export const useLayoutStore = create<LayoutState>((set) => {
  const stored = localStorage.getItem("collapsed");
  const initial = stored ? JSON.parse(stored) : false;

  return {
    collapsed: initial,
    setCollapsed: (value) => {
      localStorage.setItem("collapsed", JSON.stringify(value));
      set({ collapsed: value });
    },
  };
});

export const useSidebarDrawerStore = create<SidebarDrawerState>((set) => ({
  visible: false,
  setVisible: (value) => {
    set({ visible: value });
  },
}));

export const useDarkMode = create<IDarkModel>((set) => ({
  isDarkMode: false,
  setIsDarkMode: (value) => {
    set({ isDarkMode: value });
  },
}));
