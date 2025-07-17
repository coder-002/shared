import React, { ReactNode, useCallback, useEffect, useContext } from "react";
import {
  formatString,
  getLocaleResources,
} from "@/shared/services/i18n/i18nService";
import { Locale } from "@/shared/model/Locale";
import { useLocaleStore } from "@/shared/shared/store/localeStore";

type Props = {
  children: ReactNode;
};

export type LocaleKey = keyof Locale | number | `${number}`;
export type LocalizeFn = (key: LocaleKey, ...args: any[]) => string;

const LocalizeContext = React.createContext<LocalizeFn>(() => "");

export const useLocale = () => useContext(LocalizeContext);

// Provider component
export const LocaleProvider = ({ children }: Props) => {
  const language = useLocaleStore((s) => s.language);
  const locales = useLocaleStore((s) => s.locales);
  const setLocales = useLocaleStore((s) => s.setLocales);

  const updateLocale = useCallback(async () => {
    const newLocale: Locale = await getLocaleResources(language);
    if (newLocale) setLocales(newLocale);
  }, [language, setLocales]);

  const fallbackLocale = useCallback(async () => {
    const newLocale = await getLocaleResources();
    setLocales(newLocale);
  }, [setLocales]);

  useEffect(() => {
    updateLocale().catch(fallbackLocale);
  }, [updateLocale, fallbackLocale]);

  const localize: LocalizeFn = (key: LocaleKey, ...args: string[]) => {
    if (key === undefined || key === null) return "";

    const keyStr = key.toString().replace(/ /g, ""); // ✅ safe conversion
    if (keyStr === "") return "";

    const safeKey = keyStr as keyof Locale;

    // Try exact match
    if (locales && locales[safeKey]) {
      return formatString(locales[safeKey], ...args);
    }

    // Handle numeric keys (e.g., '123')
    if (!isNaN(Number(keyStr))) {
      return keyStr
        .split("")
        .map((char) => {
          const charKey = ("_" + char) as keyof Locale;
          return locales && locales[charKey]
            ? formatString(locales[charKey], ...args)
            : char;
        })
        .join("");
    }

    // Store missing keys for debugging
    const missingLocaleKey = `MissingLocale_${language}`;
    const previousMissing = localStorage.getItem(missingLocaleKey);
    const missingSet: string[] = previousMissing
      ? JSON.parse(previousMissing)
      : [];

    if (!missingSet.includes(keyStr)) {
      missingSet.push(keyStr);
      localStorage.setItem(missingLocaleKey, JSON.stringify(missingSet));
    }

    // Fallback: return prettified string
    return keyStr.replace(/([A-Z])/g, " $1");
  };

  return (
    <LocalizeContext.Provider value={localize}>
      {children}
    </LocalizeContext.Provider>
  );
};
