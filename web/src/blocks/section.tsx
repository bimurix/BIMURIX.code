// Gabarit commun des sections : largeur, marges et titre de section (h2).
export function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`mx-auto max-w-7xl scroll-mt-(--bx-header-h) px-4 py-14 sm:px-6 lg:py-20 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeading({ children, intro }: { children: React.ReactNode; intro?: string }) {
  if (!children) return null;
  return (
    <div className="mb-10 max-w-3xl">
      <h2 className="font-display text-3xl leading-tight font-bold tracking-[-0.015em] text-balance sm:text-4xl">{children}</h2>
      {intro && <p className="mt-4 text-[17px] leading-relaxed text-ink-2">{intro}</p>}
    </div>
  );
}
