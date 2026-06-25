"use client";

import { useEffect, useRef, useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

type Item = { name: string; cat: string; amount: string; color: string };

const SUBS_ITEMS: Item[] = [
  { name: "Netflix",        cat: "Streaming", amount: "$15.99/mo", color: "bg-purple-100 text-purple-700" },
  { name: "Spotify",        cat: "Streaming", amount: "$9.99/mo",  color: "bg-purple-100 text-purple-700" },
  { name: "Gym membership", cat: "Fitness",   amount: "$34.99/mo", color: "bg-green-100 text-green-700"   },
];

const INS_ITEMS: Item[] = [
  { name: "TrygVesta",  cat: "Health", amount: "kr 480/mo", color: "bg-blue-100 text-blue-700"    },
  { name: "Alka",       cat: "Car",    amount: "kr 220/mo", color: "bg-amber-100 text-amber-700"   },
  { name: "Topdanmark", cat: "Home",   amount: "kr 190/mo", color: "bg-orange-100 text-orange-700" },
];

// ─── Count-up hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 380) {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    fromRef.current = target;
    if (from === target) return;

    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setValue(from + (target - from) * ease);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

// ─── Dashboard top bar (mimics real DashboardHeader) ─────────────────────────

function MockTopBar({ scene }: { scene: "subs" | "insurance" }) {
  const activeTab = "rounded-md bg-[#4A6FA5]/10 text-[#4A6FA5] font-semibold px-2 py-0.5";
  const inactiveTab = "text-gray-400 px-2 py-0.5";

  return (
    <div className="flex items-center gap-4 border-b border-gray-200 bg-white px-4 py-2 text-[10px]">
      {/* Logo */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="inline-block h-2 w-2 rounded-full bg-[#C8644A]" />
        <span className="font-bold text-gray-800 text-[11px]">Hugo</span>
      </div>

      {/* Module tabs */}
      <div className="flex items-center gap-1 flex-1">
        <span className={inactiveTab}>Hub</span>
        <span className={scene === "subs" ? activeTab : inactiveTab}>Subscriptions</span>
        <span className={scene === "insurance" ? activeTab : inactiveTab}>Insurance</span>
      </div>

      {/* Right side: currency + language */}
      <div className="flex items-center gap-2 text-gray-400 shrink-0">
        <span>DKK</span>
        <span className="w-px h-3 bg-gray-200" />
        <span>EN</span>
      </div>
    </div>
  );
}

// ─── Sidebar (sub-pages only for active module) ───────────────────────────────

function Sidebar({ scene }: { scene: "subs" | "insurance" }) {
  const activeClass = "rounded-md bg-[#4A6FA5]/10 text-[#4A6FA5] font-semibold";
  const inactiveClass = "rounded-md text-gray-400";

  return (
    <div className="w-32 shrink-0 border-r border-gray-200 bg-white flex flex-col py-3 px-2 text-[10px]">
      {scene === "subs" ? (
        <>
          <span className={`px-2 py-1 ${activeClass}`}>Overview</span>
          <span className={`px-2 py-1 ${inactiveClass}`}>Analytics</span>
          <span className={`px-2 py-1 ${inactiveClass}`}>Import</span>
          <span className={`px-2 py-1 ${inactiveClass}`}>Settings</span>
        </>
      ) : (
        <>
          <span className={`px-2 py-1 ${activeClass}`}>Home</span>
          <span className={`px-2 py-1 ${inactiveClass}`}>Policies</span>
          <span className={`px-2 py-1 ${inactiveClass}`}>Claims</span>
          <span className={`px-2 py-1 ${inactiveClass}`}>Billing</span>
        </>
      )}
    </div>
  );
}

// ─── Animated item card ───────────────────────────────────────────────────────

function ItemCard({ name, cat, amount, color }: Item) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium shrink-0 ${color}`}>{cat}</span>
      <span className="flex-1 text-xs font-medium text-gray-800 truncate">{name}</span>
      <span className="text-xs font-semibold text-gray-900 shrink-0">{amount}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DashboardPreview() {
  const [scene, setScene] = useState<"subs" | "insurance">("subs");
  const [step, setStep] = useState(0);
  const [fading, setFading] = useState(false);

  const items = scene === "subs" ? SUBS_ITEMS : INS_ITEMS;

  const subsMonthly = SUBS_ITEMS.slice(0, scene === "subs" ? step : 0)
    .reduce((s, i) => s + parseFloat(i.amount.replace("$", "").replace("/mo", "")), 0);
  const insMonthly = INS_ITEMS.slice(0, scene === "insurance" ? step : 0)
    .reduce((s, i) => s + parseInt(i.amount.replace("kr ", "").replace("/mo", "")), 0);

  const displaySubsMonthly = useCountUp(subsMonthly);
  const displaySubsAnnual  = useCountUp(subsMonthly * 12);
  const displayInsMonthly  = useCountUp(insMonthly);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (step < items.length) {
      t = setTimeout(() => setStep((s) => s + 1), 900);
    } else {
      t = setTimeout(() => {
        setFading(true);
        setTimeout(() => {
          setScene((s) => (s === "subs" ? "insurance" : "subs"));
          setStep(0);
          setTimeout(() => setFading(false), 80);
        }, 500);
      }, 2800);
    }
    return () => clearTimeout(t);
  }, [step, items.length]);

  const fmtUSD = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const url = scene === "subs" ? "hugo.app/subscriptions" : "hugo.app/insurance";

  return (
    <div className={`transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}>
      <div className="rounded-2xl border border-border bg-muted overflow-hidden shadow-lg shadow-primary/5">

        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-white">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <span className="ml-4 flex-1 rounded bg-gray-100 h-5 max-w-xs text-[10px] text-gray-400 flex items-center px-3 transition-all duration-300">
            {url}
          </span>
        </div>

        {/* Dashboard top bar — module switcher (matches real DashboardHeader) */}
        <MockTopBar scene={scene} />

        {/* Two-panel layout */}
        <div className="flex" style={{ minHeight: 300 }}>
          <Sidebar scene={scene} />

          {/* Content */}
          <div className="flex-1 p-5 space-y-3 bg-[#F5F7FA]">

            {/* Summary cards */}
            {scene === "subs" ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 bg-white p-3">
                  <p className="text-[9px] text-gray-400 mb-1">Monthly spend</p>
                  <p className="text-xl font-bold text-gray-900">${fmtUSD(displaySubsMonthly)}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-3">
                  <p className="text-[9px] text-gray-400 mb-1">Annual spend</p>
                  <p className="text-xl font-bold text-gray-900">${fmtUSD(displaySubsAnnual)}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 bg-white p-3">
                  <p className="text-[9px] text-gray-400 mb-1">Monthly premium</p>
                  <p className="text-xl font-bold text-gray-900">kr {Math.round(displayInsMonthly)}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-3">
                  <p className="text-[9px] text-gray-400 mb-1">Policies active</p>
                  <p className="text-xl font-bold text-gray-900">{step}</p>
                </div>
              </div>
            )}

            {/* Item list — fixed height prevents layout shift */}
            <div className="space-y-2 h-[150px]">
              {items.slice(0, step).map((item) => (
                <ItemCard key={item.name} {...item} />
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
