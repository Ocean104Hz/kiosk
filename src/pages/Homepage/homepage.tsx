import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleLanguageSelect = (lang: string) => {
    localStorage.setItem("language", lang);
    if (lang === "th") {
      navigate("/homepageTH?lang=th");
    } else if (lang === "en") {
      navigate("/homepageEN?lang=en");
    } else {
      navigate("/homepageZh?lang=zh");
    }
  };

  type ButtonItem = {
    id: number;
    label: string;
    color?: string;
    play: string;
    national: string;
  };

  const data: ButtonItem[] = [
    {
      id: 1,
      label: "ภาษาไทย",
      color: "bg-amber-500",
      play: "th",
      national: "/img/thai.png",
    },
    {
      id: 2,
      label: "English",
      color: "bg-amber-500",
      play: "en",
      national: "/img/kingdom.png",
    },
    {
      id: 3,
      label: "中文",
      color: "bg-amber-500",
      play: "zh",
      national: "/img/china.png",
    },
  ];

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
            src="/img/hi.png"
            alt="hi"
            className="mx-auto w-80 h-auto mb-5"
          />
        </div>
        <h1 className="text-2xl font-semibold text-white">
          เลือกภาษา | Choose language | 中文
        </h1>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mx-auto p-4">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => handleLanguageSelect(item.play)}
            className={`cursor-pointer flex items-center justify-between bg-amber-500 text-red-950 text-lg font-semibold p-4 rounded-xl shadow-lg ring-1 ring-amber-600 hover:scale-105 hover:shadow-xl transition-transform duration-300 ease-in-out ${item.color}`}
          >
            <div className="flex flex-col space-y-2">
              <span className="text-left text-red-800 hover:text-red-600 transition-colors duration-200">
                {item.label}
              </span>
            </div>
            <img
              src={item.national}
              alt={item.label}
              className="w-16 h-16 object-cover rounded-full border-2 border-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
