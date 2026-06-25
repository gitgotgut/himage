"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HugoLogo } from "@/components/hugo-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useT } from "@/lib/i18n";

function ResetPasswordForm() {
  const t = useT();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError(t("auth.resetPassword.passwordMismatch"));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (res.ok) {
        setDone(true);
        setTimeout(() => router.push("/login"), 2500);
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error || t("auth.resetPassword.networkError"));
      }
    } catch {
      setError(t("auth.resetPassword.networkError"));
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <CardContent>
        <p className="text-sm text-destructive bg-destructive/10 rounded-md p-3">
          {t("auth.resetPassword.invalidLink")}
        </p>
        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-sm text-primary underline">
            {t("auth.resetPassword.requestNewLink")}
          </Link>
        </div>
      </CardContent>
    );
  }

  if (done) {
    return (
      <CardContent>
        <p className="text-sm text-green-600 bg-green-50 rounded-md p-3">
          {t("auth.resetPassword.successMessage")}
        </p>
      </CardContent>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-md p-3">{error}</p>
        )}
        <div className="space-y-2">
          <Label htmlFor="password">{t("auth.resetPassword.newPasswordLabel")}</Label>
          <Input
            id="password"
            type="password"
            placeholder={t("auth.resetPassword.newPasswordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">{t("auth.resetPassword.confirmPasswordLabel")}</Label>
          <Input
            id="confirm"
            type="password"
            placeholder={t("auth.resetPassword.confirmPasswordPlaceholder")}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t("auth.resetPassword.submitting") : t("auth.resetPassword.submitButton")}
        </Button>
      </CardFooter>
    </form>
  );
}

export default function ResetPasswordPage() {
  const t = useT();
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
            <CardTitle className="text-2xl">{t("auth.resetPassword.title")}</CardTitle>
            <CardDescription>{t("auth.resetPassword.description")}</CardDescription>
          </CardHeader>
          <Suspense fallback={<CardContent><p className="text-sm text-muted-foreground">Loading…</p></CardContent>}>
            <ResetPasswordForm />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}
