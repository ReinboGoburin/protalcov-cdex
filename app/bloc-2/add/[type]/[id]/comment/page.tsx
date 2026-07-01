"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FooterAttribution } from "@/components/FooterAttribution";
import { readCollection, readPendingItem, updateComment, upsertItem } from "@/lib/collection";
import { ensureType, mediaLabels, type CollectionItem, type ItemDetail, type MediaType } from "@/lib/types";

const universalPrompts = [
  "En un mot : ___",
  "Je l'ai decouvert grace a ___",
  "Ca m'a marque parce que ___",
  "Ca me rappelle ___",
  "Je le recommanderais a quelqu'un qui ___"
];

const specificPrompts: Record<MediaType, string> = {
  movie: "La scene qui reste : ___",
  tv: "La scene qui reste : ___",
  book: "La phrase que j'ai soulignee : ___",
  album: "Le morceau qui tue : ___",
  videogame: "Mon souvenir le plus fort : ___",
  boardgame: "Mon souvenir le plus fort : ___",
  podcast: "L'episode qui m'a accroche : ___"
};

export default function CommentPage() {
  const params = useParams<{ type: string; id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = useMemo(() => ensureType(params.type), [params.type]);
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const editing = searchParams.get("edit") === "1";

  const prompts = useMemo(() => {
    if (!type) return [];
    return shuffle([...universalPrompts, specificPrompts[type]]);
  }, [type]);

  useEffect(() => {
    const pending = readPendingItem();
    if (pending && pending.id === params.id) {
      setItem(pending);
      return;
    }
    const found = readCollection().find((entry) => entry.id === params.id && entry.type === type);
    if (found) setItem(found);
  }, [params.id, type]);

  function setLimitedAnswer(value: string) {
    const words = value.trim().split(/\s+/).filter(Boolean);
    if (words.length <= 10) {
      setAnswer(value);
      return;
    }
    setAnswer(words.slice(0, 10).join(" "));
  }

  function save(withComment: boolean) {
    if (!item || !type) return;
    const comment: CollectionItem["comment"] = withComment && selectedPrompt && answer.trim()
      ? { prompt: selectedPrompt, answer: answer.trim() }
      : null;

    if (editing) {
      updateComment(item.id, item.type, comment);
      router.push("/bloc-2");
      return;
    }

    const result = upsertItem(item, comment);
    if (!result.ok) {
      setMessage("Cet item est deja dans ta collection");
      return;
    }
    router.push("/bloc-2");
  }

  if (!type) return <main className="page"><div className="shell"><h1>Type inconnu</h1></div></main>;

  return (
    <main className="page">
      <div className="shell">
        <header className="topbar">
          <Link className="ghost-button" href={`/bloc-2/add/${type}/${params.id}`}>Retour</Link>
        </header>
        <p className="eyebrow">{mediaLabels[type]}</p>
        <h1>Un mot sur {item?.title || "cet item"} ?</h1>
        <p className="subtitle">Optionnel, leger, dix mots maximum.</p>

        <section className="prompt-grid">
          {prompts.map((prompt) => (
            <button
              className={`prompt-card${selectedPrompt === prompt ? " selected" : ""}`}
              key={prompt}
              onClick={() => setSelectedPrompt(prompt)}
              type="button"
            >
              {prompt}
            </button>
          ))}
        </section>

        {selectedPrompt ? (
          <div className="card" style={{ marginBottom: 18 }}>
            <p className="eyebrow">{selectedPrompt}</p>
            <textarea onChange={(event) => setLimitedAnswer(event.target.value)} value={answer} />
            <p className="eyebrow" style={{ marginTop: 8 }}>{wordCount(answer)}/10 mots</p>
          </div>
        ) : null}

        {message ? <p className="subtitle">{message}</p> : null}

        <div className="actions">
          <button className="button" disabled={!item} onClick={() => save(true)} type="button">Ajouter</button>
          <button className="ghost-button" disabled={!item} onClick={() => save(false)} type="button">Passer</button>
        </div>
        <FooterAttribution />
      </div>
    </main>
  );
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}
