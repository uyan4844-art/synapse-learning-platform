import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/i18n/context";

export const metadata: Metadata = {
  title: "SYNAPSE — Learn. Improve. Compete.",
  description:
    "Transform YouTube lectures into adaptive quizzes, master weak subjects with NOVA Intelligence, and compete with friends in real-time quiz battles.",
  keywords: [
    "education",
    "quiz generator",
    "youtube transcript quiz",
    "student mastery",
    "study battles",
    "SAT prep",
    "LGS",
    "GCSE",
    "NOVA intelligence",
  ],
  authors: [{ name: "SYNAPSE Education" }],
  openGraph: {
    title: "SYNAPSE — Learn. Improve. Compete.",
    description:
      "Global student learning and competition platform powered by NOVA Intelligence.",
    siteName: "SYNAPSE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-600">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
