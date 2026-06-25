"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Sparkles, AlertTriangle, Shield, Lightbulb, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/lib/i18n";

type Insight = {
  type: "overlap" | "gap" | "suggestion";
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  relatedPolicies: string[];
};

const CACHE_KEY = "hugo_ai_insights";

type CachedInsights = {
  insights: Insight[];
  cachedAt: number;
};

function loadCachedInsights(): CachedInsights | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CachedInsights;
  } catch {
    return null;
  }
}

function saveCachedInsights(insights: Insight[]) {
  try {
    const data: CachedInsights = { insights, cachedAt: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable
  }
}

const INSIGHT_STYLES: Record<string, { icon: typeof AlertTriangle; color: string; border: string; bg: string }> = {
  overlap: { icon: AlertTriangle, color: "text-amber-600", border: "border-l-amber-500", bg: "bg-amber-50" },
  gap: { icon: Shield, color: "text-primary", border: "border-l-primary", bg: "bg-primary/10" },
  suggestion: { icon: Lightbulb, color: "text-green-600", border: "border-l-green-500", bg: "bg-green-50" },
};

const SEVERITY_BADGE: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-gray-100 text-gray-600",
};

export function InsuranceAIInsights({ hasAnalyzedDocs, refreshKey }: { hasAnalyzedDocs: boolean; refreshKey?: number }) {
  const t = useT();
  const [insights, setInsights] = useState<Insight[] | null>(() => {
    if (typeof window === "undefined") return null;
    return loadCachedInsights()?.insights ?? null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const prevRefreshKey = useRef(refreshKey);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/insurance/analyze-all", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        const errMsg = data.error || t("insuranceAI.analysisFailed");
        setError(errMsg);
        // Fall back to cached insights so the user still sees previous results
        const cached = loadCachedInsights();
        if (cached?.insights?.length) {
          setInsights(cached.insights);
        }
        return;
      }

      const data = await res.json();
      if (data.noData) {
        setInsights(null);
        localStorage.removeItem(CACHE_KEY);
        return;
      }
      setInsights(data.insights);
      saveCachedInsights(data.insights);
    } catch {
      setError(t("insuranceAI.analysisFailed"));
      // Fall back to cached insights on network errors too
      const cached = loadCachedInsights();
      if (cached?.insights?.length) {
        setInsights(cached.insights);
      }
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Re-fetch only when refreshKey increments (new document was analyzed)
  useEffect(() => {
    if (refreshKey !== undefined && refreshKey !== prevRefreshKey.current) {
      prevRefreshKey.current = refreshKey;
      fetchInsights();
    }
  }, [refreshKey, fetchInsights]);

  // On mount: only fetch if no cache exists and there are analyzed docs
  useEffect(() => {
    if (hasAnalyzedDocs && !loadCachedInsights()) {
      fetchInsights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAnalyzedDocs]);

  if (!hasAnalyzedDocs && !insights) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary/70" />
            {t("insuranceAI.aiInsightsTitle")}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs gap-1.5 h-7"
            disabled={loading}
            onClick={fetchInsights}
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            {loading ? t("insuranceAI.analyzingCoverage") : t("insuranceAI.refreshInsights")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && !insights && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-3">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("insuranceAI.autoAnalyzing")}
          </div>
        )}

        {error && (
          <div className={`text-sm rounded-md px-3 py-2 mb-2 ${insights?.length ? "bg-amber-50 text-amber-700 border border-amber-200" : "text-destructive"}`}>
            {error}
            {insights?.length ? <span className="block text-xs mt-1 text-amber-600/70">Showing cached results from your last successful analysis.</span> : null}
          </div>
        )}

        {!loading && insights && insights.length === 0 && (
          <p className="text-sm text-muted-foreground py-2">{t("insuranceAI.noIssuesFound")}</p>
        )}

        {insights && insights.length > 0 && (
          <div className="space-y-3">
            {insights.map((insight, i) => {
              const style = INSIGHT_STYLES[insight.type] ?? INSIGHT_STYLES.suggestion;
              const Icon = style.icon;
              return (
                <div key={i} className={`rounded-lg border border-l-4 ${style.border} ${style.bg} px-4 py-3`}>
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${style.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-semibold ${style.color}`}>{insight.title}</p>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 border-0 ${SEVERITY_BADGE[insight.severity] ?? SEVERITY_BADGE.low}`}>
                          {insight.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground/80 mt-1 leading-relaxed">{insight.description}</p>
                      {insight.relatedPolicies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {insight.relatedPolicies.map((name, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">{name}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
