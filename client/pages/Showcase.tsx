import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Lock } from "lucide-react";

/* Unlisted extended-work page.
   - Not linked from anywhere on the site; reachable only by direct URL.
   - noindex/nofollow injected below so search engines skip it.
   - IMPORTANT: this is unlisted, NOT private. Anyone holding the URL can open
     it, and the content ships in the public JS bundle. Keep every entry at
     interview level: role, stack, what was built. No client data, no
     confidential screenshots, no metrics that can't be verified.
   - Route slug lives in App.tsx — change it there to rotate the URL.
   - Live links appear ONLY for URLs verified reachable at build time. A
     project with no `href` renders without a link — never guess a URL. */

type Featured = {
  title: string;
  category: string;
  role: string;
  stack: string[];
  detail: string;
  highlights: string[];
  href?: string;
  img?: string;
};

const featured: Featured[] = [
  {
    title: "My Ocean Basket",
    category: "E-commerce Platform",
    role: "Full-Stack / Mobile Developer",
    stack: ["Flutter", "Firebase", "React", "Razorpay"],
    detail:
      "Multi-app commerce system: customer shopping app, rider delivery app, vendor management, and an ordering website — all on a shared Firebase backend.",
    highlights: [
      "Real-time order workflows & tracking",
      "COD + online payments (Razorpay)",
      "Google Maps address selection",
      "Push notifications & authentication",
      "Location-based shop filtering, coupons, reorder",
    ],
    href: "https://myoceanbasket.in/",
    img: "/projects/ext/myoceanbasket.webp",
  },
  {
    title: "Guidance Guru",
    category: "AI Career-Guidance Platform",
    role: "Mobile / Full-Stack Developer",
    stack: ["Flutter", "Firebase", "Gemini API"],
    detail:
      "Multi-role platform for students, parents, and counsellors with AI-assisted career recommendations and real-time communication.",
    highlights: [
      "AI career guidance via Gemini",
      "Real-time chat & counsellor scheduling",
      "Parent–student account linking",
      "Cloud Functions, FCM notifications",
      "Admin dashboard",
    ],
  },
  {
    title: "BioMax Attendance",
    category: "Biometric HRMS",
    role: "Full-Stack / IoT Integration",
    stack: ["Firebase", "IoT", "React", "Cloud Functions"],
    detail:
      "Biometric attendance devices synced to a cloud pipeline: capture, payroll-ready reporting, and a live admin dashboard.",
    highlights: [
      "Biometric device integration",
      "Attendance synchronization",
      "Payroll-related reporting",
      "Live admin dashboard",
    ],
  },
  {
    title: "Bharat Lakshya",
    category: "Government-Scheme Data Platform",
    role: "Automation / Data Engineering",
    stack: ["Python", "Web Scraping", "Multilingual Data"],
    detail:
      "Automated collection of government scheme data — eligibility criteria, FAQs — processed across multiple languages including Urdu into a structured, searchable dataset. Data collection is complete; language-level validation is ongoing.",
    highlights: [
      "Automated multi-source scraping",
      "Multilingual processing (incl. Urdu)",
      "Eligibility criteria & FAQ extraction",
      "Structured searchable output",
    ],
  },
  {
    title: "Gold Prediction / Confluence",
    category: "Market-Analysis Platform",
    role: "Developer (team project)",
    stack: ["Python", "ML", "Market Data"],
    detail:
      "Price-prediction and confluence-signal system built with a team on live market data feeds and order-flow analysis.",
    highlights: [
      "Live market data ingestion",
      "Confluence signal generation",
      "Order-flow analysis",
      "ML-based price modelling",
    ],
  },
];

type WebWork = {
  title: string;
  kind: string;
  note: string;
  href?: string;
  img?: string;
};

/* Links only where the URL was verified live. The Forex Edu's site was
   unreachable at the last check — listed without a link on purpose. */
