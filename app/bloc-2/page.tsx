"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DetailView } from "@/components/DetailView";
import { FooterAttribution } from "@/components/FooterAttribution";
import { MediaImage } from "@/components/MediaImage";
import { readCollection, removeItem, restoreItem, savePendingItem } from "@/lib/collection";
import { mediaLabels, type CollectionItem } from "@/lib/types";

export default function BlocTwoPage() {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [selected, setSelected] = useState<CollectionItem | null>(null);
  const [removed, setRemoved] = useState<CollectionItem | null>(null);

  useEffect(() => setItems(readCollection()), []);

  useEffect(() => {
    if (!removed) return;
    const timer = window.setTimeout(() => setRemoved(null), 5000);
    return () => window.clearTimeout(timer);
  }, [removed]);

  function handleRemove(item: CollectionItem) {
    const deleted = removeItem(item.id, item.type);
    setItems(readCollection());
    setSelected(null);
    setRemoved(deleted);
  }

  function undoRemove() {
    if (!removed) return;
    restoreItem(removed);
    setItems(readCollection());
    setRemoved(null);
  }

  return (
    <main className="page">
      <div className="shell">
        <header className="topbar">
          <div>
            <Link className="ghost-button" href="/">Retour hub</Link>
            <h1 style={{ marginTop: 18 }}>Flux d'ajout</h1>
            <p className="subtitle">Ta collection culturelle locale.</p>
          </div>
          <Link className="icon-button" href="/bloc-2/add" aria-label="Ajouter un item">+</Link>
        </header>

        {items.length === 0 ? (
          <section className="empty-state">
            <h2>Commence ta collection</h2>
            <p className="subtitle">Ajoute un film, un livre, un album, un jeu ou un podcast.</p>
            <Link className="icon-button" href="/bloc-2/add" aria-label="Ajouter un item">+</Link>
          </section>
        ) : (
          <section className="grid collection-grid">
            {items.map((item) => (
              <button className="card" key={`${item.type}-${item.id}`} onClick={() => setSelected(item)} type="button">
                <MediaImage item={item} className="poster" />
                <span className="badge">{mediaLabels[item.type]}</span>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </button>
            ))}
          </section>
        )}

        {selected ? (
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal-panel">
              <DetailView
                item={selected}
                comment={selected.comment}
                actions={
                  <>
                    <Link
                      className="button"
                      href={`/bloc-2/add/${selected.type}/${selected.id}/comment?edit=1`}
                      onClick={() => savePendingItem(selected)}
                    >
                      Modifier le commentaire
                    </Link>
                    <button className="danger-button" onClick={() => handleRemove(selected)} type="button">Supprimer</button>
                    <button className="ghost-button" onClick={() => setSelected(null)} type="button">Fermer</button>
                  </>
                }
              />
            </div>
          </div>
        ) : null}

        {removed ? (
          <div className="toast">
            <span>Item supprime</span>
            <button onClick={undoRemove} type="button">Annuler</button>
          </div>
        ) : null}

        <FooterAttribution />
      </div>
    </main>
  );
}
