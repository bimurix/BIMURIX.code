// Racine séparée pour Studio : aucun style ni police du site public n'y est chargé.
export { metadata, viewport } from "next-sanity/studio";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CA">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
