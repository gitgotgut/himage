"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = { q: string; a: React.ReactNode };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-gray-100">
      {items.map((item, i) => (
        <div key={item.q}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 py-5 text-left"
          >
            <span className="font-semibold text-gray-900 text-sm">{item.q}</span>
            <ChevronDown
              className={`shrink-0 h-4 w-4 text-gray-400 transition-transform duration-200 ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {open === i && (
            <p className="pb-5 text-sm text-gray-500 leading-relaxed">{item.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}
