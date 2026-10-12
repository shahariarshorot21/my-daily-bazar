"use client";

import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirmPassword")?.toString() || "";

    if (password !== confirmPassword) {
      setErrorMessage("পাসওয়ার্ড দুটি মিলছে না!");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        setErrorMessage(error.message || "সাইন আপ ব্যর্থ হয়েছে!");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setErrorMessage(error.message || "কিছু একটা সমস্যা হয়েছে!");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setErrorMessage("");
    setLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        setErrorMessage(error.message || `${provider} দিয়ে সাইন আপ সফল হয়নি!`);
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage(error.message || "সাময়িক সমস্যা হয়েছে!");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[85vh] items-center justify-center px-4 py-8 bg-[#f5f7f4]">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        {/* Title */}
        <h1 className="mb-1 text-center text-2xl font-extrabold text-gray-900">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="mb-6 text-center text-xs text-gray-500">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>

        {/* Form */}
        <form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
          {/* Name Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">নাম</label>
            <input
              required
              name="name"
              type="text"
              placeholder="যেমন: রহিম উদ্দিন"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">ইমেইল</label>
            <input
              required
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">পাসওয়ার্ড</label>
            <input
              required
              name="password"
              type="password"
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">পাসওয়ার্ড নিশ্চিত করুন</label>
            <input
              required
              name="confirmPassword"
              type="password"
              placeholder="আবার লিখুন"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50 mt-1"
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>

          {/* Divider */}
          <div className="relative my-1 flex items-center justify-center">
            <div className="w-full border-t border-gray-200"></div>
            <span className="absolute bg-white px-3 text-xs text-gray-400 font-medium">
              অথবা
            </span>
          </div>

          {/* Social Buttons */}
          <div>
           <button
            type="button"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google দিয়ে চালিয়ে যান
          </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("github")}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2 px-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub দিয়ে
            </button>
          </div>

          {/* Toggle Sign in */}
          <p className="mt-2 text-center text-xs text-gray-600">
            অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/sign-in"
              className="font-bold text-emerald-600 hover:underline"
            >
              সাইন ইন করুন
            </Link>
          </p>
        </form>

        {/* Back to Home Link */}
        <div className="mt-4 text-center">
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