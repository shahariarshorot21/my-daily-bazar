"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import baseUrl from "@/services/baseUrl";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [date, setDate] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    const today = new Date();
    setDate(
      today.toLocaleDateString("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    );
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${baseUrl}/bazardor/categories`);
        if (!res.ok) throw new Error("Categories fetch failed");
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
      } catch (error) {
        console.error("Categories fetch failed:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${baseUrl}/bazardor/products`);
        if (!res.ok) throw new Error("Products fetch failed");
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      } catch (error) {
        console.error("Products fetch failed:", error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  const handleSignOut = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await authClient.signOut();
      setIsMenuOpen(false);
      setIsProfileDropdownOpen(false);
      router.replace("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderChange = (change) => {
    if (!change) return null;
    if (typeof change === "string" || typeof change === "number") {
      const isUp = String(change).includes("▲");
      return (
        <span
          className={
            isUp
              ? "text-red-500 font-bold ml-1"
              : "text-green-500 font-bold ml-1"
          }
        >
          {change}
        </span>
      );
    }
    if (typeof change === "object") {
      const isUp = change.dir === "up" || change.dir === "▲";
      return (
        <span
          className={
            isUp
              ? "text-red-500 font-bold ml-1"
              : "text-green-500 font-bold ml-1"
          }
        >
          {isUp ? "▲" : "▼"} {change.pct || ""}%
        </span>
      );
    }
    return null;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-xl text-white shadow-md">
              <Image
                src="/image/logo-icon.png"
                alt="Bazar Dor Logo"
                width={40}
                height={40}
              />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-emerald-800 leading-none">
                বাজার দর
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">{date}</p>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!isPending &&
            (session?.user ? (
              <div className="relative">
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 hover:bg-gray-100 transition"
                >
                  <span className="text-sm font-semibold text-gray-700">
                    {session.user.name || "User"}
                  </span>
                  <span className="text-xs text-gray-500">▼</span>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white p-3 shadow-xl border border-gray-100 z-50">
                    <div className="pb-2 border-b border-gray-100 mb-2">
                      <p className="text-sm font-bold text-gray-800">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 font-medium transition"
                    >
                      👤 আমার প্রোফাইল
                    </Link>
                    <button
                      onClick={handleSignOut}
                      disabled={isLoggingOut}
                      className="w-full text-left flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition mt-1"
                    >
                      🚪 সাইন আউট
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/sign-in"
                  className="text-sm font-semibold text-gray-700 hover:text-emerald-600 px-3 py-1.5"
                >
                  সাইন ইন
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition"
                >
                  সাইন আপ
                </Link>
              </div>
            ))}
        </div>
      </header>

      <div className="border-t border-gray-100 bg-emerald-50/40">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6">
          <ul className="flex items-center justify-start md:justify-center gap-6 whitespace-nowrap py-2 text-sm font-medium">
            {categories.map((cat) => (
              <li key={cat.id || cat.slug}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-1.5 text-gray-700 hover:text-emerald-600 transition"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.nameBn || cat.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {products.length > 0 && (
        <div className="border-t border-b border-gray-100 bg-gray-50 text-xs py-1.5 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 overflow-hidden">
            <marquee
              behavior="scroll"
              direction="left"
              scrollamount="4"
              className="flex items-center"
            >
              {products.map((prod) => (
                <span
                  key={prod.id}
                  className="inline-flex items-center gap-1.5 text-gray-600 mx-6"
                >
                  <span>{prod.nameBn || prod.name}</span>
                  <span className="font-bold text-gray-900">
                    {prod.price} টাকা/{prod.unit || "কেজি"}
                  </span>
                  {renderChange(prod.change)}
                </span>
              ))}
            </marquee>
          </div>
        </div>
      )}

      {isMenuOpen && (
        <div className="border-t border-gray-200 bg-white p-4 md:hidden">
          <ul className="flex flex-col gap-2">
            {!isPending &&
              (session?.user ? (
                <>
                  <li className="p-2 font-bold text-gray-800 border-b">
                    {session.user.name}
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 text-gray-700"
                    >
                      👤 আমার প্রোফাইল
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left py-2 text-red-600 font-semibold"
                    >
                      🚪 সাইন আউট
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/sign-in"
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 text-gray-700"
                    >
                      সাইন ইন
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sign-up"
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 text-emerald-600 font-semibold"
                    >
                      সাইন আপ
                    </Link>
                  </li>
                </>
              ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
