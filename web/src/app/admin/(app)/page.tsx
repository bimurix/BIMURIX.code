import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminContent, getStats, listRequests, PAGE_SIZE, parseFilters } from "@/lib/admin/data";
import { formatDate, STATUSES, statusLabel } from "@/lib/admin/labels";
import { NetworkSwatch } from "@/ui/components/NetworkSwatch";
import { StatusBadge } from "@/ui/admin/StatusBadge";

// Session admin lue à chaque requête : rendu bloquant assumé (Cache Components).
export const instant = false;

/** Boîte de réception : indicateurs, filtres, liste paginée des demandes. */
export default async function InboxPage({ searchParams }: PageProps<"/admin">) {
  const ctx = await requireAdmin();
  const filters = parseFilters(await searchParams);
  const [{ rows, total }, stats, content] = await Promise.all([listRequests(ctx, filters), getStats(ctx), getAdminContent()]);
  const serviceInfo = new Map(content.services.map((s) => [s.value, s]));
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageHref = (page: number) => {
    const p = new URLSearchParams();
    if (filters.status) p.set("statut", filters.status);
    if (filters.service) p.set("service", filters.service);
    if (filters.days) p.set("jours", String(filters.days));
    if (filters.q) p.set("q", filters.q);
    if (page > 1) p.set("page", String(page));
    return `/admin${p.size ? `?${p}` : ""}`;
  };

  const kpis = [
    ["Nouvelles (7 jours)", stats.new_7d],
    ["Nouvelles (30 jours)", stats.new_30d],
    ["En attente de réponse", stats.awaiting],
    ["Délai moyen de 1re réponse", stats.avg_first_reply_hours === null ? "—" : `${stats.avg_first_reply_hours} h`],
  ] as const;

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold text-ink">Demandes de soumission</h1>

      <dl className="grid grid-cols-2 border-[1.5px] border-ink bg-paper lg:grid-cols-4">
        {kpis.map(([label, value], i) => (
          <div key={label} className={`p-4 ${i % 2 ? "" : "border-e border-rule"} ${i < 2 ? "border-b border-rule lg:border-b-0" : ""} lg:border-e lg:last:border-e-0`}>
            <dt className="text-[13px] text-ink-2">{label}</dt>
            <dd className="mt-1 font-mono text-2xl text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <form method="get" className="grid gap-3 bg-paper p-4 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] sm:items-end" role="search">
        <label className="text-[13px] text-ink-2">Recherche
          <input name="q" defaultValue={filters.q} placeholder="Nom, entreprise, courriel, référence" className="mt-1 block min-h-11 w-full border border-ink px-3 text-[15px] text-ink" />
        </label>
        <label className="text-[13px] text-ink-2">Statut
          <select name="statut" defaultValue={filters.status ?? ""} className="mt-1 block min-h-11 w-full border border-ink bg-paper px-2 text-[15px] text-ink">
            <option value="">Tous (sauf indésirables)</option>
            {STATUSES.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
          </select>
        </label>
        <label className="text-[13px] text-ink-2">Service
          <select name="service" defaultValue={filters.service ?? ""} className="mt-1 block min-h-11 w-full border border-ink bg-paper px-2 text-[15px] text-ink">
            <option value="">Tous</option>
            {content.services.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <label className="text-[13px] text-ink-2">Période
          <select name="jours" defaultValue={filters.days ?? ""} className="mt-1 block min-h-11 w-full border border-ink bg-paper px-2 text-[15px] text-ink">
            <option value="">Toutes</option>
            {[7, 30, 90, 365].map((d) => <option key={d} value={d}>{d} derniers jours</option>)}
          </select>
        </label>
        <button type="submit" className="min-h-11 bg-ink px-5 text-[15px] font-semibold text-paper">Filtrer</button>
      </form>

      <div className="overflow-x-auto border-[1.5px] border-ink bg-paper">
        <table className="w-full min-w-[760px] text-[14px]">
          <caption className="sr-only">Demandes de soumission, les plus récentes d&apos;abord</caption>
          <thead className="border-b border-ink text-start text-[12px] text-ink-2">
            <tr>
              {["Date", "Référence", "Client", "Service", "Région", "Statut", "Dernière réponse"].map((h) => (
                <th key={h} scope="col" className="px-3 py-2 text-start font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={7} className="px-3 py-10 text-center text-ink-2">Aucune demande pour ces filtres.</td></tr>
            )}
            {rows.map((r) => {
              const svc = serviceInfo.get(r.service);
              return (
                <tr key={r.id} className={`border-b border-rule hover:bg-paper-2 ${r.status === "new" ? "font-semibold" : ""}`}>
                  <td className="px-3 py-2.5 whitespace-nowrap text-ink-2">{formatDate(r.created_at)}</td>
                  <td className="px-3 py-2.5 font-mono"><Link href={`/admin/demandes/${r.id}`} className="text-blue underline-offset-4 hover:underline">{r.reference}</Link></td>
                  <td className="px-3 py-2.5 text-ink">{r.full_name}<span className="block text-[13px] font-normal text-ink-2">{r.company}</span></td>
                  <td className="px-3 py-2.5"><span className="flex items-center gap-2">{svc?.network && <NetworkSwatch network={svc.network} />}{svc?.label ?? r.service}</span></td>
                  <td className="px-3 py-2.5 text-ink-2">{r.region ? content.labelFor("regions", r.region) : "—"}</td>
                  <td className="px-3 py-2.5"><StatusBadge status={r.status} /></td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-ink-2">{formatDate(r.last_reply_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-3 text-[14px]">
          {filters.page > 1 && <Link href={pageHref(filters.page - 1)} className="font-semibold text-blue">Précédente</Link>}
          <span className="font-mono text-ink-2">{filters.page} / {pages}</span>
          {filters.page < pages && <Link href={pageHref(filters.page + 1)} className="font-semibold text-blue">Suivante</Link>}
        </nav>
      )}
    </div>
  );
}
