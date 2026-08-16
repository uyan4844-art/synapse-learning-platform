"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Sparkles, ArrowRight, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "@/i18n/context";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // If environment keys are configured, perform real Supabase Auth
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
      }

      // Successful auth flow
      localStorage.setItem("synapse_user_authenticated", "true");
      router.push("/practice");
    } catch (err: any) {
      setErrorMsg(err.message || "Giriş yapılırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrorMsg(null);

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co") {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          setErrorMsg(error.message);
          setGoogleLoading(false);
          return;
        }
      } else {
        // Fallback simulation when keys not yet provided
        setTimeout(() => {
          localStorage.setItem("synapse_user_authenticated", "true");
          router.push("/practice");
        }, 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Google ile giriş yapılırken bir hata oluştu.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-background relative">
      <div className="absolute top-8 left-8">
        <BrandLogo />
      </div>

      <Card className="w-full max-w-md p-8 relative z-10 animate-fade-in shadow-elevated">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-3 py-1 px-3 border border-border">
            <Sparkles className="h-3 w-3 text-primary mr-1" />
            SYNAPSE Giriş
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Tekrar Hoş Geldiniz
          </h1>
          <p className="text-xs text-muted-foreground mt-2">
            Öğrenme serinize ve bilgi düellolarınıza devam etmek için giriş yapın.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-md bg-destructive/15 border border-destructive/30 text-xs text-foreground flex items-center gap-2 mb-4 animate-fade-in">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <Button
          type="button"
          variant="outline"
          disabled={googleLoading || loading}
          onClick={handleGoogleLogin}
          className="w-full h-11 mb-6 flex items-center justify-center gap-3 text-xs font-semibold hover:bg-secondary transition-colors"
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-3z" />
              <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5c1.8 3.7 5.6 6.3 10.1 7z" />
            </svg>
          )}
          Google ile Devam Et
        </Button>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[11px] text-muted-foreground uppercase font-medium tracking-wider">veya e-posta ile</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">E-posta Adresi</label>
            <Input
              type="email"
              placeholder="ogrenci@okul.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Şifre</label>
              <a href="#" className="text-[11px] text-primary font-medium hover:underline">Şifremi unuttum</a>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-4 w-4" />}
              required
            />
          </div>

          <Button type="submit" variant="brand" size="lg" disabled={loading || googleLoading} className="w-full gap-2 mt-2 font-semibold">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          Hesabınız yok mu?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">Ücretsiz Kaydolun</Link>
        </div>
      </Card>
    </div>
  );
}
