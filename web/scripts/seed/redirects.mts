// N4 : l'adresse de l'ancienne offre « Préfabrication MEP » a changé ; l'ancienne adresse renvoie vers la nouvelle (308).
export const redirects = [
  { _id: "redirect-prefab-fr", _type: "redirect", from: "/services/prefabrication-mep", to: "/services/prefabrication-tuyauterie", permanent: true },
  { _id: "redirect-prefab-en", _type: "redirect", from: "/en/services/mep-prefabrication", to: "/en/services/piping-prefabrication", permanent: true },
];
