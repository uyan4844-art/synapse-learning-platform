"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Shield, Globe, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n/context";

interface RegionData {
  id: string;
  label: string;
  currency: string;
  symbol: string;
  premiumPrice: number;
  groupPrice: number;
  period: string;
  discount?: string;
}

const REGIONS: RegionData[] = [
  { id: "tr", label: "Türkiye", currency: "TRY", symbol: "₺", premiumPrice: 149.99, groupPrice: 399.99, period: "aylık", discount: "%55 indirimli" },
  { id: "us", label: "US / Europe", currency: "USD", symbol: "$", premiumPrice: 9.99, groupPrice: 24.99, period: "month" },
  { id: "latam", label: "América Latina", currency: "USD", symbol: "$", premiumPrice: 4.99, groupPrice: 12.99, period: "mes", discount: "50% off" },
  { id: "in", label: "India", currency: "INR", symbol: "₹", premiumPrice: 149, groupPrice: 399, period: "month", discount: "80% off" },
  { id: "af", label: "Africa", currency: "USD", symbol: "$", premiumPrice: 2.99, groupPrice: 7.99, period: "month", discount: "70% off" },
  { id: "sea", label: "Southeast Asia", currency: "USD", symbol: "$", premiumPrice: 3.99, groupPrice: 9.99, period: "month", discount: "60% off" },
];

export function PricingSection() {
  const { t } = useTranslation();
  const [selectedRegion, setSelectedRegion] = React.useState<string>("tr");
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const region = REGIONS.find((r) => r.id === selectedRegion) || REGIONS[0];

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const formatPrice = (price: number) => {
    if (Number.isInteger(price)) return price.toString();
    return price.toFixed(2);
  };

  const tiers = [
    {
      name: t("pricing.free_title"), id: "free",
      price: `${region.symbol}0`, period: region.period,
      description: t("pricing.free_desc"),
      features: [
        "Haftada 5 NOVA Test Üretimi", "YouTube Ders Altyazısı Çıkarma",
        "Standart 5 Soruluk Testler", "Haftada 10 Akıllı İpucu",
        "Temel Konu Hakimiyeti Takibi", "Açık Oda Bilgi Düelloları",
      ],
      cta: t("pricing.free_cta"), popular: false, variant: "outline" as const,
    },
    {
      name: t("pricing.premium_title"), id: "premium",
      price: `${region.symbol}${formatPrice(region.premiumPrice)}`, period: region.period,
      description: t("pricing.premium_desc"),
      features: [
        "Sınırsız Test Üretimi (YouTube ve Notlar)", "Derinlemesine NOVA Test Sonu Teşhisi",
        "Zayıf Konulara Özel Pekiştirme Testleri", "Sınırsız Adım Adım Soru İpucu",
        "Tam Elo Düello Sıralama Takibi", "Sınav Müfredatı Uyarlaması (LGS, YKS, SAT)",
        "Öncelikli Üretim Hızı",
      ],
      cta: t("pricing.premium_cta"), popular: true, variant: "brand" as const,
    },
    {
      name: t("pricing.group_title"), id: "group",
      price: `${region.symbol}${formatPrice(region.groupPrice)}`, period: region.period,
      description: t("pricing.group_desc"),
      features: [
        "6 Üyeye Kadar Tüm Premium Özellikler", "Özel Çalışma Grubu Paneli & İlerleme",
        "Grup İçi Özel Liderlik & Düello Turnuvaları", "Grup Hakimiyet Kıyaslama Radarı",
        "Esnek Koltuk Yönetimi & Davet Linki", "Merkezi Fatura Yönetimi",
      ],
      cta: t("pricing.group_cta"), popular: false, variant: "outline" as const,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-secondary/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="secondary" className="py-1 px-3 mb-3 font-medium border border-border">
            <Sparkles className="h-3.5 w-3.5 text-primary mr-1" />
            {t("pricing.badge")}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            {t("pricing.title")}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-3 leading-relaxed">
            {t("pricing.subtitle")}
          </p>
        </div>

        {/* Region Selector */}
        <div className="flex justify-center mb-10">
          <div ref={dropdownRef} className="relative">
            <button
              id="region-selector"
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2.5 px-4 py-2 rounded-md border border-border bg-card hover:border-primary transition-colors"
            >
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{region.label}</span>
              {region.discount && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary">{region.discount}</Badge>
              )}
              <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
              <div className="absolute z-50 mt-1 w-64 rounded-md border border-border bg-card shadow-elevated overflow-hidden animate-fade-in">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Bölge Seçin — PPP Fiyatlandırma
                  </p>
                </div>
                {REGIONS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { setSelectedRegion(r.id); setOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      r.id === selectedRegion ? "bg-primary/15 text-primary font-semibold" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <span className="flex-1 text-left font-medium">{r.label}</span>
                    <span className="text-xs font-mono text-muted-foreground">{r.symbol}{formatPrice(r.premiumPrice)}/{r.period}</span>
                    {r.discount && <Badge variant="secondary" className="text-[9px] px-1 py-0 text-primary">{r.discount}</Badge>}
                    {r.id === selectedRegion && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={`p-6 flex flex-col justify-between relative ${
                tier.popular ? "border-primary bg-primary/5 ring-1 ring-primary/30" : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="brand" className="px-3 py-0.5 text-xs font-semibold uppercase tracking-wider">
                    {t("pricing.popular")}
                  </Badge>
                </div>
              )}

              <div>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
                    {tier.id !== "free" && region.discount && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-auto text-primary border-primary/30">{region.discount}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tier.description}</p>
                </div>

                <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-border">
                  <span className="text-3xl font-semibold text-foreground font-mono">{tier.price}</span>
                  <span className="text-xs text-muted-foreground">/{tier.period}</span>
                  {tier.id !== "free" && (
                    <span className="text-[10px] text-muted-foreground ml-1.5">({region.currency})</span>
                  )}
                </div>

                <div className="space-y-2.5 mb-8">
                  <div className="text-xs font-medium text-foreground uppercase tracking-wider mb-2">Dahil Özellikler:</div>
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span className="leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant={tier.popular ? "brand" : "chessDark"} size="lg" className="w-full font-semibold" asChild>
                <Link href={tier.id === "free" ? "/register" : "/login"}>{tier.cta}</Link>
              </Button>
            </Card>
          ))}
        </div>

        {/* Guarantee */}
        <div className="mt-10 p-4 rounded-md bg-card border border-border max-w-2xl mx-auto flex items-center justify-center gap-3 text-xs text-muted-foreground text-center">
          <Shield className="h-4 w-4 text-primary shrink-0" />
          <span>Bölgesel fiyatlandırma TRY, USD, EUR, GBP, INR, BRL olarak sunulur. İstediğiniz an tek tıkla iptal edebilirsiniz.</span>
        </div>
      </div>
    </section>
  );
}
