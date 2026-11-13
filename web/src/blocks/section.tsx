// Gabarit commun des sections : largeur, rythme vertical (tokens --bx-space-*) et titre de section (h2).
type SectionProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  /** Bande teintée pleine largeur : sépare la section de ses voisines sans carte (plan v5 § 8 n° 3). */
  band?: boolean;
};

export function Section({ id, children, className = "", band = false }: SectionProps) {
  return (
    <section id={id} className={`mx-auto max-w-7xl scroll-mt-(--bx-header-h) px-4 py-(--bx-space-section) sm:px-6 lg:py-(--bx-space-section-lg) ${band ? "bx-band" : ""} ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeading({ children, intro }: { children: React.ReactNode; intro?: string }) {
  if (!children) return null;
  return (
    <div className="mb-(--bx-space-head) max-w-3xl">
      <h2 className="font-display text-[1.7rem] leading-tight font-bold tracking-[-0.015em] text-balance sm:text-4xl">{children}</h2>
      {intro && <p className="mt-4 max-w-[68ch] text-[17px] leading-relaxed text-ink-2">{intro}</p>}
    </div>
  );
}
