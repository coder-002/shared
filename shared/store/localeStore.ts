// src/stores/localeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Locale } from "@/shared/model/Locale";

// 1. Define supported locale types
export const TLocale = ["NP", "EN"] as const;
export type TLocaleLang = (typeof TLocale)[number];

// 2. Define the shape of your store
interface LocaleStore {
  language: TLocaleLang;
  locales: Locale | null;

  setLanguage: (lang: TLocaleLang) => void;
  setLocales: (locale: Locale | null) => void;
  reset: () => void;
}

// 3. Create the persistent store
export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      language: "EN", // Default language
      locales: null, // Default locales

      setLanguage: (lang) => set({ language: lang }),
      setLocales: (locale) => set({ locales: locale }),

      reset: () =>
        set({
          language: "EN",
          locales: null,
        }),
    }),
    {
      name: "locale-storage", // localStorage key
      partialize: (state) => ({
        language: state.language,
        locales: state.locales,
      }),
    }
  )
);
