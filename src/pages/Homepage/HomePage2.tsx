import { useNavigate } from "react-router-dom";

export default function HomePage2() {
  const navigate = useNavigate();

  const handleLanguageSelect = (lang: string) => {
    localStorage.setItem("language", lang);
    navigate("/selectTransaction?lang=" + lang);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-800 px-6 py-12">
      {/* Logo Section */}
      <div className="mb-10 text-center">
        <img
          src="/img/Logo.png"
          alt="Logo"
          className="mx-auto w-48 h-auto mb-10"
        />
        <h1 className="text-2xl font-semibold text-white">ระบบจองเยี่ยมญาติ</h1>
        <h1 className="text-2xl font-semibold text-amber-400 mb-10">
          เรือนจำกลางคลองเปรม
        </h1>
        <div>
          <img
            src="/img/user.png"
            alt="hi"
            className="mx-auto w-60 h-auto mb-5"
          />
        </div>
        <h1 className="text-2xl font-semibold text-white">
          เสียบบัตรประชาชน
        </h1>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-md">
        
          <button
            className="text-red-950 text-lg font-semibold py-3 rounded-lg shadow-md hover:scale-105 transition-transform duration-200 bg-amber-500 col-span-3"
            onClick={() => handleLanguageSelect("th")}
          >
            ทดสอบการเสียบบัตร(ปปช.)
          </button>
      </div>
    </div>
  );
}
