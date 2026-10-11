"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Profile() {
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const { error } = await authClient.updateUser({
        name: name,
      });

      if (error) {
        setErrorMessage(error.message || "প্রোফাইল আপডেট ব্যর্থ হয়েছে!");
      } else {
        setSuccessMessage("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
        router.refresh();
      }
    } catch (err) {
      setErrorMessage("কিছু একটা সমস্যা হয়েছে!");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.replace("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center text-gray-500 font-medium">
        লোড হচ্ছে...
      </div>
    );
  }

  if (!session?.user) {
    router.push("/sign-in");
    return null;
  }

  return (
    <main className="min-h-[85vh] bg-[#f5f7f4] py-10 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">
            আমার প্রোফাইল
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন ও পরিবর্তন করুন।
          </p>
        </div>

        {/* User Card */}
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-gray-900">
              {session.user.name}
            </h2>
            <p className="text-xs text-gray-500">{session.user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
          >
            ← সাইন আউট
          </button>
        </div>

        {/* Update Form Section */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
            তথ্য আপডেট করুন
          </h3>

          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">নাম</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {successMessage && (
              <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 font-medium">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-medium">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
            >
              {loading ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </div>

        {/* Home Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-gray-700 transition"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}
