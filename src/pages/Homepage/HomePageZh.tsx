import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function HomePageZh() {
  const navigate = useNavigate();
  const [idNumber, setIdNumber] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString("zh-CN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(formatted);
    };

    updateTime(); // 初始更新时间
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleConfirm = () => {
    const id = idNumber.trim();
    const isValid = /^[A-Za-z]{2}[0-9]{7}$/.test(id);

    if (id === "") {
      alert("请输入您的身份证号码。");
      return;
    }

    if (!isValid) {
      alert(
        "身份证号码格式错误。\n前两个字符必须是英文字母（A-Z），后面跟着7位数字。总共9位字符。"
      );
      return;
    }

    navigate("/selectTransaction?lang=zh");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center font-sans">
      {/* Header */}
      <header className="w-full bg-red-800 py-4 px-6 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-4">
          <img src="/img/Logo.png" alt="Logo" className="w-16 h-16" />
          <div>
            <h1 className="text-2xl font-bold">预约探访系统</h1>
            <p className="text-sm">中央孔乍监狱</p>
          </div>
        </div>
      </header>

      <main className="mt-10 text-center max-w-xl w-full px-6 flex flex-col items-center">
        <div className="bg-amber-500 px-5 py-2 rounded-md font-semibold mb-6 text-sm text-gray-800 shadow-sm">
          {currentTime}
        </div>

        <img
          src="/img/passport.png"
          alt="Passport"
          className="w-[300px] md:w-[400px] h-auto mb-6 shadow-md"
        />

        <p className="text-xl font-medium mb-4 text-gray-700">
          请输入您的身份证号码
        </p>

        <input
          type="text"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          placeholder="请输入身份证号码"
          className="w-full p-3 border border-red-300 bg-red-100 rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-red-400 mb-6"
        />

        {/* Buttons */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <button
            onClick={handleConfirm}
            className="bg-amber-500 hover:bg-amber-600 px-8 py-3 rounded-md font-bold shadow"
          >
            确认
          </button>
          <button
            onClick={() => setIdNumber("")}
            className="bg-gray-300 hover:bg-gray-400 px-8 py-3 rounded-md font-bold shadow"
          >
            取消
          </button>
        </div>
      </main>
    </div>
  );
}
