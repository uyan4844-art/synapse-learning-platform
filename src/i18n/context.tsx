"use client";

import * as React from "react";
import enDict from "./dictionaries/en.json";
import trDict from "./dictionaries/tr.json";
import esDict from "./dictionaries/es.json";
import deDict from "./dictionaries/de.json";
import frDict from "./dictionaries/fr.json";
import ptDict from "./dictionaries/pt.json";

export type Locale = "en" | "tr" | "es" | "de" | "fr" | "pt";

export interface LocaleMeta {
  code: Locale;
  nativeName: string;
  englishName: string;
  flag: string;
}

export const SUPPORTED_LOCALES: LocaleMeta[] = [
  { code: "tr", nativeName: "Türkçe", englishName: "Turkish", flag: "🇹🇷" },
  { code: "en", nativeName: "English", englishName: "English (US)", flag: "🇬🇧" },
  { code: "es", nativeName: "Español", englishName: "Spanish", flag: "🇪🇸" },
  { code: "de", nativeName: "Deutsch", englishName: "German", flag: "🇩🇪" },
  { code: "fr", nativeName: "Français", englishName: "French", flag: "🇫🇷" },
  { code: "pt", nativeName: "Português", englishName: "Portuguese", flag: "🇵🇹" },
];

const dictionaries: Record<Locale, Record<string, any>> = {
  en: enDict,
  tr: trDict,
  es: esDict,
  de: deDict,
  fr: frDict,
  pt: ptDict,
};

interface LanguageContextType {
  locale: Locale;
  contentLocale: Locale;
  setLocale: (loc: Locale) => void;
  setContentLocale: (loc: Locale) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  localeMeta: LocaleMeta;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("tr"); // Default to Turkish as requested
  const [contentLocale, setContentLocaleState] = React.useState<Locale>("en");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    try {
      const savedLocale = localStorage.getItem("synapse_locale") as Locale;
      if (savedLocale && dictionaries[savedLocale]) {
        setLocaleState(savedLocale);
      }
      const savedContentLocale = localStorage.getItem("synapse_content_locale") as Locale;
      if (savedContentLocale && dictionaries[savedContentLocale]) {
        setContentLocaleState(savedContentLocale);
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const setLocale = React.useCallback((newLocale: Locale) => {
    if (!dictionaries[newLocale]) return;
    setLocaleState(newLocale);
    try {
      localStorage.setItem("synapse_locale", newLocale);
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }
  }, []);

  const setContentLocale = React.useCallback((newLocale: Locale) => {
    if (!dictionaries[newLocale]) return;
    setContentLocaleState(newLocale);
    try {
      localStorage.setItem("synapse_content_locale", newLocale);
    } catch {
      // ignore
    }
  }, []);

  const t = React.useCallback(
    (path: string, params?: Record<string, string | number>): string => {
      const keys = path.split(".");
      let current: any = dictionaries[locale];

      for (const key of keys) {
        if (current && typeof current === "object" && key in current) {
          current = current[key];
        } else {
          // Fallback to English dictionary
          let fallback: any = dictionaries.en;
          for (const fKey of keys) {
            if (fallback && typeof fallback === "object" && fKey in fallback) {
              fallback = fallback[fKey];
            } else {
              return path;
            }
          }
          current = fallback;
          break;
        }
      }

      if (typeof current !== "string") {
        return path;
      }

      let result = current;
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          result = result.replace(new RegExp(`{{${paramKey}}}`, "g"), String(paramValue));
        });
      }

      return result;
    },
    [locale]
  );

  const localeMeta = React.useMemo(() => {
    return SUPPORTED_LOCALES.find((l) => l.code === locale) || SUPPORTED_LOCALES[0];
  }, [locale]);

  return (
    <LanguageContext.Provider
      value={{
        locale,
        contentLocale,
        setLocale,
        setContentLocale,
        t,
        localeMeta,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
