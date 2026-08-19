import { Children, useEffect, useRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const PageTransition = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500", className)}>
    {children}
  </div>
);

export const ScrollReveal = ({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 motion-reduce:transform-none motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const StaggerContainer = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props}>
    {Children.map(children, (child, index) => (
      <div style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}>
        {child}
      </div>
    ))}
  </div>
);

export const StaggerItem = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("h-full motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500", className)} {...props}>
    {children}
  </div>
);

export const AnimatedText = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span className={cn("inline-block motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-700", className)}>
    {children}
  </span>
);

export const TypewriterText = ({ text, className }: { text: string; className?: string }) => {
  const [length, setLength] = useState(0);
  useEffect(() => {
    if (length >= text.length) return;
    const timer = window.setTimeout(() => setLength((value) => value + 1), 45);
    return () => window.clearTimeout(timer);
  }, [length, text.length]);
  return <span className={className}>{text.slice(0, length)}<span aria-hidden="true" className="text-blue-500">|</span></span>;
};

export const FloatingElements = ({ className }: { className?: string }) => (
  <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
    <span className="absolute left-[8%] top-[20%] h-8 w-8 rounded-xl border border-blue-400/30 bg-blue-400/10 motion-safe:animate-[float_5s_ease-in-out_infinite]" />
    <span className="absolute bottom-[18%] right-[12%] h-12 w-12 rounded-full border border-cyan-400/30 bg-cyan-400/10 motion-safe:animate-[float_6s_ease-in-out_infinite_reverse]" />
  </div>
);

export const GradientBlob = ({ className }: { className?: string }) => (
  <div aria-hidden="true" className={cn("pointer-events-none absolute h-64 w-64 rounded-full bg-blue-500/10 blur-3xl", className)} />
);

export const SpotlightCard = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_14px_40px_rgba(37,99,235,0.10)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700", className)}
    {...props}
  >
    {children}
  </div>
);
