"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ZodError } from "zod";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorBoundary({ error }: Props) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);

  if (error instanceof ZodError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-red-700">
            Validation error
          </h2>

          <ul className="space-y-2 text-sm text-red-600">
            {error.issues.map((e, i) => (
              <li key={i} className="flex gap-2 rounded-lg bg-white px-3 py-2">
                <span className="font-mono text-red-500">
                  {e.path.join(".") || "root"}
                </span>
                <span>{e.message}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => router.replace("/")}
            className="mt-6 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow">
        <h2 className="mb-2 text-lg font-semibold text-zinc-900">
          Something went wrong
        </h2>

        <p className="text-sm text-zinc-600">{error.message}</p>

        <button
          onClick={() => router.replace("/")}
          className="mt-6 w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
