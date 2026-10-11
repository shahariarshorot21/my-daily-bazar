// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Navbar from "@/components/Navber";
// import baseUrl from "@/services/baseUrl";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Bazar Dor",
//   description: "Latest market prices",
// };

// const getCategories = async () => {
//   try {
//     const res = await fetch(`${baseUrl}/bazardor/categories`, {
//       cache: "force-cache",
//     });

//     if (!res.ok) {
//       console.error("Categories API Error:", res.status);
//       return [];
//     }

//     return await res.json();
//   } catch (error) {
//     console.error("Categories Fetch Error:", error);
//     return [];
//   }
// };

// export default async function RootLayout({ children }) {
//   const categories = await getCategories();

//   return (
//     <html
//       lang="bn"
//       className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
//     >
//       <body suppressHydrationWarning className="min-h-full flex flex-col">
//         {/* <Navbar categories={categories} /> */}
//         <Navbar categories={categories} />
//         {children}
//       </body>
//     </html>
//   );
// }

import Footer from "@/components/Footer";
import "./globals.css";
import Navbar from "@/components/Navber";

export const metadata = {
  title: "বাজার দর",
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body suppressHydrationWarning className="min-h-screen bg-[#f5f7f4] text-gray-900 antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}