const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-4 mt-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-gray-600">
        <div>
          <span className="font-bold text-gray-800">
            বাজার দর
          </span>{" "}
          — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </div>

        <div>
          সকল দাম সম্ভাব্য; বাজার-অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </div>
      </div>
    </footer>
  );
};

export default Footer;