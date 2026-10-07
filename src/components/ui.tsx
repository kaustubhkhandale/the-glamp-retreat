import Link from "next/link";
export function ButtonLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="button">
      {children}
    </Link>
  );
}
export function Container({ children }: { children: React.ReactNode }) {
  return <div className="container">{children}</div>;
}
