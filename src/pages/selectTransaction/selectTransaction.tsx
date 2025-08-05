import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { CheckCircle } from "lucide-react";

export default function SelectTransaction() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const lang = searchParams.get("lang") || "en";

  const labels = {
    title:
      lang === "th"
        ? "ขั้นตอนที่ 3: เลือกบริการ"
        : lang === "zh"
        ? "第3步：请选择服务"
        : "Step 3: Select Service",
    visitor:
      lang === "th"
        ? "เยี่ยมญาติ"
        : lang === "zh"
        ? "探视"
        : "Visit",
    deposit:
      lang === "th"
        ? "ฝากเงิน"
        : lang === "zh"
        ? "存款"
        : "Deposit",
    order:
      lang === "th"
        ? "ซื้อสินค้า"
        : lang === "zh"
        ? "购买商品"
        : "Order Products",
    sub_visitor:
      lang === "th"
        ? "จองคิวเข้าเยี่ยมผู้ต้องขัง"
        : lang === "zh"
        ? "预约探视"
        : "Book visit",
    sub_deposit:
      lang === "th"
        ? "ฝากเงินให้ผู้ต้องขัง"
        : lang === "zh"
        ? "给在押人员存款"
        : "Deposit money",
    sub_order:
      lang === "th"
        ? "ซื้อของใช้ให้ผู้ต้องขัง"
        : lang === "zh"
        ? "为在押人员购买物品"
        : "Buy items for inmate",
    confirm:
      lang === "th"
        ? "ยืนยันการใช้บริการ"
        : lang === "zh"
        ? "确认使用服务"
        : "Confirm Service",
  };

  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (path: string) => {
    setSelected(path);
  };

  const handleConfirm = () => {
    if (selected) {
      navigate(`${selected}?lang=${lang}`);
    } else {
      alert("กรุณาเลือกบริการก่อน / Please select a service.");
    }
  };

  const services = [
    {
      key: "/visitor",
      icon: "/img/visit.png",
      title: labels.visitor,
      subtitle: labels.sub_visitor,
      border: "border-blue-500",
      bg: "bg-blue-50",
    },
    {
      key: "/deposit",
      icon: "/img/deposit.png",
      title: labels.deposit,
      subtitle: labels.sub_deposit,
      border: "border-yellow-500",
      bg: "bg-yellow-50",
    },
    {
      key: "/order-products",
      icon: "/img/order.png",
      title: labels.order,
      subtitle: labels.sub_order,
      border: "border-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">
        {labels.title}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {services.map((item) => (
          <div
            key={item.key}
            onClick={() => handleSelect(item.key)}
            className={`cursor-pointer p-6 rounded-xl border-2 shadow-sm transition-all duration-200 ${
              selected === item.key
                ? `${item.border} ${item.bg}`
                : "border-gray-200 bg-white"
            } hover:shadow-md`}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <img src={item.icon} alt={item.title} className="w-16 h-16" />
              <p className="text-lg font-semibold">{item.title}</p>
              <p className="text-sm text-gray-500">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleConfirm}
        className="mt-10 flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-md shadow hover:bg-green-700 transition"
      >
        <CheckCircle size={20} className="text-white" />
        {labels.confirm}
      </button>
    </div>
  );
}
