import { useEffect } from "react";
import { ArrowLeft, Lock } from "lucide-react";

/* Unlisted extended-work page.
   - Not linked from anywhere on the site; reachable only by direct URL.
   - noindex/nofollow injected below so search engines skip it.
   - IMPORTANT: this is unlisted, NOT private. Anyone holding the URL can open
     it, and the content ships in the public JS bundle. Keep every entry at
     interview level: role, stack, what was built. No client data, no
     confidential screenshots, no internal names beyond what is already public.
   Route slug lives in App.tsx — change it there to rotate the URL. */

const work = [
  {
    title: "My Ocean Basket",
    role: "E-commerce platform — customer mobile app, admin panel, ordering flow",
    stack: ["Flutter", "Firebase", "React", "Razorpay"],
    detail:
      "Cross-platform shopping app with real-time inventory, order management, push notifications, and a React admin panel for catalogue, orders, and delivery workflows.",
  },
  {
    title: "Guidance Guru",
    role: "AI career-guidance platform for students, parents, and counsellors",
    stack: ["Flutter", "Firebase", "Gemini API"],
    detail:
      "Multi-role mobile platform with AI-assisted career recommendations, real-time chat, counsellor scheduling, and notification flows.",
  },
  {
    title: "BioMax Attendance",
    role: "Biometric attendance & HRMS system",
    stack: ["Firebase", "IoT", "React", "Cloud Functions"],
    detail:
      "Biometric device integration synced to a cloud pipeline — attendance capture, payroll-ready reporting, and a live admin dashboard.",
  },
  {
    title: "Bharat Lakshya",
    role: "Government-scheme data platform",
    stack: ["Python", "Web Scraping", "Multilingual Data"],
    detail:
      "Automated collection and multilingual processing of government scheme data into a structured, searchable dataset.",
  },
  {
    title: "Gold Prediction / Confluence",
    role: "Market-analysis and signal platform",
    stack: ["Python", "ML", "Market Data"],
    detail:
      "Price-prediction and confluence-signal system built on live market data feeds and order-flow analysis.",
  },
];

export default function Showcase() {
  // SPA equivalent of a noindex header — added on mount, removed on leave.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <main className="min-h-screen bg-[#030014] text-slate-300 px-6 py-16">
      <div className="mx-auto max-w-[900px]">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" /> Back to portfolio
        </a>

        <div className="flex items-center gap-3 mb-2">
          <Lock className="h-5 w-5 text-purple-400" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
            Unlisted — shared by direct link only
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
          Extended Work
        </h1>
        <p className="text-sm text-slate-500 mb-12 max-w-xl">
          Professional projects described at a high level — role, stack, and
          scope only. Confidential details, client data, and internal material
          are intentionally omitted.
        </p>

        <div className="space-y-6">
          {work.map((w) => (
            <div
              key={w.title}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 md:p-8"
            >
              <h2 className="text-xl font-display font-bold text-white mb-1">
                {w.title}
              </h2>
              <p className="text-sm text-purple-300/80 mb-3">{w.role}</p>
              <p className="text-[15px] leading-relaxed text-slate-400 mb-4">
                {w.detail}
              </p>
              <div className="flex flex-wrap gap-2">
                {w.stack.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-600 mt-12">
          © {new Date().getFullYear()} Bhushan Tunlait. This page is unlisted
          and intended for direct sharing with recruiters and collaborators.
        </p>
      </div>
    </main>
  );
}
