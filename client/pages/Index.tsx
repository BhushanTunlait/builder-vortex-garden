import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Bot,
  BotMessageSquare,
  Briefcase,
  ChevronDown,
  Code2,
  Download,
  ExternalLink,
  Github,
  Globe,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Send,
  Smartphone,
  Sparkles,
  Star,
  Terminal,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════ */

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const projects = [
  {
    title: "trimbakeshwarkalsarpdoshpooja.com",
    href: "https://trimbakeshwarkalsarpdoshpooja.com/",
    desc: "Complete Hindu rituals booking system with SEO optimization, marketing funnels, and optimized conversion flow.",
    tags: ["WordPress", "SEO", "E-Commerce"],
  },
  {
    title: "khushigoyal.site",
    href: "https://khushigoyal.site",
    desc: "Elegant personal portfolio with modern design system, fluid animations, and SEO-friendly architecture.",
    tags: ["Portfolio", "Design", "Performance"],
  },
];

const services = [
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Web Development",
    desc: "WordPress, WooCommerce, Laravel backends, and React admin panels. From landing pages to full-stack SaaS platforms with secure payment integrations.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Flutter Mobile Apps",
    desc: "Cross-platform mobile applications with Flutter & Dart, powered by Firebase for real-time data, auth, push notifications, and cloud functions.",
    color: "from-violet-500 to-purple-400",
  },
  {
    icon: <Code2 className="h-6 w-6" />,
    title: "React Admin Panels",
    desc: "Custom dashboards and admin interfaces built with React, TailwindCSS, and Firebase. Real-time data, role-based access, and beautiful UI/UX.",
    color: "from-pink-500 to-rose-400",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "AI Agents & API Integration",
    desc: "Building intelligent AI agents, LLM-powered workflows, and API integrations that automate processes and supercharge business operations.",
    color: "from-amber-500 to-orange-400",
  },
];

const techStack = [
  { name: "React", icon: "⚛️" },
  { name: "Flutter", icon: "📱" },
  { name: "TypeScript", icon: "🔷" },
  { name: "Laravel", icon: "🔺" },
  { name: "WordPress", icon: "📝" },
  { name: "Firebase", icon: "🔥" },
  { name: "TailwindCSS", icon: "🎨" },
  { name: "Node.js", icon: "🟢" },
  { name: "MySQL", icon: "🗄️" },
  { name: "REST APIs", icon: "🔗" },
  { name: "AI Agents", icon: "🤖" },
  { name: "Git", icon: "📦" },
];

const stats = [
  { value: "20+", label: "Projects Delivered", color: "from-blue-500 to-cyan-400" },
  { value: "1+", label: "Years Experience", color: "from-violet-500 to-purple-400" },
  { value: "15+", label: "Happy Clients", color: "from-pink-500 to-rose-400" },
  { value: "99%", label: "Client Satisfaction", color: "from-amber-500 to-orange-400" },
];

/* ═══════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ═══════════════════════════════════════════════
   HELPER COMPONENTS
   ═══════════════════════════════════════════════ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={fadeUp}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 mb-6"
    >
      <div className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
        {children}
      </span>
    </motion.div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      variants={fadeUp}
      className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white leading-[1.1]"
    >
      {children}
    </motion.h2>
  );
}

/** Counts up from 0 to a numeric target, with suffix like + or % */
function AnimatedCounter({
  value,
  label,
  icon,
  color,
  index,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  // Derived as primitives so the effect's deps stay referentially stable —
  // a raw .match() result is a fresh object on every render.
  const target = Number.parseInt(value, 10);
  const hasNumber = Number.isFinite(target);
  const suffix = hasNumber ? value.replace(/^\d+/, "") : "";

  useEffect(() => {
    if (!inView) return;
    const node = numberRef.current;
    if (!node) return;
    if (!hasNumber) {
      node.textContent = value;
      return;
    }

    // Straight to the final value when the user asked for less motion.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = `${target}${suffix}`;
      return;
    }

    const duration = 1800;
    const startTime = performance.now();
    let raf = 0;

    // Writes textContent directly rather than calling setState per frame: a
    // state update here re-rendered this motion.div + its TiltCard subtree on
    // every one of ~108 frames, x4 counters, exactly as the stats row scrolls
    // into view. The counter owns one text node — nothing else needs to react.
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      node.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [inView, value, suffix, target, hasNumber]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <TiltCard intensity={6} className="relative group rounded-2xl p-6 md:p-8 text-center overflow-hidden bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06] hover:border-purple-500/30 transition-all duration-500">
        {/* Hover glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500 rounded-2xl`} />

        {/* Icon */}
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg mb-4 mx-auto`}>
          {icon}
        </div>

        {/* Number — text is driven imperatively by the count-up effect above.
            Rendering the suffix up front keeps the box the right width so the
            row doesn't reflow as digits land. */}
        <div
          ref={numberRef}
          className="text-4xl md:text-5xl font-display font-bold text-white mb-1 tracking-tight text-glow"
        >
          {hasNumber ? `0${suffix}` : value}
        </div>

        {/* Label */}
        <div className="text-sm text-slate-400 font-medium tracking-wide">
          {label}
        </div>

        {/* Bottom shine line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </TiltCard>
    </motion.div>
  );
}

function previewCandidates(url: string, width = 1200) {
  const u = encodeURIComponent(url);
  return [
    `https://s.wordpress.com/mshots/v1/${u}?w=${width}&scale=2`,
    `https://s0.wp.com/mshots/v1/${u}?w=${width}&scale=2`,
    `https://image.thum.io/get/width/${width}/noanimate/${url}`,
  ];
}

function PreviewImage({ url, alt }: { url: string; alt: string }) {
  const urls = previewCandidates(url);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const idxRef = useRef(0);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-pink-900/40 grid place-items-center">
        <span className="text-lg font-display font-semibold text-white/60">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={urls[0]}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        idxRef.current += 1;
        const next = urls[idxRef.current];
        if (next) (e.currentTarget as HTMLImageElement).src = next;
        else setFailed(true);
      }}
      className="h-full w-full object-cover object-top transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
    />
  );
}

/* ═══════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════ */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
        scrolled
          ? "py-3 bg-black/60 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "py-5 bg-transparent"
      )}
    >
      <div className="mx-auto max-w-[1200px] px-6 flex items-center justify-between">
        <a
          href="#hero"
          className="font-display font-bold text-xl text-white tracking-tight hover:text-purple-300 transition-colors"
        >
          Bhushan<span className="text-purple-400">.</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-300"
            >
              {link.label}
            </a>
          ))}
          <a href="#contact" className="ml-4">
            <Button className="h-11 px-6 text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-0 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all">
              Let's Talk
            </Button>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2.5 text-white rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-full left-0 right-0 bg-black/95 border-b border-white/5 p-6 space-y-2"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="block mt-4"
          >
            <Button className="w-full h-12 font-semibold bg-gradient-to-r from-purple-600 to-indigo-600">
              Let's Talk
            </Button>
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}

/* ═══════════════════════════════════════════════
   3D TILT CARD — Interactive perspective on hover
   ═══════════════════════════════════════════════ */

