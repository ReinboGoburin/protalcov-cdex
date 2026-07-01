import Link from "next/link";

const blocks = [
  {
    title: "Bloc 2 - Flux d'ajout",
    description: "Recherche cross-media, ajout en collection locale et commentaire guide.",
    status: "Actif",
    href: "/bloc-2"
  }
];

export default function HomePage() {
  return (
    <main className="page">
      <div className="shell">
        <p className="eyebrow">Prototype</p>
        <h1>Alcove - Prototype</h1>
        <p className="subtitle">Blocs fonctionnels en cours de test</p>
        <section className="grid hub-grid">
          {blocks.map((block) => (
            <Link className="card" href={block.href} key={block.href}>
              <h2>{block.title}</h2>
              <p>{block.description}</p>
              <span className="status">{block.status}</span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
