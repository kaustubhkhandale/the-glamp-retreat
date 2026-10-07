export function RouteShell({
  title,
  intro,
  hasContent = false,
  children,
}: {
  title: string;
  intro?: string | null;
  hasContent?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className="container page">
      <p className="eyebrow">The Glamp Retreat</p>
      <h1>{title}</h1>
      {intro && <p className="prose">{intro}</p>}
      {children}
      {!hasContent && (
        <p className="empty muted">
          {process.env.NODE_ENV === "development"
            ? "Development: no approved published content is available for this module."
            : "Details will be available soon."}
        </p>
      )}
    </section>
  );
}
