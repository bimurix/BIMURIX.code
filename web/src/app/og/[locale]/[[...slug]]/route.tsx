import { ImageResponse } from "next/og";
import { hasLocale } from "@/lib/i18n/locales";
import { pick } from "@/lib/i18n/pick";
import { siteUrl } from "@/lib/seo";
import { getDocumentBySlug, getHome } from "@/sanity/content";
import { fetchPublished } from "@/sanity/fetch";
import { SHELL_QUERY } from "@/sanity/queries";
import type { Shell } from "@/sanity/types-content";

// Image de partage 1200 × 630 (R-12), style « feuille de plan » : cadre, titre, cartouche. Générée ici, sans dépendance.
// Les couleurs reprennent web/src/styles/tokens.css (--bx-ink, --bx-blue, --bx-paper…) : l'outil d'image ne lit pas le CSS. decision: T6-B
const C = { paper: "#ffffff", paper2: "#f4f7fb", ink: "#0f172a", ink2: "#475569", blue: "#0f52ba", rule: "#cbd5e1" };

export async function GET(_request: Request, { params }: RouteContext<"/og/[locale]/[[...slug]]">) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return new Response(null, { status: 404 });
  const path = (slug ?? []).map(decodeURIComponent).join("/");
  const shell = await fetchPublished<Shell>({ query: SHELL_QUERY });
  const doc = path ? await getDocumentBySlug(locale, path) : await getHome();
  if (!doc) return new Response(null, { status: 404 });

  const isService = doc._type === "service";
  const title = pick(doc.title, locale, shell?.settings?.siteName ?? "Bimurix");
  const code = isService ? (doc as { code?: string }).code : undefined;
  const sheet = (doc as { titleBlock?: { sheet?: string } }).titleBlock?.sheet;
  const sheetLabel = pick(shell?.ui?.sheet, locale, "");
  const descriptor = pick(shell?.settings?.descriptor, locale, "");
  const wordmark = (shell?.settings?.wordmark ?? shell?.settings?.siteName ?? "Bimurix").toUpperCase();

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: C.paper, padding: 36 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", border: `4px solid ${C.ink}`, background: C.paper2, position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "28px 44px", borderBottom: `2px solid ${C.ink}`, background: C.paper }}>
            <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: 6, color: C.ink }}>{wordmark}</div>
            {code ? <div style={{ display: "flex", fontSize: 32, color: C.blue, fontWeight: 700 }}>{code}</div> : null}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 44px" }}>
            <div style={{ display: "flex", fontSize: title.length > 48 ? 62 : 76, fontWeight: 800, lineHeight: 1.08, color: C.ink, maxWidth: 1000 }}>{title}</div>
            {descriptor ? <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: C.ink2, maxWidth: 940 }}>{descriptor}</div> : null}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ display: "flex", borderTop: `2px solid ${C.ink}`, borderLeft: `2px solid ${C.ink}`, background: C.paper }}>
              <div style={{ display: "flex", flexDirection: "column", padding: "14px 28px", borderRight: `1px solid ${C.rule}`, fontSize: 22, color: C.ink2 }}>
                <div style={{ display: "flex" }}>{sheetLabel}</div>
                <div style={{ display: "flex", color: C.ink, fontWeight: 700 }}>{sheet ?? ""}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", padding: "14px 28px", fontSize: 24, color: C.blue, fontWeight: 700 }}>{new URL(siteUrl).host}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" } },
  );
}