function TiltCard({
  children,
  className,
  intensity = 12,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Rect is measured once on enter instead of on every mousemove. Reading
  // getBoundingClientRect() and then writing .style.transform in the same
  // handler forces a synchronous layout per event (~120/sec, x9 TiltCards).
  const rectRef = useRef<DOMRect | null>(null);
  const frameRef = useRef(0);
  const pendingRef = useRef({ x: 0, y: 0 });

  const onEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    rectRef.current = el.getBoundingClientRect();
    // Promote only while actually hovering — a permanent will-change on every
    // card keeps 9 compositor layers alive for effects that are idle.
    el.style.willChange = "transform";
    pendingRef.current = { x: e.clientX, y: e.clientY };
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current) return;
    pendingRef.current = { x: e.clientX, y: e.clientY };
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      const el = ref.current;
      const rect = rectRef.current;
      if (!el || !rect) return;
      const { x, y } = pendingRef.current;
      const nx = (x - rect.left) / rect.width - 0.5;
      const ny = (y - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateX(${-ny * intensity}deg) rotateY(${nx * intensity}deg) scale3d(1.02,1.02,1.02)`;
    });
  };

  const onLeave = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
    rectRef.current = null;
    const el = ref.current;
    if (el) {
      el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
      el.style.willChange = "auto";
    }
  };

  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("transition-transform duration-200 ease-out", className)}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HOOKS: Mouse Parallax & Particle Canvas
   ═══════════════════════════════════════════════ */

function useMousePosition() {
  const mouse = useRef({ x: 0, y: 0, nx: 0.5, ny: 0.5 });
  useEffect(() => {
    const finePointer = matchMedia("(pointer: fine)").matches;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;
    const handler = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.nx = e.clientX / window.innerWidth;
      mouse.current.ny = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return mouse;
}

/** Particle network canvas for the hero — only animates while `active` (in view) */
function useParticleCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  containerRef: React.RefObject<HTMLElement | null>,
  active: boolean,
) {
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const finePointer = matchMedia("(pointer: fine)").matches;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Skip the whole simulation on touch devices. The particle field's only
    // interactive payoff is cursor repulsion, which a touch device can never
    // trigger, so on phones it was pure cost — and phones are exactly where the
    // per-frame canvas fill hurts most. The hero still has its orbs, grid and
    // gradient there, so it doesn't read as empty.
    if (reduceMotion || !finePointer) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cap at 1.5x rather than 2x: on a retina panel this is the difference
    // between filling ~4x and ~2.25x the CSS pixels every frame, and at this
    // blur/opacity the extra density is not perceptible.
    let dpr = Math.max(1, Math.min(1.5, window.devicePixelRatio || 1));
    let width = 0, height = 0;
    type P = { x: number; y: number; vx: number; vy: number; size: number; alpha: number };
    let particles: P[] = [];
    let rafId = 0;
    const pointer = { x: 0, y: 0, active: false };
    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.max(1, Math.min(1.5, window.devicePixelRatio || 1));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = width * height;
      const base = Math.round(area * 0.00005);
      const count = Math.max(40, Math.min(90, base));
      particles = Array.from({ length: count }, () => ({
        x: rand(0, width),
        y: rand(0, height),
        vx: rand(-0.3, 0.3),
        vy: rand(-0.3, 0.3),
        size: rand(1, 2.5),
        alpha: rand(0.3, 0.8),
      }));
    };

    const step = () => {
      if (!activeRef.current || document.hidden) {
        rafId = requestAnimationFrame(step);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse repulsion — squared-distance reject before any square root.
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 120 * 120 && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 120) * 0.8;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }
        // Dampen velocity
        p.vx *= 0.99;
        p.vy *= 0.99;
      }

      // Draw connections.
      // This pass is inherently O(n²) — every particle is tested against every
      // other one. What matters is the cost of the *rejection*, since the vast
      // majority of pairs are out of range: compare squared distances so the
      // common case is two multiplies and a compare, take the square root only
      // for pairs that actually connect, and reject on dx before touching dy.
      // Math.hypot() is correct but slow (it guards against over/underflow),
      // and it was being called on every pair, every frame.
      const maxDist = 130;
      const maxDistSq = maxDist * maxDist;
      const count = particles.length;
      ctx.lineWidth = 0.8;
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        for (let j = i + 1; j < count; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          if (dx > maxDist || dx < -maxDist) continue;
          const dy = p.y - q.y;
          if (dy > maxDist || dy < -maxDist) continue;
          const distSq = dx * dx + dy * dy;
          if (distSq >= maxDistSq) continue;
          const alpha = (1 - Math.sqrt(distSq) / maxDist) * 0.25;
          ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      // Draw particles
      for (const p of particles) {
        let r = p.size;
        let glow = false;
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 160 * 160) {
            r = p.size + (1 - Math.sqrt(distSq) / 160) * 2;
            glow = true;
          }
        }

        ctx.fillStyle = glow
          ? `rgba(139,92,246,${Math.min(1, p.alpha + 0.2)})`
          : `rgba(139,92,246,${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw pointer glow
      if (pointer.active) {
        const grad = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 200);
        grad.addColorStop(0, "rgba(139,92,246,0.08)");
        grad.addColorStop(1, "rgba(139,92,246,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 200, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(step);
    };

    const onEnter = () => { pointer.active = true; };
    const onLeave = () => { pointer.active = false; };
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };

    resize();
    window.addEventListener("resize", resize);
    if (finePointer) {
      container.addEventListener("mouseenter", onEnter);
      container.addEventListener("mouseleave", onLeave);
      container.addEventListener("mousemove", onMove);
    }
    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      container.removeEventListener("mousemove", onMove);
    };
  }, [canvasRef, containerRef]);
}

/* ═══════════════════════════════════════════════
   GLOBAL MOUSE SPOTLIGHT (follows cursor across page)
   ═══════════════════════════════════════════════ */

function MouseSpotlight() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = matchMedia("(pointer: fine)").matches;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    let curX = -500, curY = -500;
    let targetX = -500, targetY = -500;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      // No `+ window.scrollY` here: the spotlight is position:fixed, so its
      // coordinates are viewport-relative. Adding the scroll offset pushed it
      // permanently below the fold after ~700px of scrolling — the glow simply
      // stopped following the cursor while its layer kept animating off-screen.
      targetX = e.clientX;
      targetY = e.clientY;
      if (!raf && !document.hidden) raf = requestAnimationFrame(animate);
    };

    // Self-halting easing loop: runs only while there is distance left to
    // close, then stops until the pointer moves again. Previously this span
    // at 60fps for the entire session even with a completely idle mouse.
    const animate = () => {
      raf = 0;
      const dx = targetX - curX;
      const dy = targetY - curY;
      curX += dx * 0.08;
      curY += dy * 0.08;
      const el = spotRef.current;
      if (el) el.style.transform = `translate3d(${curX - 300}px, ${curY - 300}px, 0)`;
      if ((Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) && !document.hidden) {
        raf = requestAnimationFrame(animate);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={spotRef}
      className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] z-[1] opacity-40 hidden md:block"
      style={{
        background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.06) 30%, transparent 70%)",
        transform: "translate(-500px, -500px)",
        willChange: "transform",
      }}
      aria-hidden="true"
    />
  );
}

/* ═══════════════════════════════════════════════
   MAGNETIC BUTTON WRAPPER
   ═══════════════════════════════════════════════ */

