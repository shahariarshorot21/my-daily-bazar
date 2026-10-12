export const instant = false;

import baseUrl from "@/services/baseUrl";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const getCategoryData = async (categorySlug) => {
  try {
    const categoryUrl = `${baseUrl}/bazardor/categories/${encodeURIComponent(categorySlug)}`;
    const productsUrl = `${baseUrl}/bazardor/products`;

    const [catRes, prodRes] = await Promise.all([
      fetch(categoryUrl, { cache: "no-store" }),
      fetch(productsUrl, { cache: "no-store" }),
    ]);

    const currentCategory = catRes.ok ? await catRes.json() : null;
    const allProducts = prodRes.ok ? await prodRes.json() : [];

    const productList = Array.isArray(allProducts) ? allProducts : [];

    const filteredProducts = productList.filter((prod) => {
      return (
        String(prod.categorySlug || "").toLowerCase() ===
          categorySlug.toLowerCase() ||
        String(prod.category || "").toLowerCase() ===
          categorySlug.toLowerCase() ||
        String(prod.categoryId || "") ===
          String(currentCategory?.id || currentCategory?._id || "")
      );
    });

    return {
      category: currentCategory,
      products: filteredProducts,
    };
  } catch (error) {
    console.error("Category data fetch failed:", error);

    return {
      category: null,
      products: [],
    };
  }
};

const renderChange = (change) => {
  if (!change) {
    return <span className="text-gray-400 font-medium">— 0.0%</span>;
  }

  if (typeof change === "object") {
    const isUp = change.dir === "up" || change.dir === "▲";

    return (
      <span
        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
          isUp ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
        }`}
      >
        {isUp ? "▲" : "▼"} {change.pct || "0"}%
      </span>
    );
  }

  const isUp = String(change).includes("▲");

  return (
    <span
      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
        isUp ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
      }`}
    >
      {change}
    </span>
  );
};

export default async function CategoryProducts({ params }) {
  const { slug } = await params;

  const { category: currentCategory, products } = await getCategoryData(slug);

  return (
    <main className="min-h-screen bg-[#f4f6f3] pb-16">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Category Header */}
        <section className="mb-6 flex items-center gap-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 text-3xl shadow-inner">
            {currentCategory?.icon || "🛒"}
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {currentCategory?.nameBn || currentCategory?.name || slug}
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              {products.length} টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </section>

        {/* Sorting Bar */}
        <section className="mb-4 flex items-center justify-end rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-500">সাজান</span>

            <select
              aria-label="পণ্য সাজান"
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700"
              defaultValue="default"
            >
              <option value="default">ডিফল্ট ▼</option>
              <option value="low">দাম: কম থেকে বেশি</option>
              <option value="high">দাম: বেশি থেকে কম</option>
            </select>
          </div>
        </section>

        <p className="mb-4 text-xs font-medium text-gray-500">
          মোট {products.length} টি পণ্য দেখানো হচ্ছে
        </p>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center font-medium text-gray-500 shadow-sm">
            এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((prod) => {
              const imageSrc =
                typeof prod.image === "string" &&
                (prod.image.startsWith("/") ||
                  /^https?:\/\/\S+$/i.test(prod.image))
                  ? prod.image
                  : null;

              return (
                <Link
                  key={prod.id || prod._id}
                  href={`/product/${prod.id || prod._id}`}
                  className="flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 text-2xl">
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={prod.nameBn || prod.name || "পণ্য"}
                          width={32}
                          height={32}
                          className="h-8 w-8 object-contain"
                          unoptimized
                        />
                      ) : (
                        <p>{currentCategory?.icon}</p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        {prod.nameBn || prod.name || "নাম নেই"}
                      </h3>

                      <p className="mt-0.5 text-[11px] text-gray-400">
                        {prod.unit || "প্রতি কেজি"}
                      </p>

                      <p className="mt-1 text-[11px] text-gray-500">
                        আজকের দাম
                      </p>

                      <p className="mt-0.5 text-base font-extrabold text-gray-900">
                        {prod.today ?? prod.price ?? "—"}{" "}
                        <span className="text-xs font-normal text-gray-600">
                          টাকা
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="self-end pb-1">
                    {renderChange(prod.change)}
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
