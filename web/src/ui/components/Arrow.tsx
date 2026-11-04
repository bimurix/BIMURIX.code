// Flèche de direction (inversée en RTL), dessinée au même trait que les tuyaux.
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 10" width="16" height="10" className={`shrink-0 rtl:-scale-x-100 ${className}`}>
      <path d="M0 5h14M10 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
