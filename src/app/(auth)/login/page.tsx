"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, ArrowLeft } from "lucide-react";
import { HugoLogo } from "@/components/hugo-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";

function LoginForm() {
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const hint = params.get("hint");

  const [email, setEmail] = useState(hint ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegistered, setShowRegistered] = useState(false);

  useEffect(() => {
    if (params.get("registered")) setShowRegistered(true);
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(t("auth.login.invalidCredentials"));
    } else {
      router.push(next ?? "/hub");
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-sm">

      {/* Desktop back link */}
      <Link
        href="/"
        className="hidden lg:inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-8"
      >
        <ArrowLeft className="h-3 w-3" /> {t("common.backToHugo")}
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        {hint ? t("auth.login.titleWithHint") : t("auth.login.title")}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {hint
          ? t("auth.login.subtitleWithHint", { email: hint })
          : <>{t("auth.login.noAccount")}{" "}
              <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                {t("auth.login.signUpFree")}
              </Link>
            </>
        }
      </p>

      {showRegistered && (
        <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
          {t("auth.login.accountCreated")}
        </div>
      )}

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("auth.login.emailLabel")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("auth.login.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t("auth.login.passwordLabel")}</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              {t("auth.login.forgotPassword")}
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t("auth.login.submitting") : t("auth.login.submitButton")}
        </Button>
      </form>

      <p className="mt-6 text-xs text-gray-400 text-center leading-relaxed">
        {t("auth.login.privacyNote")} ·{" "}
        <Link href="/faq" className="hover:text-gray-600 underline underline-offset-2 transition-colors">
          {t("common.faq")}
        </Link>
      </p>
    </div>
  );
}

function LoginPageInner() {
  const t = useT();
  const features = [
    t("auth.login.feature1"),
    t("auth.login.feature2"),
    t("auth.login.feature3"),
    t("auth.login.feature4"),
  ];
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
            {t("auth.login.leftPanelHeadline").split("\n").map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8">
            {t("auth.login.leftPanelSubtitle")}
          </p>
          <ul className="space-y-3">
            {features.map((text) => (
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
          {t("auth.login.tagline")}
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
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}