function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const finePointer = matchMedia("(pointer: fine)").matches;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    // This is a window-level mousemove listener, so it fires for every pointer
    // movement anywhere on the page for the whole session. It previously called
    // getBoundingClientRect() on each of those events — a forced synchronous
    // layout, per magnetic button, even while scrolled far past the hero.
    // Now: the rect is cached and only re-measured on scroll/resize, the DOM
    // write is rAF-batched, and the whole thing idles while off-screen.
    let rect = el.getBoundingClientRect();
    let onScreen = true;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let settled = true;

    const measure = () => {
      rect = el.getBoundingClientRect();
    };

    const apply = () => {
      frame = 0;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = pointerX - cx;
      const dy = pointerY - cy;
      const dist = Math.hypot(dx, dy);
      const radius = 150;
      const strength = 12;
      if (dist < radius && dist > 0) {
        const pull = 1 - dist / radius;
        el.style.transform = `translate3d(${(dx / dist) * strength * pull}px, ${(dy / dist) * strength * pull}px, 0)`;
        settled = false;
      } else if (!settled) {
        // Only write the reset once, not on every distant mouse move.
        el.style.transform = "translate3d(0,0,0)";
        settled = true;
      }
    };

    const onMove = (e: MouseEvent) => {
      if (!onScreen) return;
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onScrollOrResize = () => {
      if (!onScreen) return;
      measure();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) measure();
      },
      { rootMargin: "200px" },
    );
    io.observe(el);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  return (
    <div ref={ref} className={cn("transition-transform duration-200 ease-out", className)}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════ */

function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Only true while the hero is actually on screen — lets both rAF loops
  // below go idle once the user scrolls past, instead of burning main-thread
  // budget for the rest of the page's scroll.
  const heroInView = useInView(sectionRef, { amount: 0 });
  const heroInViewRef = useRef(heroInView);
  useEffect(() => {
    heroInViewRef.current = heroInView;
  }, [heroInView]);

  // Particle canvas
  useParticleCanvas(canvasRef, sectionRef, heroInView);

  // Mouse-driven parallax on orbs
  useEffect(() => {
    const finePointer = matchMedia("(pointer: fine)").matches;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    let raf = 0;
    let mx = 0.5, my = 0.5;
    let smoothX = 0.5, smoothY = 0.5;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth;
      my = e.clientY / window.innerHeight;
    };

    const animate = () => {
      if (!heroInViewRef.current || document.hidden) {
        raf = requestAnimationFrame(animate);
        return;
      }

      smoothX += (mx - smoothX) * 0.04;
      smoothY += (my - smoothY) * 0.04;
      const dx = (smoothX - 0.5) * 2;
      const dy = (smoothY - 0.5) * 2;

      if (orb1Ref.current) orb1Ref.current.style.transform = `translate3d(${dx * 40}px, ${dy * 30}px, 0)`;
      if (orb2Ref.current) orb2Ref.current.style.transform = `translate3d(${dx * -30}px, ${dy * -25}px, 0)`;
      // -50% keeps orb3 horizontally centred (see the note on its element).
      if (orb3Ref.current) orb3Ref.current.style.transform = `translate(-50%, 0) translate3d(${dx * 20}px, ${dy * 15}px, 0)`;

      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="hero-premium relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Particle Network Canvas — reacts to mouse movement */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[2]"
        aria-hidden="true"
      />

      {/* Animated Grid */}
      <div className="absolute inset-0 animated-grid z-[1]" />

      {/* Parallax Floating Orbs — move with mouse, capped to viewport */}
      <div
        ref={orb1Ref}
        className="absolute top-[15%] left-[15%] w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-purple-600/20 rounded-full blur-[50px] md:blur-[80px] animate-pulse-glow pointer-events-none z-[1] will-change-transform"
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-[15%] right-[15%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-indigo-600/20 rounded-full blur-[50px] md:blur-[70px] animate-pulse-glow pointer-events-none z-[1] will-change-transform"
        style={{ animationDelay: "1.5s" }}
      />
      {/* No -translate-x-1/2 class here: the parallax loop writes an inline
          `transform`, which beats the class and would silently drop the
          centering, kicking this orb ~300px right. Centering is folded into
          the transform the loop writes instead. */}
      <div
        ref={orb3Ref}
        className="absolute top-[40%] left-[50%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-pink-600/10 rounded-full blur-[60px] md:blur-[100px] pointer-events-none z-[1] will-change-transform"
        style={{ transform: "translate(-50%, 0)" }}
      />

      <motion.div
        style={{ y: yText, opacity }}
        className="relative z-10 mx-auto max-w-[1200px] px-5 sm:px-6 py-20 md:py-32 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-300">
            Available for New Projects
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.08] mb-6"
        >
          <span className="text-white">I Build </span>
          <span className="gradient-text">Digital</span>
          <br />
          <span className="gradient-text">Experiences</span>
          <span className="text-white"> That</span>
          <br />
          <span className="text-white">Deliver </span>
          <span className="text-purple-400 text-glow">Results.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Full-stack developer crafting high-performance web applications with
          React, Laravel, and AI-powered workflows. Turning complex ideas into
          elegant, scalable solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton>
            <a href="#projects">
              <Button className="h-14 px-8 text-base font-semibold bg-white text-black hover:bg-slate-100 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:scale-105 transition-all duration-300">
                View My Work
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </MagneticButton>
          <MagneticButton>
            <a href="#contact">
              <Button
                variant="outline"
                className="h-14 px-8 text-base font-semibold border-white/15 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/30 rounded-xl hover:scale-105 transition-all duration-300"
              >
                Get in Touch
              </Button>
            </a>
          </MagneticButton>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <a href="#stats" className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="h-4 w-4 animate-bounce-subtle" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   STATS BAR
   ═══════════════════════════════════════════════ */

const statIcons = [
  <Layers className="h-5 w-5" />,
  <Zap className="h-5 w-5" />,
  <Star className="h-5 w-5" />,
  <Sparkles className="h-5 w-5" />,
];

function StatsBar() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="stats" ref={ref} className="relative py-24 section-darker overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[200px] md:w-[900px] md:h-[400px] bg-purple-600/5 rounded-full blur-[48px] md:blur-[64px] pointer-events-none" />

      <div className="mx-auto max-w-[1200px] px-6 relative z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
              Track Record
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
            Numbers That <span className="gradient-text">Speak.</span>
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <AnimatedCounter
              key={s.label}
              value={s.value}
              label={s.label}
              icon={statIcons[i]}
              color={s.color}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SERVICES SECTION
   ═══════════════════════════════════════════════ */

function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" ref={ref} className="py-16 md:py-28 section-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-purple-600/5 rounded-full blur-[48px] md:blur-[64px] pointer-events-none" />

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={stagger}
        className="mx-auto max-w-[1200px] px-6 relative z-10"
      >
        <div className="text-center mb-16">
          <SectionLabel>What I Do</SectionLabel>
          <SectionTitle>
            Services That Drive <br />
            <span className="gradient-text">Real Growth.</span>
          </SectionTitle>
          <motion.p variants={fadeUp} className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
            From concept to deployment, I deliver end-to-end solutions that
            combine technical excellence with business strategy.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <motion.div key={s.title} variants={scaleIn} custom={i}>
              <TiltCard intensity={8} className="group premium-card rounded-2xl p-8 relative overflow-hidden h-full">
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-lg mb-6`}>
                  {s.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:gradient-text transition-all duration-500">
                  {s.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-[15px]">
                  {s.desc}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   PROJECTS SECTION
   ═══════════════════════════════════════════════ */

function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" ref={ref} className="py-16 md:py-28 section-darker relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-indigo-600/5 rounded-full blur-[48px] md:blur-[64px] pointer-events-none" />

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={stagger}
        className="mx-auto max-w-[1200px] px-6 relative z-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <SectionLabel>Portfolio</SectionLabel>
            <SectionTitle>
              Selected <span className="gradient-text">Projects.</span>
            </SectionTitle>
          </div>
          <motion.p variants={fadeUp} className="text-slate-400 max-w-md text-[15px]">
            Showcasing personal projects I fully own. Client work under NDA is
            not displayed. All trademarks respected.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((p, i) => (
            <motion.a
              key={p.title}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              variants={scaleIn}
              custom={i}
              className="group project-card block relative rounded-2xl overflow-hidden premium-card"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <PreviewImage url={p.href} alt={p.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-all duration-500" />

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md grid place-items-center border border-white/20">
                    <ArrowUpRight className="h-5 w-5 text-white" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full bg-white/10 backdrop-blur-sm text-white/80 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed max-w-md opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    {p.desc}
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   TECH STACK MARQUEE
   ═══════════════════════════════════════════════ */

function TechStackSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const doubled = [...techStack, ...techStack];

  return (
    <section ref={ref} className="py-20 section-dark relative overflow-hidden">
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={stagger}
        className="text-center mb-12"
      >
        <SectionLabel>Tech Stack</SectionLabel>
        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-display font-bold text-white">
          Tools I Work With
        </motion.h2>
      </motion.div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030014] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030014] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee" style={{ width: "max-content" }}>
          {doubled.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              className="flex-shrink-0 mx-3 px-6 py-4 rounded-xl glass border border-white/5 flex items-center gap-3 hover:border-purple-500/30 transition-all duration-300 group cursor-default"
            >
              <span className="text-2xl">{t.icon}</span>
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors whitespace-nowrap">
                {t.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   ABOUT SECTION
   ═══════════════════════════════════════════════ */

function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="py-16 md:py-28 section-darker relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[800px] md:h-[800px] bg-gradient-to-r from-purple-600/5 to-indigo-600/5 rounded-full blur-[48px] md:blur-[64px] pointer-events-none" />

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={stagger}
        className="mx-auto max-w-[1200px] px-6 relative z-10"
      >
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 md:gap-16 items-center">
          {/* Avatar Side — 3D Tilt on Mouse */}
          <motion.div variants={scaleIn} className="flex justify-center">
            <TiltCard className="relative group">
              {/* Glow Ring */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-700" />

              <div className="relative h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-80 lg:w-80 rounded-full overflow-hidden border-2 border-purple-500/30 shadow-[0_0_60px_rgba(139,92,246,0.2)]">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F7dc11070cd594ebb925743307858add3%2F0e608cd323284310addd5b876e127705?format=webp&width=800"
                  alt="Bhushan Tunlait"
                  className="h-full w-full object-contain animate-breathing-human"
                  draggable={false}
                />
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-2 -right-2 px-4 py-2 rounded-full glass-strong border border-purple-500/30 shadow-lg"
              >
                <span className="text-sm font-semibold text-purple-300 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" /> AI-Powered
                </span>
              </motion.div>
            </TiltCard>
          </motion.div>

          {/* Content Side */}
          <div className="space-y-6">
            <SectionLabel>About Me</SectionLabel>
            <SectionTitle>
              Bhushan Tunlait
            </SectionTitle>
            <motion.p variants={fadeUp} className="text-lg text-purple-300/80 font-display font-medium">
              Full-Stack & Mobile Developer | AI Agents Builder
            </motion.p>

            <motion.p variants={fadeUp} className="text-slate-400 leading-relaxed text-[15px]">
              I'm an Information Technology graduate from Anuradha Engineering
              College, Chikhli (Maharashtra, India). I build web platforms with
              WordPress, Laravel, and React, and now I'm focused on Flutter
              mobile apps with Firebase, AI agents, and React-based admin panels
              — using tools like ChatGPT, Claude, and GitHub Copilot to ship
              fast.
            </motion.p>

            <motion.p variants={fadeUp} className="text-slate-400 leading-relaxed text-[15px]">
              Beyond personal projects, I work on live trading platforms and
              corporate web systems under NDA. Currently expanding into mobile
              development and AI agent workflows. My focus is always on
              reliability, performance, and measurable business outcomes.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="h-4 w-4 text-purple-400" />
                Indore, Madhya Pradesh, India
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Briefcase className="h-4 w-4 text-purple-400" />
                Open to Opportunities
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/BhushanTunlait"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 rounded-lg glass border border-white/10 grid place-items-center text-slate-400 hover:text-white hover:border-purple-500/40 transition-all"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/bhushan-tunlait-250105173/"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 rounded-lg glass border border-white/10 grid place-items-center text-slate-400 hover:text-white hover:border-purple-500/40 transition-all"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="mailto:bhushantunlait111@gmail.com"
                className="h-10 w-10 rounded-lg glass border border-white/10 grid place-items-center text-slate-400 hover:text-white hover:border-purple-500/40 transition-all"
              >
                <Mail className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   AI CHAT ASSISTANT
   ═══════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   AI CHAT ENGINE — Smart NLP with scoring, context,
   fuzzy matching, typewriter, quick replies
   ═══════════════════════════════════════════════ */

type ChatReply = {
  text: string;
  chips?: string[];
  topic?: string;
};

/** Knowledge base with weighted keyword matching, follow-up chips, and topic tagging */
const KNOWLEDGE_BASE: {
  keywords: string[];
  synonyms?: string[];
  reply: string | ((ctx: { hour: number; history: string[] }) => string);
  chips?: string[];
  topic: string;
  weight?: number;
}[] = [
  // Greetings — time-aware
  {
    keywords: ["hello", "hi", "hey", "hola", "greetings", "sup", "yo", "howdy", "good morning", "good evening", "good afternoon", "namaste"],
    synonyms: ["whats up", "what's up", "wassup"],
    reply: ({ hour }) => {
      const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
      return `${greeting}! 👋 I'm Bhushan's AI assistant. I know everything about his skills, projects, and experience. What would you like to know?`;
    },
    chips: ["What are his skills?", "Show me projects", "How to contact?"],
    topic: "greeting",
    weight: 0.5,
  },
  // Identity
  {
    keywords: ["who are you", "your name", "introduce", "who r u", "about you", "tell me about yourself", "who is bhushan", "who's bhushan"],
    reply: "I'm the digital twin of **Bhushan Tunlait** — an IT graduate from Chikhli, Maharashtra. He builds web platforms with WordPress, Laravel & React, develops Flutter mobile apps with Firebase, creates AI agents using LLM APIs, and builds React admin panels. Think of me as his 24/7 available representative! 🤖",
    chips: ["What's his tech stack?", "Where is he from?", "Is he available for hire?"],
    topic: "identity",
  },
  // Location
  {
    keywords: ["where", "location", "city", "from where", "based in", "live", "country", "india", "state"],
    synonyms: ["hometown", "place", "region"],
    reply: "📍 Bhushan is from **Chikhli**, a town in Buldana district, **Maharashtra, India**. He works remotely and is open to collaborating with clients globally.",
    chips: ["What's his education?", "Is he open to remote work?"],
    topic: "location",
  },
  // Education
  {
    keywords: ["study", "education", "college", "degree", "university", "qualification", "graduate", "school"],
    synonyms: ["academic", "studied", "learning"],
    reply: "🎓 He studied **Information Technology** at **Anuradha Engineering College, Chikhli**. His education gave him a strong foundation in programming, databases, and system design — which he now combines with AI-powered development to ship production-ready work fast.",
    chips: ["Where has he worked?", "What are his goals?"],
    topic: "education",
  },
  // Work Experience
  {
    keywords: ["intern", "worked at", "work at", "job", "current role", "microspectra", "experience", "career", "company", "employer"],
    synonyms: ["employment", "professional", "working"],
    reply: "💼 He worked at **MicroSpectra (Shegaon)** in an IT engineering role. Beyond that, he currently works on **live trading platforms** and **corporate web systems** under NDA — that work isn't shown publicly but it shaped his focus on reliability, performance, and real business outcomes.",
    chips: ["What's his tech stack?", "Show me his projects"],
    topic: "experience",
  },
  // Goals & Vision
  {
    keywords: ["goal", "goals", "objective", "vision", "future", "plan", "ambition", "dream"],
    synonyms: ["aspiration", "target", "mission"],
    reply: "🚀 His vision: Build scalable web & mobile apps using **AI agents**, **Flutter**, **Firebase**, and modern **React** — delivering 10x faster through intelligent AI-powered workflows. He's focused on bridging the gap between AI capabilities and real-world business applications.",
    chips: ["Tell me about AI agents", "Flutter projects?"],
    topic: "goals",
  },
  // AI & Agents
  {
    keywords: ["ai", "prompt", "chatgpt", "artificial intelligence", "agent", "agents", "llm", "claude", "copilot", "machine learning", "gpt"],
    synonyms: ["neural", "model", "automation"],
    reply: "🤖 This is where it gets exciting! Bhushan builds **AI agents** using LLM APIs (ChatGPT, Claude) that automate complex workflows. He also uses **GitHub Copilot** and AI-assisted development to ship code faster. His agents can handle data processing, customer interactions, content generation, and system integrations — all connected via APIs.",
    chips: ["What about Flutter?", "Tech stack details?", "Hire for AI project?"],
    topic: "ai",
    weight: 1.2,
  },
  // Flutter & Mobile
  {
    keywords: ["flutter", "mobile", "app", "dart", "android", "ios", "cross-platform", "play store", "app store"],
    synonyms: ["smartphone", "native", "hybrid"],
    reply: "📱 He's actively building **cross-platform mobile apps** with **Flutter & Dart**. The backend is powered by **Firebase** — Authentication, Firestore real-time database, Cloud Functions, Storage, and FCM push notifications. He's currently working on multiple Flutter projects simultaneously and loves the hot-reload development speed!",
    chips: ["What about Firebase?", "React admin panels?", "Show projects"],
    topic: "flutter",
    weight: 1.2,
  },
  // Firebase
  {
    keywords: ["firebase", "firestore", "cloud functions", "fcm", "realtime database", "authentication"],
    synonyms: ["google cloud", "serverless", "baas"],
    reply: "🔥 Firebase is a core part of his stack:\n\n• **Firestore** — Real-time NoSQL database\n• **Firebase Auth** — Email, Google, phone auth\n• **Cloud Functions** — Serverless backend logic\n• **FCM** — Push notifications\n• **Storage** — File uploads & media\n\nHe pairs Firebase backends with React admin panels for full-stack control.",
    chips: ["Admin panel details?", "Flutter + Firebase?"],
    topic: "firebase",
  },
  // Admin Panels
  {
    keywords: ["admin", "panel", "dashboard", "backoffice", "cms", "management"],
    synonyms: ["control panel", "backend ui"],
    reply: "📊 He builds custom **React admin panels** with:\n\n• **TailwindCSS** for beautiful responsive UI\n• **Firebase integration** for real-time data sync\n• **Role-based access control** (RBAC)\n• **Analytics dashboards** with charts & KPIs\n• **User management** systems\n\nThese panels give clients full control over their data without touching code.",
    chips: ["What's his full tech stack?", "Hire for a project?"],
    topic: "admin",
  },
  // Tech Stack
  {
    keywords: ["skill", "stack", "tech", "technology", "tools", "framework", "language", "what can you do", "capabilities"],
    synonyms: ["expertise", "proficiency", "know"],
    reply: "⚡ Full tech stack:\n\n**Frontend:** React, TailwindCSS, Framer Motion\n**Mobile:** Flutter, Dart\n**Backend:** Laravel, Node.js, Firebase\n**CMS:** WordPress, WooCommerce\n**Database:** MySQL, Firestore\n**AI:** ChatGPT API, Claude API, AI Agents\n**DevOps:** Git, Netlify, Vercel\n**Design:** Figma\n\nHe uses AI-powered development (Copilot, Claude) to ship 3-5x faster than traditional methods.",
    chips: ["Tell me about AI agents", "Show projects", "How to hire?"],
    topic: "skills",
  },
  // Projects
  {
    keywords: ["project", "portfolio", "website", "built", "created", "made", "showcase", "examples"],
    synonyms: ["work samples", "case study"],
    reply: ({ history }) => {
      const names = projects.map((p) => `• **${p.title}** — ${p.desc}`).join("\n");
      return `🖥️ Here are his public projects:\n\n${names}\n\nScroll up to the **Selected Projects** section to see live previews! Note: His company/client work is under NDA and not shown here.`;
    },
    chips: ["What's his tech stack?", "How to contact?"],
    topic: "projects",
  },
  // Contact
  {
    keywords: ["contact", "email", "linkedin", "whatsapp", "phone", "number", "call", "github", "reach", "connect"],
    synonyms: ["get in touch", "message", "dm"],
    reply: "📬 Here's how to reach Bhushan:\n\n• **Phone:** +91 9158856817\n• **Email:** bhushantunlait111@gmail.com\n• **LinkedIn:** linkedin.com/in/bhushan-tunlait-250105173\n• **WhatsApp:** wa.me/9158856817\n• **GitHub:** github.com/BhushanTunlait\n\nOr use the **contact form** below — it goes straight to his inbox!",
    chips: ["Is he available for hire?", "Download resume"],
    topic: "contact",
  },
  // Resume
  {
    keywords: ["resume", "cv", "download", "pdf"],
    synonyms: ["curriculum", "qualifications doc"],
    reply: "📄 You can download his resume by clicking the **Download Resume** button in the Contact section below. It has the full breakdown of skills, experience, and education.",
    chips: ["What's his experience?", "Tech stack?"],
    topic: "resume",
  },
  // Hiring / Collaboration
  {
    keywords: ["hire", "rate", "collaborate", "freelance", "available", "cost", "price", "budget", "engagement", "contract"],
    synonyms: ["work together", "partner", "outsource", "consultant"],
    reply: "✅ Yes! Bhushan is **available for new projects** and collaborations. Whether it's a web app, Flutter mobile app, AI agent, or admin panel — he's ready to discuss.\n\n**Best way to start:** Send a quick message via WhatsApp (+91 9158856817) or email (bhushantunlait111@gmail.com) with your project idea. He typically responds within a few hours!",
    chips: ["Contact details", "What's his stack?", "Show projects"],
    topic: "hiring",
    weight: 1.3,
  },
  // WordPress / Laravel
  {
    keywords: ["wordpress", "woocommerce", "laravel", "php", "theme", "plugin"],
    synonyms: ["wp", "ecommerce"],
    reply: "🌐 Bhushan has deep experience with:\n\n• **WordPress** — Custom themes, plugins, WooCommerce stores, performance optimization, and SEO\n• **Laravel** — REST APIs, admin dashboards, complex business logic, database architecture, and secure authentication\n\nThese remain core strengths alongside his newer Flutter & AI work.",
    chips: ["What about Flutter?", "AI capabilities?"],
    topic: "web",
  },
  // React
  {
    keywords: ["react", "javascript", "typescript", "frontend", "ui", "tailwind", "next"],
    synonyms: ["jsx", "tsx", "component"],
    reply: "⚛️ React is his go-to for interactive UIs:\n\n• **React + TypeScript** for type-safe components\n• **TailwindCSS** for rapid styling\n• **Framer Motion** for animations\n• **Firebase & REST API** integration\n• **Admin panels** with real-time data\n\nThis very portfolio you're looking at is built with React! 😉",
    chips: ["Admin panel details?", "Full tech stack?"],
    topic: "react",
  },
  // Thanks / Bye
  {
    keywords: ["thank", "thanks", "bye", "goodbye", "see you", "take care", "appreciate", "helpful"],
    synonyms: ["cheers", "ta", "cya"],
    reply: ({ hour }) => {
      const closing = hour < 17 ? "Have a great day" : "Have a great evening";
      return `You're welcome! 😊 ${closing}! If you need anything else, I'm always here. Don't forget to check out the **Contact section** below if you'd like to work with Bhushan. 🚀`;
    },
    chips: ["Contact details", "Download resume"],
    topic: "farewell",
    weight: 0.5,
  },
  // How are you / Fun
  {
    keywords: ["how are you", "how r u", "what's good", "having fun", "are you real"],
    reply: "I'm just code, but I'm running at peak performance today! 😄 I'm here to help you learn about Bhushan — ask me anything about his work, skills, or how to collaborate with him.",
    chips: ["Who is Bhushan?", "What can he do?"],
    topic: "fun",
    weight: 0.3,
  },
];

/** Score-based intent matcher with fuzzy matching */
function matchIntent(input: string, history: string[]): ChatReply {
  const q = input.toLowerCase().replace(/[^\w\s]/g, "").trim();
  const words = q.split(/\s+/);
  const hour = new Date().getHours();

  // Handle very short / empty input
  if (words.length === 0 || q.length < 2) {
    return {
      text: "I didn't quite catch that. Try asking about Bhushan's **skills**, **projects**, **experience**, or **contact** info!",
      chips: ["What are his skills?", "Show projects", "Contact details"],
      topic: "fallback",
    };
  }

  // Handle follow-ups: "tell me more", "more details", "elaborate"
  if (/^(tell me more|more|elaborate|details|explain|go on|continue)/.test(q) && history.length > 0) {
    const lastTopic = history[history.length - 1];
    const entry = KNOWLEDGE_BASE.find((e) => e.topic === lastTopic);
    if (entry) {
      const text = typeof entry.reply === "function"
        ? entry.reply({ hour, history })
        : entry.reply;
      return {
        text: `Here's more detail on that:\n\n${text}`,
        chips: entry.chips,
        topic: entry.topic,
      };
    }
  }

  // Score each knowledge entry
  let bestScore = 0;
  let bestEntry = KNOWLEDGE_BASE[KNOWLEDGE_BASE.length - 1]; // default to fun/fallback

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    const allKeywords = [...entry.keywords, ...(entry.synonyms || [])];

    for (const kw of allKeywords) {
      // Exact substring match
      if (q.includes(kw)) {
        score += kw.split(/\s+/).length * 2; // multi-word matches score higher
      }
      // Individual word match
      for (const word of words) {
        if (kw.includes(word) && word.length >= 3) score += 0.8;
        // Fuzzy: first 4 chars match (handles typos like "fluter" -> "flutter")
        if (word.length >= 4 && kw.length >= 4 && kw.startsWith(word.slice(0, 4))) score += 0.6;
      }
    }

    score *= entry.weight ?? 1;

    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  // If score is too low, return smart fallback
  if (bestScore < 1) {
    return {
      text: `Hmm, I'm not sure about that one! I'm best at answering questions about Bhushan's **skills**, **projects**, **experience**, **education**, **contact info**, or **availability**.\n\nTry one of the suggestions below 👇`,
      chips: ["Who is Bhushan?", "What's his tech stack?", "How to hire him?", "Contact details"],
      topic: "fallback",
    };
  }

  const text = typeof bestEntry.reply === "function"
    ? bestEntry.reply({ hour, history })
    : bestEntry.reply;

  return {
    text,
    chips: bestEntry.chips,
    topic: bestEntry.topic,
  };
}

