import type { NetworkColor } from "@/sanity/types-content";

export const networkVar: Record<NetworkColor, string> = {
  plumb: "var(--bx-net-plumb)",
  heat: "var(--bx-net-heat)",
  data: "var(--bx-net-data)",
  tqc: "var(--bx-net-tqc)",
};

// Petit tronçon de tuyau dans la couleur du réseau : repère d'un service partout sur le site.
export function NetworkSwatch({ network, className = "" }: { network: NetworkColor; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 28 8" width="28" height="8" className={`shrink-0 ${className}`}>
      <line x1="2" y1="4" x2="22" y2="4" stroke={networkVar[network]} strokeWidth="4" strokeLinecap="round" />
      <circle cx="24" cy="4" r="3" fill="var(--bx-paper)" stroke={networkVar[network]} strokeWidth="1.5" />
    </svg>
  );
}
