"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ArrowLeft } from "lucide-react";
import { HugoLogo } from "@/components/hugo-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";

export default function RegisterPage() {
  const t = useT();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("auth.register.passwordMismatch"));
      return;
    }
    if (password.length < 8) {
      setError(t("auth.register.passwordTooShort"));
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? t("auth.register.registrationFailed"));
    } else {
      router.push("/login?registered=1");
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ─── Left panel ─── */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#4A6FA5] flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2 text-white">
          <HugoLogo size={28} />
          <span className="font-semibold text-lg tracking-tight">Hugo</span>
        </Link>

        <div>
          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            {t("auth.register.leftPanelHeadline").split("\n").map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8">
            {t("auth.register.leftPanelSubtitle")}
          </p>
          <ul className="space-y-3">
            {[
              t("auth.register.feature1"),
              t("auth.register.feature2"),
              t("auth.register.feature3"),
              t("auth.register.feature4"),
            ].map((text) => (
              <li key={text} className="flex items-center gap-3 text-white text-sm">
                <span className="shrink-0 h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-white/50 text-xs">
          {t("auth.register.tagline")}
        </p>
      </div>

      {/* ─── Right panel ─── */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <HugoLogo size={20} />
            <span className="font-semibold tracking-tight text-sm">Hugo</span>
          </Link>
          <Link href="/" className="text-xs text-gray-500 flex items-center gap-1 hover:text-gray-700 transition-colors">
            <ArrowLeft className="h-3 w-3" /> {t("common.back")}
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">

            {/* Desktop back link */}
            <Link
              href="/"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-8"
            >
              <ArrowLeft className="h-3 w-3" /> {t("common.backToHugo")}
            </Link>

            <h1 className="text-2xl font-bold text-gray-900 mb-1">{t("auth.register.title")}</h1>
            <p className="text-sm text-gray-500 mb-6">
              {t("auth.register.alreadyHaveAccount")}{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                {t("auth.register.signIn")}
              </Link>
            </p>

            {error && (
              <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">{t("auth.register.emailLabel")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth.register.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">{t("auth.register.passwordLabel")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("auth.register.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={8}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">{t("auth.register.confirmPasswordLabel")}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t("auth.register.confirmPasswordPlaceholder")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("auth.register.submitting") : t("auth.register.submitButton")}
              </Button>
            </form>

            <p className="mt-6 text-xs text-gray-400 text-center leading-relaxed">
              {t("auth.register.privacyNote")} ·{" "}
              <Link href="/faq" className="hover:text-gray-600 underline underline-offset-2 transition-colors">
                {t("common.faq")}
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
