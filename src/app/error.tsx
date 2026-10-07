"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="container page">
      <h1>Content is temporarily unavailable</h1>
      <p>Please try again.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
