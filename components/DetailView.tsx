import { MediaImage } from "@/components/MediaImage";
import type { CollectionItem, ItemDetail } from "@/lib/types";

function renderValue(value: string | string[]) {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return value;
}

export function DetailView({
  item,
  comment,
  actions
}: {
  item: ItemDetail;
  comment?: CollectionItem["comment"];
  actions?: React.ReactNode;
}) {
  const metadata = Object.entries(item.metadata || {}).filter(([, value]) => renderValue(value));

  return (
    <section className="detail-panel">
      <MediaImage item={item} className="detail-image" />
      <div>
        <span className="badge">{item.type}</span>
        <h1>{item.title}</h1>
        <p className="subtitle">{[item.subtitle, item.year].filter(Boolean).join(" - ")}</p>
        <dl className="metadata">
          {metadata.map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{renderValue(value)}</dd>
            </div>
          ))}
        </dl>
        {comment ? (
          <div className="card" style={{ marginBottom: 16 }}>
            <p className="eyebrow">{comment.prompt}</p>
            <p>{comment.answer}</p>
          </div>
        ) : null}
        {actions ? <div className="actions">{actions}</div> : null}
      </div>
    </section>
  );
}