/* ═══════════════════════════════════════════════
   CHAT MESSAGE TYPES
   ═══════════════════════════════════════════════ */

type ChatMessage = {
  from: "bot" | "user";
  text: string;
  chips?: string[];
  typing?: boolean; // true while typewriter is in progress
};

/** Typewriter component — reveals text character by character */
function TypewriterText({
  text,
  speed = 12,
  onDone,
}: {
  text: string;
  speed?: number;
  onDone?: () => void;
}) {
  const [displayedChars, setDisplayedChars] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    setDisplayedChars(0);
    doneRef.current = false;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedChars(i);
      if (i >= text.length) {
        clearInterval(interval);
        if (!doneRef.current) {
          doneRef.current = true;
          onDone?.();
        }
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onDone]);

  const shown = text.slice(0, displayedChars);

  // Simple markdown-like rendering: **bold** and \n for line breaks, • for bullets
  const parts = shown.split("\n").map((line, li) => (
    <span key={li}>
      {li > 0 && <br />}
      {line.split(/(\*\*[^*]+\*\*)/).map((seg, si) =>
        seg.startsWith("**") && seg.endsWith("**") ? (
          <strong key={si} className="text-white font-semibold">
            {seg.slice(2, -2)}
          </strong>
        ) : (
          <span key={si}>{seg}</span>
        )
      )}
    </span>
  ));

  return <>{parts}{displayedChars < text.length && <span className="inline-block w-0.5 h-4 bg-purple-400 ml-0.5 animate-pulse align-middle" />}</>;
}

