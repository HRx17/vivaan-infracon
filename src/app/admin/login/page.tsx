import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <main id="main" className="flex min-h-[100svh] items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <span className="rule-accent mb-6" aria-hidden />
        <h1 className="text-3xl font-extrabold">Vivaan Infracon</h1>
        <p className="mt-2 text-muted">Sign in to manage your portfolio.</p>
        <LoginForm next={next} />
      </div>
    </main>
  );
}
