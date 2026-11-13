// Préchauffage : en mode dev, chaque route est compilée au premier passage. Sans cela, 6 tests en parallèle
// qui visitent une route froide dépassent leurs délais (N6 : faux échecs du changement de langue et de la connexion admin ; R3 : l'adresse EN de destination du changement de langue y figure aussi).
const routes = ["/", "/en", "/soumission", "/en/quote", "/a-propos", "/services/prefabrication-tuyauterie", "/en/services/piping-prefabrication", "/en/about", "/confidentialite", "/conditions", "/admin/connexion", "/page-inexistante"];

export default async function globalSetup() {
  const base = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3100";
  for (const route of routes) {
    await fetch(`${base}${route}`, { redirect: "manual" }).catch(() => undefined);
  }
}
