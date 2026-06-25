"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HugoLogo } from "@/components/hugo-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useT } from "@/lib/i18n";

export default function ForgotPasswordPage() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error || t("auth.forgotPassword.networkError"));
      }
    } catch {
      setError(t("auth.forgotPassword.networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <HugoLogo size={20} />
          <span className="font-semibold tracking-tight">Hugo</span>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{t("auth.forgotPassword.title")}</CardTitle>
            <CardDescription>
              {t("auth.forgotPassword.description")}
            </CardDescription>
          </CardHeader>
          {submitted ? (
            <CardContent>
              <p className="text-sm text-green-600 bg-green-50 rounded-md p-3">
                {t("auth.forgotPassword.successMessage", { email })}
              </p>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 rounded-md p-3">{error}</p>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">{t("auth.forgotPassword.emailLabel")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("auth.forgotPassword.emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t("auth.forgotPassword.submitting") : t("auth.forgotPassword.submitButton")}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  {t("auth.forgotPassword.rememberPassword")}{" "}
                  <Link href="/login" className="text-primary underline">
                    {t("auth.forgotPassword.signIn")}
                  </Link>
                </p>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
