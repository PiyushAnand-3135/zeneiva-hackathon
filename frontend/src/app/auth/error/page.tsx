"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const ErrorMessage = () => {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error") || "An unknown error occurred.";

  return <p className="text-red-400">{error}</p>;
};

export default function AuthError() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-semibold mb-4">Authentication Error ❌</h2>
        <Suspense fallback={<p className="text-red-400">Loading error message...</p>}>
          <ErrorMessage />
        </Suspense>
        <a
          href="/login"
          className="mt-4 inline-block bg-indigo-600 px-4 py-2 rounded-md text-white hover:bg-indigo-700 transition"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}
