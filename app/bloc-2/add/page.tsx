import Link from "next/link";
import { FooterAttribution } from "@/components/FooterAttribution";
import { mediaLabels, type MediaType } from "@/lib/types";

const options: Array<{ type: MediaType; icon: string }> = [
  { type: "movie", icon: "Film" },
  { type: "tv", icon: "TV" },
  { type: "book", icon: "Livre" },
  { type: "album", icon: "Album" },
  { type: "videogame", icon: "Jeu" },
  { type: "boardgame", icon: "JdS" },
  { type: "podcast", icon: "Audio" }
];

export default function ChooseTypePage() {
  return (
    <main className="page">
      <div className="shell">
        <header className="topbar">
          <div>
            <Link className="ghost-button" href="/bloc-2">Retour</Link>
            <h1 style={{ marginTop: 18 }}>Ajouter</h1>
            <p className="subtitle">Choisis un type de media.</p>
          </div>
        </header>
        <section className="grid type-grid">
          {options.map((option) => (
            <Link className="card" href={`/bloc-2/add/${option.type}`} key={option.type}>
              <p className="eyebrow">{option.icon}</p>
              <h2>{mediaLabels[option.type]}</h2>
            </Link>
          ))}
        </section>
        <FooterAttribution />
      </div>
    </main>
  );
}
