"use client";

import * as React from "react";
import { Globe, Check, BookOpen, Layers } from "lucide-react";
import { useTranslation, SUPPORTED_LOCALES, type Locale } from "@/i18n/context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function LanguageSwitcher() {
  const { locale, contentLocale, setLocale, setContentLocale, t, localeMeta } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"interface" | "content">("interface");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const activeContentMeta = SUPPORTED_LOCALES.find((l) => l.code === contentLocale) || SUPPORTED_LOCALES[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button - Clean Single Label */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 px-2.5 rounded-md border border-border hover:bg-secondary text-foreground flex items-center gap-1.5 transition-colors text-xs font-semibold select-none"
        aria-label="Change Language"
        aria-expanded={isOpen}
      >
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-mono uppercase font-semibold">{localeMeta.code}</span>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md bg-card border border-border shadow-elevated p-3 z-50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Globe className="h-4 w-4 text-primary" />
              <span>{t("header.lang_modal_title")}</span>
            </div>
            <Badge variant="secondary" className="text-[10px]">
              6 {t("hero.trust_languages")}
            </Badge>
          </div>

          {/* Tabs: Interface vs Content Language */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-secondary rounded-md mb-3 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("interface")}
              className={`py-1.5 px-2 rounded-sm flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === "interface"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="h-3 w-3" />
              <span>{t("header.interface_lang")}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("content")}
              className={`py-1.5 px-2 rounded-sm flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === "content"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="h-3 w-3" />
              <span>{t("header.content_lang")}</span>
            </button>
          </div>

          {/* Explanatory Note */}
          <p className="text-[11px] text-muted-foreground px-1 mb-2 leading-tight">
            {activeTab === "interface"
              ? "Tüm butonlar, menüler ve uyarılar bu dilde gösterilir."
              : "Üretilen testler, sorular ve açıklamalar bu dilde hazırlanır."}
          </p>

          {/* Language Options List */}
          <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
            {SUPPORTED_LOCALES.map((item) => {
              const isSelected = activeTab === "interface" ? locale === item.code : contentLocale === item.code;

              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    if (activeTab === "interface") {
                      setLocale(item.code);
                    } else {
                      setContentLocale(item.code);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-md text-xs transition-colors ${
                    isSelected
                      ? "bg-primary/15 text-primary font-semibold border border-primary/30"
                      : "hover:bg-secondary text-foreground font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-muted-foreground text-[11px] uppercase font-bold w-6">
                      {item.code}
                    </span>
                    <div className="text-left">
                      <div className="leading-none text-foreground">{item.nativeName}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {item.englishName}
                      </div>
                    </div>
                  </div>

                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground px-1">
            <span>Arayüz: {localeMeta.nativeName}</span>
            <span>İçerik: {activeContentMeta.nativeName}</span>
          </div>
        </div>
      )}
    </div>
  );
}
