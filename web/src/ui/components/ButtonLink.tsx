import Link from "next/link";
import { isExternalHref } from "@/lib/links";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "inverse";
  className?: string;
};

const variants = {
  primary: "bg-blue text-paper hover:bg-blue-deep",
  secondary: "text-ink shadow-[inset_0_0_0_1.5px_var(--bx-ink)] hover:bg-paper-2",
  inverse: "bg-paper text-ink hover:bg-paper-2",
};

// Bouton d'action : pleine largeur sur mobile, cible tactile ≥ 44 px (CLAUDE.md §5).
export function ButtonLink({ href, children, variant = "primary", className = "" }: Props) {
  const classes = `inline-flex min-h-(--bx-tap-min) w-full items-center justify-center px-5 text-[15px] font-semibold transition-colors sm:w-auto ${variants[variant]} ${className}`;
  if (isExternalHref(href)) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