const webWork: WebWork[] = [
  { title: "Gyaansthal", kind: "Education Platform", note: "School website with content management system.", href: "https://gyaansthal.com/", img: "/projects/ext/gyaansthal.webp" },
  { title: "RentalX / StashIt", kind: "Rental Marketplace", note: "UAE-based rental marketplace — website and admin panel." },
  { title: "TROVX", kind: "Web Platform", note: "Corporate web platform.", href: "https://trovx.io/", img: "/projects/ext/trovx.webp" },
  { title: "FXCTY", kind: "Trading Website", note: "Trading-sector business website.", href: "https://fxcty.com/", img: "/projects/ext/fxcty.webp" },
  { title: "Tranquil HVAC", kind: "Service Business Site", note: "HVAC service-business website.", href: "http://hvactranquil.com/", img: "/projects/ext/hvactranquil.webp" },
  { title: "Innovation Africa", kind: "Corporate Website", note: "Corporate website for a South-African organisation.", href: "https://innovationafrica.co.za/", img: "/projects/ext/innovationafrica.webp" },
  { title: "Nutriwala", kind: "Business Website", note: "Nutrition business website.", href: "https://nutriwala.in/", img: "/projects/ext/nutriwala.webp" },
  { title: "Advertising with Sushma", kind: "Business Website", note: "Advertising services website.", href: "https://advertisewithsushama.com/", img: "/projects/ext/sushma.webp" },
  { title: "The Forex Edu", kind: "Education Website", note: "Forex-education website (currently offline)." },
  { title: "Story App Dashboard", kind: "Admin Dashboard", note: "Content administration dashboard for a story application." },
  { title: "TAP Academy", kind: "Education Website", note: "Training-academy web presence." },
  { title: "Aura Jewellery", kind: "Business Website", note: "Jewellery business website." },
  { title: "Duct Service Pros", kind: "Service Business Site", note: "Air-duct cleaning service website." },
  { title: "Turn On MC", kind: "Business Website", note: "Business website project." },
  { title: "FXEA", kind: "Trading Website", note: "Trading-sector web project." },
];

function StackTag({ children }: { children: string }) {
  return (
    <span className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
      {children}
    </span>
  );
}

/* Renders its image only while the file actually loads — a missing capture
   degrades to a text card instead of a broken-image icon. */
function CardImage({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.06] mb-4">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setOk(false)}
        className="w-full h-auto object-cover object-top"
      />
    </div>
  );
}

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
      <div className="mx-auto max-w-[1000px]">
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
        <p className="text-sm text-slate-500 mb-14 max-w-2xl">
          Selected professional work across web, mobile, AI, automation, and
          cloud systems. Roles and scope are described at a high level;
          confidential details are intentionally omitted.
        </p>

        {/* ── Featured Engineering Work ── */}
        <h2 className="text-xl font-display font-bold text-white mb-1">
          Featured Engineering Work
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Production systems spanning mobile, cloud, AI, and data automation.
        </p>
        <div className="space-y-6 mb-16">
          {featured.map((w) => (
            <div
              key={w.title}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 md:p-8"
            >
              {w.img && <CardImage src={w.img} alt={`${w.title} screenshot`} />}
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <h3 className="text-xl font-display font-bold text-white">
                  {w.title}
                </h3>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {w.category}
                </span>
              </div>
              <p className="text-sm text-purple-300/80 mb-3">Role: {w.role}</p>
              <p className="text-[15px] leading-relaxed text-slate-400 mb-4">
                {w.detail}
              </p>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-5">
                {w.highlights.map((h) => (
                  <li key={h} className="text-sm text-slate-400 flex gap-2">
                    <span className="text-purple-400 mt-[3px]">•</span>
                    {h}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-2">
                {w.stack.map((s) => (
                  <StackTag key={s}>{s}</StackTag>
                ))}
                {w.href && (
                  <a
                    href={w.href}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-purple-300 hover:text-white transition-colors"
                  >
                    Live site <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Professional Web & Product Work ── */}
        <h2 className="text-xl font-display font-bold text-white mb-1">
          Professional Web &amp; Product Work
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Client and business websites, platforms, and dashboards worked on
          professionally. Live links are shown only where the site is publicly
          reachable.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {webWork.map((w) => (
            <div
              key={w.title}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 flex flex-col"
            >
              {w.img && <CardImage src={w.img} alt={`${w.title} screenshot`} />}
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <h3 className="font-display font-bold text-white">{w.title}</h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                  {w.kind}
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed flex-1">
                {w.note}
              </p>
              {w.href && (
                <a
                  href={w.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-purple-300 hover:text-white transition-colors"
                >
                  Live site <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} Bhushan Tunlait. This page is unlisted
          and intended for direct sharing with recruiters and collaborators.
          Confidential and NDA-protected work is intentionally omitted or
          described only at a high level.
        </p>
      </div>
    </main>
  );
}
