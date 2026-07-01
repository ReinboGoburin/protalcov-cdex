import type { SearchResult } from "@/lib/types";

export function MediaImage({ item, className }: { item: SearchResult; className: string }) {
  return (
    <div className={className}>
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.imageUrl} alt="" />
      ) : (
        <span>{item.title}</span>
      )}
    </div>
  );
}
