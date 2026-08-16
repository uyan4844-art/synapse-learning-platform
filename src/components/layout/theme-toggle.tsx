"use client";

import * as React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" aria-label="Toggle theme">
        <Sun className="h-4 w-4 opacity-50" />
      </Button>
    );
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="h-9 w-9 rounded-lg border border-border/40 hover:bg-accent text-foreground transition-all"
      title={`Theme: ${theme ?? "system"} (Click to cycle)`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Moon className="h-4 w-4 text-emerald-400 transition-all duration-300 rotate-0 scale-100" />
      ) : theme === "light" ? (
        <Sun className="h-4 w-4 text-amber-500 transition-all duration-300 rotate-0 scale-100" />
      ) : (
        <Laptop className="h-4 w-4 text-muted-foreground transition-all duration-300" />
      )}
    </Button>
  );
}
