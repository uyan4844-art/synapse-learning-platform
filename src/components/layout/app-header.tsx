"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Sparkles, Swords, LogOut, User as UserIcon, Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "@/i18n/context";
import { createClient } from "@/lib/supabase/client";

interface AppHeaderProps {
  isMarketing?: boolean;
}

export function AppHeader({ isMarketing = false }: AppHeaderProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const supabase = createClient();

  React.useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        } else {
          // Check local persistence
          const isAuth = localStorage.getItem("synapse_user_authenticated") === "true";
          const userName = localStorage.getItem("synapse_user_name") || "Öğrenci";
          if (isAuth) {
            setUser({ email: "ogrenci@synapse.edu", user_metadata: { full_name: userName } });
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        localStorage.setItem("synapse_user_authenticated", "true");
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    localStorage.removeItem("synapse_user_authenticated");
    localStorage.removeItem("synapse_user_name");
    setUser(null);
    router.push("/");
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Öğrenci";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-20 w-full border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="flex items-center gap-8">
          <div className="md:hidden">
            <BrandLogo />
          </div>

          {isMarketing && (
            <nav className="hidden md:flex items-center gap-8 text-base font-medium text-muted-foreground">
              <Link href="#features" className="hover:text-foreground transition-colors">
                {t("header.how_it_works")}
              </Link>
              <Link href="#practice" className="hover:text-foreground transition-colors">
                {t("header.practice")}
              </Link>
              <Link
                href="#battle"
                className="hover:text-foreground transition-colors flex items-center gap-2 text-warning font-medium"
              >
                <Swords className="h-4 w-4" />
                {t("header.live_battle")}
              </Link>
              <Link href="#pricing" className="hover:text-foreground transition-colors">
                {t("header.pricing")}
              </Link>
            </nav>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          {!isMarketing ? (
            <>
              {/* Streak - Warning */}
              <div
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-warning/10 text-warning border border-warning/20 text-xs font-semibold cursor-pointer"
                title={t("nav.streak", { count: 5 })}
              >
                <Zap className="h-4 w-4" />
                <span>5 {t("nav.streak", { count: 5 }).split(" ")[1]}</span>
              </div>

              {/* Quota */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-xs font-semibold"
                title={t("nav.free_quota")}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span className="font-mono">3 / 5 Test</span>
              </div>

              <LanguageSwitcher />
              <ThemeToggle />

              {/* User Profile & Logout */}
              {user ? (
                <div className="flex items-center gap-2 pl-2 border-l border-border">
                  <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Avatar className="h-9 w-9 ring-1 ring-border hover:ring-primary transition-all">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold text-foreground hidden lg:inline-block max-w-[120px] truncate">
                      {displayName}
                    </span>
                  </Link>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    title="Çıkış Yap"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Link href="/profile" aria-label={t("nav.profile")}>
                  <Avatar className="h-9 w-9 ring-1 ring-border hover:ring-primary transition-all cursor-pointer">
                    <AvatarFallback className="bg-secondary text-foreground text-xs font-bold">SY</AvatarFallback>
                  </Avatar>
                </Link>
              )}
            </>
          ) : (
            <>
              <LanguageSwitcher />
              <ThemeToggle />

              {user ? (
                <div className="flex items-center gap-3">
                  <Button variant="brand" size="default" asChild>
                    <Link href="/practice">Çalışmaya Başla</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    title="Çıkış Yap"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="default" asChild>
                    <Link href="/login">{t("header.sign_in")}</Link>
                  </Button>
                  <Button variant="brand" size="default" asChild>
                    <Link href="/register">{t("header.start_free")}</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
