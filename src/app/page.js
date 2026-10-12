"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import baseUrl from "@/services/baseUrl";
import Image from "next/image";

const toBanglaDigit = (num) => {
  if (num === null || num === undefined || num === "") return "";
  const banglaDigits = {
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
  };

  return String(num).replace(/[0-9]/g, (digit) => banglaDigits[digit]);
};


const ProductSection = ({ title, icon, items, handleProtectedClick }) => (
  <section className="mb-8">
    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
      <span>{icon}</span>
      {title}
    </h2>

    {items.length === 0 ? (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-500">
        এই মুহূর্তে কোনো পণ্য নেই।
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((prod) => (
          <div
            key={prod.id || prod._id}
            onClick={(e) =>
              handleProtectedClick(e, `/product/${prod.id || prod._id}`)
            }
            className="flex cursor-pointer items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50/50 text-2xl">
                {prod.icon || prod.image || "🥔"}
              </div>

              <div>
                <h3 className="text-sm font-bold leading-tight text-gray-800">
                  {prod.nameBn || prod.name || "নাম নেই"}
                </h3>

                <span className="mt-0.5 block text-[11px] text-gray-400">
                  {prod.unit || "প্রতি কেজি"}
                </span>

                <p className="mt-1 text-[11px] text-gray-400">আজকের দাম</p>

                <p className="mt-0.5 text-base font-extrabold text-gray-900">
                  {toBanglaDigit(prod.today ?? prod.price ?? "—")}{" "}
                  <span className="text-xs font-semibold text-gray-600">
                    টাকা
                  </span>
                </p>
              </div>
            </div>

            <div className="self-end pb-1">{renderChange(prod.change)}</div>
          </div>
        ))}
      </div>
    )}
  </section>
);

const renderChange = (change) => {
  if (!change) return null;

  let isUp = false;
  let isDown = false;
  let value = "";

  if (typeof change === "string" || typeof change === "number") {
    const strVal = String(change);

    isUp = strVal.includes("▲");
    isDown = strVal.includes("▼") || strVal.includes("-");

    value = toBanglaDigit(
      Math.abs(Number(strVal.replace(/[^0-9.-]/g, "")) || 0),
    );
  } else if (typeof change === "object") {
    isUp = change.dir === "up" || change.dir === "▲";
    isDown = change.dir === "down" || change.dir === "▼";

    value = toBanglaDigit(Math.abs(change.pct || 0));
  }

  if (change.dir === "flat" || (!isUp && !isDown && Number(value) === 0)) {
    return (
      <div className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-500">
        — 0%
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ${
        isUp ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
      }`}
    >
      <span>{isUp ? "▲" : "▼"}</span>
      <span>{value}%</span>
    </div>
  );
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${baseUrl}/bazardor/products`),
          fetch(`${baseUrl}/bazardor/categories`),
        ]);

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (Array.isArray(prodData)) setProducts(prodData);
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          if (Array.isArray(catData)) setCategories(catData);
        }
      } catch (error) {
        console.error("Data fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProtectedClick = (e, path) => {
    if (!isPending && !session?.user) {
      e.preventDefault();
      router.push("/sign-in");
    } else {
      router.push(path);
    }
  };

  const categoryNamesText =
    categories.length > 0
      ? categories.map((cat) => cat.nameBn || cat.name).join(", ")
      : "চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলা";

  const increasedProducts = products.filter(
    (prod) => prod.change?.dir === "up" || prod.change?.dir === "▲",
  );

  const decreasedProducts = products.filter(
    (prod) => prod.change?.dir === "down" || prod.change?.dir === "▼",
  );

  return (
    <main className="min-h-screen bg-[#f3f5f1] pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        {/* Banner Section */}
        <div className="relative mb-8 flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10 md:flex-row">
          <div className="max-w-xl">
            <span className="mb-3 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {new Date().toLocaleDateString("bn-BD", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>

            <h1 className="mb-3 text-3xl font-bold leading-tight text-gray-900">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="mb-6 text-sm leading-relaxed text-gray-600">
              {categoryNamesText} এর দাম — বাজারভিত্তিক বিস্তারিত, গড়,
              সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            <button className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-800">
              সব পণ্য দেখুন
            </button>
          </div>

          <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-emerald-50 text-6xl shadow-inner sm:h-52 sm:w-52">
            <Image
              src="/image/bazar-hero.png"
              alt="Product Image"
              width={200}
              height={200}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center font-medium text-gray-500">
            লোড হচ্ছে...
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center font-medium text-gray-500">
            কোনো পণ্য পাওয়া যায়নি।
          </div>
        ) : (
          <>
            {/* Price Increased */}
            <ProductSection
              title="আজ দাম বেড়েছে"
              icon="🔺"
              items={increasedProducts}
              handleProtectedClick={handleProtectedClick}
            />

            {/* Price Decreased */}
            <ProductSection
              title="আজ দাম কমেছে"
              icon="🔻"
              items={decreasedProducts}
              handleProtectedClick={handleProtectedClick}
            />

            {/* All Products */}
            <ProductSection
              title="সব পণ্য"
              icon="🛒"
              items={products}
              handleProtectedClick={handleProtectedClick}
            />
          </>
        )}
      </div>
    </main>
  );
}