/** Render a completed (non-typing) bot message with markdown */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, li) => (
        <span key={li}>
          {li > 0 && <br />}
          {line.split(/(\*\*[^*]+\*\*)/).map((seg, si) =>
            seg.startsWith("**") && seg.endsWith("**") ? (
              <strong key={si} className="text-white font-semibold">
                {seg.slice(2, -2)}
              </strong>
            ) : (
              <span key={si}>{seg}</span>
            )
          )}
        </span>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════
   CHAT SECTION COMPONENT
   ═══════════════════════════════════════════════ */

function ChatSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      from: "bot",
      text: `${new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening"}! 👋 I'm Bhushan's AI assistant. I can tell you about his **skills**, **projects**, **experience**, or help you **get in touch**. What would you like to know?`,
      chips: ["Who is Bhushan?", "Tech stack", "Show projects", "Contact details"],
    },
  ]);
  const topicHistory = useRef<string[]>([]);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [messageCount, setMessageCount] = useState(0);

  // Auto-scroll on new messages and during typing
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [chatMessages, messageCount]);

  const processMessage = useCallback(
    (text: string) => {
      if (!text.trim() || chatLoading) return;

      // Add user message
      setChatMessages((prev) => [...prev, { from: "user", text: text.trim() }]);
      setChatInput("");
      setChatLoading(true);

      // Simulate "thinking" delay (300-800ms based on input length)
      const thinkTime = Math.min(300 + text.length * 15, 800);

      setTimeout(() => {
        const reply = matchIntent(text, topicHistory.current);
        if (reply.topic) topicHistory.current.push(reply.topic);

        // Add bot message with typing flag
        setChatMessages((prev) => [
          ...prev,
          { from: "bot", text: reply.text, chips: reply.chips, typing: true },
        ]);
        setChatLoading(false);
      }, thinkTime);
    },
    [chatLoading],
  );

  const handleTypingDone = useCallback((msgIndex: number) => {
    setChatMessages((prev) =>
      prev.map((m, i) => (i === msgIndex ? { ...m, typing: false } : m)),
    );
    setMessageCount((c) => c + 1);
  }, []);

  const handleChipClick = useCallback(
    (chip: string) => {
      processMessage(chip);
    },
    [processMessage],
  );

  // Focus input after bot finishes typing (skip on mount — focusing here
  // makes the browser scroll the whole page down to the chat on load)
  useEffect(() => {
    if (!chatLoading && messageCount > 0)
      inputRef.current?.focus({ preventScroll: true });
  }, [chatLoading, messageCount]);

  return (
    <section id="assistant" ref={ref} className="py-16 md:py-28 section-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-600/3 via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={stagger}
        className="mx-auto max-w-[1200px] px-5 sm:px-6 relative z-10"
      >
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-8 md:gap-12 items-center">
          <div className="space-y-6">
            <SectionLabel>AI Assistant</SectionLabel>
            <SectionTitle>
              Ask My <span className="gradient-text">Digital Twin.</span>
            </SectionTitle>
            <motion.p variants={fadeUp} className="text-slate-400 text-[15px] leading-relaxed">
              Powered by a smart NLP engine trained on Bhushan's complete
              profile. Ask naturally — it understands context, handles
              follow-ups, and even corrects typos.
            </motion.p>
            <motion.div variants={fadeUp} className="hidden lg:flex flex-wrap gap-2">
              {["Skills", "Projects", "Experience", "Contact", "Flutter", "AI Agents"].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 text-xs font-medium rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-300/70"
                >
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            variants={scaleIn}
            className="glass-strong rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
          >
            {/* Chat Header */}
            <div className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4 border-b border-white/5 bg-white/[0.02]">
              <div className="relative">
                <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 grid place-items-center text-white shadow-lg">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-[#0d0d1a]" />
              </div>
              <div className="flex-1">
                <h4 className="font-display font-bold text-white text-sm sm:text-[15px]">
                  Bhushan's AI Agent
                </h4>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
                  </span>
                  Always online
                </p>
              </div>
              <div className="text-xs text-slate-600 font-mono hidden sm:block">
                NLP v2.0
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-4 sm:p-5 flex flex-col h-[420px] sm:h-[440px]">
              <div
                ref={chatBoxRef}
                className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
              >
                {chatMessages.map((m, i) => (
                  <div key={i}>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={
                        m.from === "bot"
                          ? "flex items-start gap-2.5"
                          : "flex items-start gap-2.5 justify-end"
                      }
                    >
                      {m.from === "bot" && (
                        <div className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 rounded-lg bg-purple-600/20 text-purple-300 grid place-items-center mt-0.5">
                          <BotMessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "text-[13px] sm:text-sm leading-relaxed p-3 sm:p-3.5 rounded-xl max-w-[88%]",
                          m.from === "bot"
                            ? "bg-white/5 text-slate-300 rounded-tl-sm border border-white/5"
                            : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-sm",
                        )}
                      >
                        {m.from === "bot" && m.typing ? (
                          <TypewriterText
                            text={m.text}
                            speed={10}
                            onDone={() => handleTypingDone(i)}
                          />
                        ) : m.from === "bot" ? (
                          <RichText text={m.text} />
                        ) : (
                          m.text
                        )}
                      </div>
                    </motion.div>

                    {/* Quick Reply Chips — show after bot finishes typing */}
                    {m.from === "bot" &&
                      !m.typing &&
                      m.chips &&
                      i === chatMessages.length - 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                          className="flex flex-wrap gap-1.5 mt-2.5 ml-9 sm:ml-10"
                        >
                          {m.chips.map((chip) => (
                            <button
                              key={chip}
                              onClick={() => handleChipClick(chip)}
                              disabled={chatLoading}
                              className="px-3 py-1.5 text-[11px] sm:text-xs font-medium rounded-full border border-purple-500/25 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/40 hover:text-purple-200 transition-all duration-200 disabled:opacity-40"
                            >
                              {chip}
                            </button>
                          ))}
                        </motion.div>
                      )}
                  </div>
                ))}

                {/* Thinking indicator */}
                {chatLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2.5"
                  >
                    <div className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 rounded-lg bg-purple-600/20 text-purple-300 grid place-items-center">
                      <BotMessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <div className="bg-white/5 px-4 py-3 rounded-xl rounded-tl-sm border border-white/5 flex gap-1 items-center">
                      <span className="text-xs text-slate-500 mr-2">Thinking</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60 animate-bounce" style={{ animationDelay: "0.15s" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60 animate-bounce" style={{ animationDelay: "0.3s" }} />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <form
                className="mt-3 sm:mt-4 relative"
                onSubmit={(e) => {
                  e.preventDefault();
                  processMessage(chatInput);
                }}
              >
                <input
                  ref={inputRef}
                  aria-label="Message"
                  placeholder="Ask anything about Bhushan..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={chatLoading}
                  className="w-full h-11 sm:h-12 rounded-xl border border-white/10 bg-white/[0.03] px-4 pr-14 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                />
                <Button
                  size="sm"
                  className="absolute right-1.5 top-1.5 bottom-1.5 h-auto w-10 sm:w-auto sm:px-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-medium grid place-items-center"
                  disabled={chatLoading || !chatInput.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   CONTACT SECTION
   ═══════════════════════════════════════════════ */

function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const WEB3FORMS_KEY = "61d6ca3d-bc23-4662-8a82-ee5419439a88";

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formLoading) return;
    const name = formName.trim();
    const email = formEmail.trim();
    const message = formMessage.trim();
    if (!name || !email || !message) {
      toast({ title: "Please fill all fields." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Please enter a valid email." });
      return;
    }

    setFormLoading(true);
    try {
      const formData = new FormData();
      formData.append("access_key", WEB3FORMS_KEY);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("message", message);
      formData.append("subject", `Portfolio Contact from ${name}`);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: "Message sent!", description: "Thanks, I'll get back to you soon." });
        setFormName("");
        setFormEmail("");
        setFormMessage("");
      } else {
        throw new Error("Submission failed");
      }
    } catch {
      toast({ title: "Couldn't send message", description: "Please try email or WhatsApp instead." });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDownloadResume = async () => {
    const resumePath = import.meta.env.PROD
      ? typeof window !== "undefined" && window.location?.origin
        ? `${window.location.origin}/Bhushan_157317526.pdf`
        : "https://bhushantunlait.netlify.app/Bhushan_157317526.pdf"
      : "/Bhushan_157317526.pdf";

    try {
      const res = await fetch(resumePath, { method: "HEAD" });
      if (res.ok) {
        const a = document.createElement("a");
        a.href = resumePath;
        a.download = "Bhushan-Tunlait-Resume.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        toast({ title: "Resume not found", description: "Please try again later." });
      }
    } catch {
      toast({ title: "Resume not available", description: "Please try again later." });
    }
  };

  return (
    <section id="contact" ref={ref} className="py-16 md:py-28 section-darker relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[200px] md:w-[800px] md:h-[400px] bg-gradient-to-b from-purple-600/10 to-transparent rounded-full blur-[48px] md:blur-[64px] pointer-events-none" />

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={stagger}
        className="mx-auto max-w-[1200px] px-6 relative z-10"
      >
        <div className="text-center mb-16">
          <SectionLabel>Get in Touch</SectionLabel>
          <SectionTitle>
            Let's Build Something <br />
            <span className="gradient-text">Extraordinary.</span>
          </SectionTitle>
          <motion.p variants={fadeUp} className="mt-6 text-lg text-slate-400 max-w-xl mx-auto">
            Have a project in mind? Let's talk about how I can help bring your
            vision to life.
          </motion.p>
        </div>

        {/* Contact Links */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          <a
            href="mailto:bhushantunlait111@gmail.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl glass border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:border-purple-500/30 transition-all duration-300 group"
          >
            <Mail className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
            Email
          </a>
          <a
            href="https://www.linkedin.com/in/bhushan-tunlait-250105173/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl glass border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:border-purple-500/30 transition-all duration-300 group"
          >
            <Linkedin className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
            LinkedIn
          </a>
          <a
            href="https://wa.me/9158856817"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl glass border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:border-purple-500/30 transition-all duration-300 group"
          >
            <MessageCircle className="h-4 w-4 text-green-400 group-hover:scale-110 transition-transform" />
            WhatsApp
          </a>
          <a
            href="https://github.com/BhushanTunlait"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl glass border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:border-purple-500/30 transition-all duration-300 group"
          >
            <Github className="h-4 w-4 text-slate-400 group-hover:scale-110 transition-transform" />
            GitHub
          </a>
          <button
            onClick={handleDownloadResume}
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/20 text-sm font-medium text-purple-300 hover:text-white hover:border-purple-500/40 transition-all duration-300 group"
          >
            <Download className="h-4 w-4 group-hover:scale-110 transition-transform" />
            Resume
          </button>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          variants={scaleIn}
          className="mx-auto max-w-2xl"
        >
          <div className="glass-strong rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            {/* Form Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 grid place-items-center">
                  <Terminal className="h-4 w-4 text-white" />
                </div>
                <span className="font-mono text-sm text-purple-300 font-medium">
                  send_message.sh
                </span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleContactSubmit} className="p-6 md:p-8 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    name="name"
                    placeholder="Your name"
                    aria-label="Your name"
                    autoComplete="name"
                    className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-white text-base md:text-sm placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-label="Your email"
                    className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-white text-base md:text-sm placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Tell me about your project..."
                  aria-label="Your message"
                  rows={5}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white text-base md:text-sm placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-0 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all text-sm tracking-wide"
                disabled={formLoading}
              >
                {formLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send Message <Send className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════ */

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#020010]">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <a
              href="#hero"
              className="font-display font-bold text-lg text-white tracking-tight"
            >
              Bhushan<span className="text-purple-400">.</span>
            </a>
            <p className="text-sm text-slate-500">
              Building the web, one pixel at a time.
            </p>
          </div>

          <div className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-slate-500 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/BhushanTunlait"
              target="_blank"
              rel="noreferrer"
              className="h-10 w-10 md:h-9 md:w-9 rounded-lg glass border border-white/5 grid place-items-center text-slate-500 hover:text-white hover:border-purple-500/30 transition-all"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/bhushan-tunlait-250105173/"
              target="_blank"
              rel="noreferrer"
              className="h-10 w-10 md:h-9 md:w-9 rounded-lg glass border border-white/5 grid place-items-center text-slate-500 hover:text-white hover:border-purple-500/30 transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="mailto:bhushantunlait111@gmail.com"
              className="h-10 w-10 md:h-9 md:w-9 rounded-lg glass border border-white/5 grid place-items-center text-slate-500 hover:text-white hover:border-purple-500/30 transition-all"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Bhushan Tunlait. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Designed & Developed with passion.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   FLOATING BUTTONS
   ═══════════════════════════════════════════════ */

function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* WhatsApp */}
      <a
        href="https://wa.me/9158856817"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 left-6 z-50 h-12 w-12 rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] grid place-items-center hover:scale-110 transition-transform"
      >
        <MessageCircle className="h-5 w-5" />
      </a>

      {/* Phone */}
      <a
        href="tel:+919158856817"
        aria-label="Call Bhushan"
        className="fixed bottom-20 left-6 z-50 h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-[0_4px_20px_rgba(139,92,246,0.4)] grid place-items-center hover:scale-110 transition-transform"
      >
        <Phone className="h-5 w-5" />
      </a>

      {/* Scroll to Top */}
      <button
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full glass border border-white/10 text-white shadow-lg grid place-items-center hover:border-purple-500/30 transition-all duration-300",
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </>
  );
}

