export const instant = false;

import baseUrl from "@/services/baseUrl";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getProduct(id) {
  try {
    const res = await fetch(
      `${baseUrl}/bazardor/products/${encodeURIComponent(id)}`,
      { cache: "no-store" },
    );

    if (!res.ok) return null;

    const data = await res.json();

    return data?.product || data?.data || data || null;
  } catch (error) {
    console.error("Product fetch failed:", error);
    return null;
  }
}

async function getProducts() {
  try {
    const res = await fetch(`${baseUrl}/bazardor/products`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Products fetch failed:", error);
    return [];
  }
}

const toBanglaDigit = (value) =>
  String(value ?? "—").replace(/[0-9]/g, (digit) => "০১২৩৪৫৬৭৮৯"[digit]);

export default async function ProductDetails({ params }) {
  const { id } = await params;

  const [productData, allProducts] = await Promise.all([
    getProduct(id),
    getProducts(),
  ]);

  const product =
    productData && String(productData.id ?? productData._id) === String(id)
      ? productData
      : allProducts.find((item) => String(item.id ?? item._id) === String(id));

  if (!product) notFound();

  const price = product.today ?? product.price ?? "—";
  const yesterday = product.yesterday;
  const lastWeek = product.lastWeek;
  const lastMonth = product.lastMonth;

  const change = product.change;
  const isUp = change?.dir === "up";
  const isDown = change?.dir === "down";

  const priceStats = [
    {
      label: "গতকালের দাম",
      value: yesterday,
      color: "text-emerald-700",
    },
    {
      label: "গত সপ্তাহের দাম",
      value: lastWeek,
      color: "text-red-600",
    },
    {
      label: "গত মাসের দাম",
      value: lastMonth,
      color: "text-emerald-700",
    },
  ];

  const marketPrices = Array.isArray(product.markets) ? product.markets : [];

  return (
    <main className="min-h-screen bg-[#f3f5f1] pb-16">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 text-xs text-gray-500">
          <Link href="/" className="hover:text-emerald-700">
            হোম
          </Link>
          {"  >  "}
          <Link
            href={`/category/${product.category || "chal"}`}
            className="hover:text-emerald-700"
          >
            {product.categoryNameBn || "ক্যাটাগরি"}
          </Link>
          {"  >  "}
          <span className="text-gray-800">
            {product.nameBn || product.name}
          </span>
        </nav>

        {/* Product Header */}
        <section className="mb-6 flex flex-col justify-between gap-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-4xl">
              {product.image || product.categoryIcon || "🛒"}
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                {product.nameBn || product.name || "পণ্যের বিস্তারিত"}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {product.unit === "kg"
                  ? "প্রতি কেজি"
                  : product.unit || "পণ্যের একক"}
              </p>

              <p className="mt-2 text-xs text-gray-600">
                আজকের তুলনায় আগের বাজারদরের তথ্য
              </p>
            </div>
          </div>

          <div className="min-w-28 rounded-2xl bg-[#f3f7f2] p-4 text-center">
            <p className="text-xs text-gray-500">আজকের দাম</p>
            <p className="mt-1 text-3xl font-extrabold text-gray-900">
              {toBanglaDigit(price)}
            </p>
            <p className="text-xs text-gray-500">
              টাকা / {product.unit || "একক"}
            </p>

            {change && (
              <p
                className={`mt-2 text-xs font-bold ${
                  isUp
                    ? "text-red-600"
                    : isDown
                      ? "text-emerald-600"
                      : "text-gray-500"
                }`}
              >
                {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
                {toBanglaDigit(Math.abs(change.pct ?? 0))}%
              </p>
            )}
          </div>
        </section>

        {/* Price Summary */}
        <section className="mb-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-gray-900">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {priceStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-gray-100 bg-[#fafcf9] p-4"
              >
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className={`mt-2 text-xl font-extrabold ${stat.color}`}>
                  {stat.value == null
                    ? "—"
                    : `${toBanglaDigit(stat.value)} টাকা`}
                </p>
                <p className="mt-1 text-[11px] text-gray-400">
                  {stat.value == null
                    ? "তথ্য পাওয়া যায়নি"
                    : "প্রতি এককের বাজারদর"}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Market Prices */}
        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-gray-900">
            বাজারভিত্তিক আজকের দাম
          </h2>

          {marketPrices.length === 0 ? (
            <p className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
              এই পণ্যের বাজারভিত্তিক বিস্তারিত তথ্য API-তে পাওয়া যায়নি।
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <table className="w-full min-w-[500px] text-left text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500">
                  <tr>
                    <th className="px-4 py-3">বাজার</th>
                    <th className="px-4 py-3">বিভাগ</th>
                    <th className="px-4 py-3">সর্বনিম্ন</th>
                    <th className="px-4 py-3">সর্বোচ্চ</th>
                    <th className="px-4 py-3">গড়</th>
                  </tr>
                </thead>

                <tbody>
                  {marketPrices.map((market, index) => (
                    <tr
                      key={market.id || market.name || index}
                      className="border-t border-gray-100 text-gray-700"
                    >
                      <td className="px-4 py-3 font-medium">
                        {market.name || market.market || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {market.division || market.location || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {market.min == null
                          ? "—"
                          : `${toBanglaDigit(market.min)} টাকা`}
                      </td>
                      <td className="px-4 py-3">
                        {market.max == null
                          ? "—"
                          : `${toBanglaDigit(market.max)} টাকা`}
                      </td>
                      <td className="px-4 py-3">
                        {market.avg == null
                          ? "—"
                          : `${toBanglaDigit(market.avg)} টাকা`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
