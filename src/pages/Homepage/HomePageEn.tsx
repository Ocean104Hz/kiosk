import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function HomePageEn() {
  const navigate = useNavigate();
  const [idNumber, setIdNumber] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString("en-US", {
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

    updateTime(); // initial run
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleConfirm = () => {
    const id = idNumber.trim();
    const isValid = /^[A-Za-z]{2}[0-9]{7}$/.test(id);

    if (id === "") {
      alert("Please enter your ID number.");
      return;
    }

    if (!isValid) {
      alert(
        "Invalid ID format.\nThe first 2 characters must be letters (A-Z), followed by 7 digits. (Total: 9 characters)"
      );
      return;
    }

    navigate("/selectTransaction?lang=en");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center font-sans">
      {/* Header */}
      <header className="w-full bg-red-800 py-4 px-6 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-4">
          <img src="/img/Logo.png" alt="Logo" className="w-16 h-16" />
          <div>
            <h1 className="text-2xl font-bold">Visit Reservation System</h1>
            <p className="text-sm">Central Klongprem Prison</p>
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
          Please enter your ID number
        </p>

        <input
          type="text"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          placeholder="Enter ID Passport"
          className="w-full p-3 border border-red-300 bg-red-100 rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-red-400 mb-6"
        />

        {/* Buttons */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <button
            onClick={handleConfirm}
            className="bg-amber-500 hover:bg-amber-600 px-8 py-3 rounded-md font-bold shadow"
          >
            Confirm
          </button>
          <button
            onClick={() => setIdNumber("")}
            className="bg-gray-300 hover:bg-gray-400 px-8 py-3 rounded-md font-bold shadow"
          >
            Cancel
          </button>
        </div>
      </main>
    </div>
  );
}
