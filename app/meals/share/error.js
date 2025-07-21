"use client";

export default function Error({ error }) {
  return (
    <main className="error">
      <h1>An error occured!</h1>
      <p>Failed to create a meal.</p>
      <p>{error.message}</p>
    </main>
  );
}