/* ═══════════════════════════════════════════════
   CUSTOM CURSOR
   ═══════════════════════════════════════════════ */

function CustomCursor() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    const el = ref.current;
    if (!el) return;

    let mouseX = -9999, mouseY = -9999;
    let curX = -9999, curY = -9999;
    const ease = 0.18;
    let raf = 0;

    // The cursor element is `display: none` unless the body carries
    // .project-cursor-active (i.e. the pointer is over a project card), but the
    // easing loop used to run for the entire session regardless — writing a
    // transform to a hidden node 60 times a second. It now runs only while the
    // cursor is actually visible, and halts as soon as it catches up.
    let active = false;

    const animate = () => {
      raf = 0;
      const dx = mouseX - curX;
      const dy = mouseY - curY;
      curX += dx * ease;
      curY += dy * ease;
      el.style.transform = `translate3d(${curX - 28}px,${curY - 28}px,0)`;
      if (active && !document.hidden && (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5)) {
        raf = requestAnimationFrame(animate);
      }
    };

    const kick = () => {
      if (active && !raf && !document.hidden) raf = requestAnimationFrame(animate);
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (curX === -9999) { curX = mouseX; curY = mouseY; }
      kick();
    };
    const onDown = () => el.classList.add("clicking");
    const onUp = () => el.classList.remove("clicking");

    const onLeaveWindow = (e: MouseEvent) => {
      if (!(e as any).relatedTarget && !(e as any).toElement) el.style.opacity = "0";
    };
    const onEnterWindow = () => { el.style.opacity = "1"; };

    window.addEventListener("mousemove", onMove, { passive: true } as any);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseout", onLeaveWindow as any);
    window.addEventListener("mouseover", onEnterWindow);

    const activate = () => {
      active = true;
      document.body.classList.add("project-cursor-active");
      // Jump straight to the pointer so it doesn't slide in from its last spot.
      curX = mouseX;
      curY = mouseY;
      kick();
    };
    const deactivate = () => {
      active = false;
      document.body.classList.remove("project-cursor-active");
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    };
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".project-card"));
    cards.forEach((c) => {
      c.addEventListener("mouseenter", activate);
      c.addEventListener("mouseleave", deactivate);
    });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove as any);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseout", onLeaveWindow as any);
      window.removeEventListener("mouseover", onEnterWindow);
      cards.forEach((c) => {
        c.removeEventListener("mouseenter", activate);
        c.removeEventListener("mouseleave", deactivate);
      });
      document.body.classList.remove("project-cursor-active");
    };
  }, []);

  return (
    <div id="custom-cursor" ref={ref} aria-hidden="true">
      <div className="ring">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <polygon className="arrow-shape" points="6,4 16,12 6,20 8.5,12" />
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════ */

export default function Index() {
  return (
    <main className="min-h-screen flex flex-col bg-[#030014] relative">
      <MouseSpotlight />
      <Navbar />
      <HeroSection />
      <StatsBar />
      <ServicesSection />
      <ProjectsSection />
      <TechStackSection />
      <AboutSection />
      <ChatSection />
      <ContactSection />
      <Footer />
      <FloatingButtons />
      <CustomCursor />
    </main>
  );
}
