"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Sparkles, ArrowRight, Lock, Mail, User, Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "@/i18n/context";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const [emailSent, setEmailSent] = React.useState(false);

  const supabase = createClient();

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
            emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
          },
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        // Check if email confirmation is required by Supabase project settings
        if (data.user && !data.session) {
          setEmailSent(true);
          setLoading(false);
          return;
        }
      }

      // Successful registration & session confirmed -> proceed to Onboarding Flow
      localStorage.setItem("synapse_user_name", name);
      localStorage.setItem("synapse_user_authenticated", "true");
      router.push("/onboarding");
    } catch (err: any) {
      setErrorMsg(err.message || "Kayıt olurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
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
        setTimeout(() => {
          localStorage.setItem("synapse_user_authenticated", "true");
          router.push("/onboarding");
        }, 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Google ile kayıt oluşturulurken bir hata oluştu.");
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
            SYNAPSE Kayıt
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Hesabınızı Oluşturun
          </h1>
          <p className="text-xs text-muted-foreground mt-2">
            Haftada 5 ücretsiz test ve bilgi düelloları ile hemen öğrenmeye başlayın.
          </p>
        </div>

        {emailSent ? (
          <div className="text-center space-y-4 py-4 animate-fade-in">
            <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Mail className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Doğrulama E-postası Gönderildi</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">{email}</strong> adresine bir aktivasyon bağlantısı gönderdik. Spam hesapları engellemek için lütfen gelen kutunuzdaki bağlantıya tıklayarak e-postanızı onaylayın.
            </p>
            <div className="pt-4 border-t border-border">
              <Button variant="brand" className="w-full text-xs font-semibold" asChild>
                <Link href="/login">Giriş Yap Sayfasına Git</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="p-3 rounded-md bg-destructive/15 border border-destructive/30 text-xs text-foreground flex items-center gap-2 mb-4 animate-fade-in">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleRegister}
              disabled={googleLoading || loading}
              className="w-full mb-6 font-semibold flex items-center justify-center gap-3 border-border hover:bg-secondary h-11"
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              {googleLoading ? "Yönlendiriliyor..." : "Google ile Kayıt Ol"}
            </Button>

            <div className="flex items-center gap-3 my-6">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] text-muted-foreground uppercase font-medium tracking-wider">veya e-posta ile</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Ad Soyad</label>
                <Input
                  type="text"
                  placeholder="Öğrenci Adı"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<User className="h-4 w-4" />}
                  required
                />
              </div>

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
                <label className="text-xs font-medium text-foreground">Şifre</label>
                <Input
                  type="password"
                  placeholder="En az 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4" />}
                  required
                />
              </div>

              <Button type="submit" variant="brand" size="lg" disabled={loading || googleLoading} className="w-full gap-2 mt-2 font-semibold">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? "Hesap Oluşturuluyor..." : "Ücretsiz Hesabı Başlat"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          Zaten hesabınız var mı?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">Giriş Yapın</Link>
        </div>
      </Card>
    </div>
  );
}
