import { marqueeItems as defaultMarquee } from "@/lib/data";
import { Sparkles } from "lucide-react";

export default function FeatureMarquee({ items = defaultMarquee }: { items?: string[] }) {
  const list = items.length > 0 ? items : defaultMarquee;
  const doubled = [...list, ...list];

  return (
    <section className="overflow-hidden border-y border-border bg-white py-4">
      <div className="marquee-track flex w-max items-center gap-8">
        {doubled.map((item, i) => (
          <div key={`${item}-${i}`} className="flex shrink-0 items-center gap-8">
            <div className="flex items-center gap-3">
              <Sparkles className="h-4 w-4 text-primary" strokeWidth={2.5} />
              <span className="whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.12em] text-dark">
                {item}
              </span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
          </div>
        ))}
      </div>
    </section>
  );
}
