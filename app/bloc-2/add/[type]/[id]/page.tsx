"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DetailView } from "@/components/DetailView";
import { FooterAttribution } from "@/components/FooterAttribution";
import { readSelectedItem, savePendingItem } from "@/lib/collection";
import { ensureType } from "@/lib/types";
import { type ItemDetail, typeToDetailRoute } from "@/lib/types";

export default function AddDetailPage() {
  const params = useParams<{ type: string; id: string }>();
  const router = useRouter();
  const type = useMemo(() => ensureType(params.type), [params.type]);
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!type) return;
    const cached = readSelectedItem();
    if (cached && cached.id === params.id && cached.type === type) setItem(cached);
    const route = typeToDetailRoute[type];
    if (!route) {
      setLoading(false);
      return;
    }

    fetch(`/api/detail/${route}/${params.id}`)
      .then(async (res) => {
        const data = (await res.json()) as ItemDetail & { error?: string };
        if (!res.ok) throw new Error(data.error || "Service temporairement indisponible, reessayez dans quelques instants");
        setItem(data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Service temporairement indisponible, reessayez dans quelques instants"))
      .finally(() => setLoading(false));
  }, [params.id, type]);

  function addItem() {
    if (!item || !type) return;
    savePendingItem(item);
    router.push(`/bloc-2/add/${type}/${item.id}/comment`);
  }

  return (
    <main className="page">
      <div className="shell">
        <header className="topbar">
          <Link className="ghost-button" href={type ? `/bloc-2/add/${type}` : "/bloc-2/add"}>Retour aux resultats</Link>
        </header>
        {loading && !item ? <p className="subtitle">Chargement du detail...</p> : null}
        {error && !item ? <p className="subtitle">{error}</p> : null}
        {item ? (
          <DetailView
            item={item}
            actions={
              <>
                <button className="button" onClick={addItem} type="button">Ajouter a ma collection</button>
                <Link className="ghost-button" href={type ? `/bloc-2/add/${type}` : "/bloc-2/add"}>Retour aux resultats</Link>
              </>
            }
          />
        ) : null}
        <FooterAttribution />
      </div>
    </main>
  );
}

