export function Timeline({
  items
}: {
  items: Array<{
    title: string;
    detail: string;
    date: string;
    active?: boolean;
  }>;
}) {
  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`} className="relative flex gap-4">
          <div className="relative flex flex-col items-center">
            <div
              className={`h-4 w-4 rounded-full border-4 ${
                item.active ? "border-brand bg-brand-soft" : "border-muted bg-background"
              }`}
            />
            {index < items.length - 1 ? <div className="mt-2 h-full w-px bg-border" /> : null}
          </div>
          <div className="pb-6">
            <p className="font-medium">{item.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-brand">{item.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
