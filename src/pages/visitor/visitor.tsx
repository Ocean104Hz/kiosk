import { useState } from "react";

const mockPrisoners = ["นาย A", "นาย B", "นางสาว C"];

const availableDates = [
  { day: "พ", date: 6 },
  { day: "พฤ", date: 7 },
  { day: "ศ", date: 8 },
  { day: "ส", date: 9 },
  { day: "อา", date: 10 },
  { day: "จ", date: 11 },
  { day: "อ", date: 12 },
];

const times = ["09:00 น.", "10:00 น.", "11:00 น.", "13:00 น.", "14:00 น.", "15:00 น."];

export default function BookingPage() {
  const [selectedPrisoner, setSelectedPrisoner] = useState("");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = () => {
    if (!selectedPrisoner || !selectedDate || !selectedTime) {
      alert("กรุณาเลือกข้อมูลให้ครบถ้วน");
      return;
    }
    setShowModal(true); // แสดงป๊อปอัปเงื่อนไขหลังจอง
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-6">📅 จองคิวเยี่ยมญาติ</h1>

      {/* เลือกผู้ต้องขัง */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">เลือกผู้ต้องขัง</label>
        <select
          value={selectedPrisoner}
          onChange={(e) => setSelectedPrisoner(e.target.value)}
          className="w-full border border-blue-500 rounded-md px-4 py-2"
        >
          <option value="">-- เลือกผู้ต้องขัง --</option>
          {mockPrisoners.map((p, idx) => (
            <option key={idx} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* เลือกวันที่ */}
      <div className="mb-6">
        <label className="block mb-3 font-medium">เลือกวันที่</label>
        <div className="grid grid-cols-3 gap-4">
          {availableDates.map((d) => (
            <button
              key={d.date}
              className={`p-4 rounded border text-center ${
                selectedDate === d.date
                  ? "bg-blue-100 border-blue-500"
                  : "bg-white border-gray-300"
              }`}
              onClick={() => setSelectedDate(d.date)}
            >
              <div className="font-bold">{d.day}</div>
              <div className="text-lg">{d.date}</div>
              <div className="text-sm text-gray-500">สิงหาคม</div>
            </button>
          ))}
        </div>
      </div>

      {/* เลือกเวลา */}
      <div className="mb-6">
        <label className="block mb-3 font-medium">เลือกเวลา</label>
        <div className="grid grid-cols-3 gap-4">
          {times.map((t) => (
            <button
              key={t}
              className={`py-2 rounded border ${
                selectedTime === t ? "bg-green-100 border-green-500" : "bg-white border-gray-300"
              }`}
              onClick={() => setSelectedTime(t)}
            >
              <div className="text-center font-medium">{t}</div>
              <div className="text-xs text-green-600">ว่าง</div>
            </button>
          ))}
        </div>
      </div>

      {/* ปุ่มจอง */}
      <div className="text-center mt-8">
        <button
          onClick={handleConfirm}
          className="bg-green-600 text-white px-6 py-3 rounded font-semibold hover:bg-green-700"
        >
          ✅ ยืนยันการจอง
        </button>
      </div>

      {/* ป๊อปอัปเงื่อนไข */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white max-w-xl w-full rounded-lg p-6 overflow-y-auto max-h-[80vh] shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-red-700 text-center">
              ข้อกำหนดสำหรับผู้เยี่ยมญาติ
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-800 mb-6">
              <li>เยี่ยมได้เฉพาะ จันทร์–ศุกร์ (09:00–15:00), เสาร์ชาย / อาทิตย์หญิง (09:00–12:00)</li>
              <li>แสดงบัตรประชาชนหรือบัตรทางราชการ</li>
              <li>ต้องรู้จัก/เกี่ยวข้องกับผู้ต้องขัง</li>
              <li>เยี่ยมได้ครั้งละ 20 นาที / วัน</li>
              <li>เมื่อหมดเวลา ต้องออกทันที</li>
              <li>แต่งกายสุภาพ ห้ามมึนเมา</li>
              <li>พูดจาสุภาพ ห้ามเสียงดัง</li>
              <li>ห้ามมีโรคติดต่อร้ายแรง</li>
              <li>ห้ามชี้นำ/ชักชวนให้ทำผิดกฎหมาย</li>
              <li>ห้ามส่งของโดยไม่ได้รับอนุญาต</li>
              <li>ต้องยินยอมให้ตรวจค้น</li>
              <li>หากต้องมอบอำนาจ แจ้งเจ้าหน้าที่</li>
              <li>หากรอเกิน 30 นาทีให้แจ้งเจ้าหน้าที่</li>
              <li>ห้ามนำมือถือให้ผู้ต้องขังใช้</li>
              <li>หากไม่ได้รับความเป็นธรรม แจ้งผู้บัญชาการ</li>
            </ol>
            <div className="text-center">
              <button
                onClick={() => setShowModal(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
