import React from "react";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-7xl mx-auto px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function Section({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`relative py-16 sm:py-24 md:py-28 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
