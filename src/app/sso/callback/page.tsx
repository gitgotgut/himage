"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function SsoCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const token = params.get("token");
    const next = params.get("next") || "/hub";

    if (!token) {
      setFailed(true);
      return;
    }

    signIn("sso", { token, redirect: false }).then((res) => {
      if (res?.error) {
        setFailed(true);
      } else {
        router.replace(next);
        router.refresh();
      }
    });
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-gray-500">
        {failed ? "Sign-in failed. Please try again from hifamily." : "Signing you in…"}
      </p>
    </div>
  );
}

export default function SsoCallbackPage() {
  return (
    <Suspense fallback={null}>
      <SsoCallback />
    </Suspense>
  );
}
