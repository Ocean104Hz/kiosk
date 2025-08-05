import { useLocation, useNavigate } from "react-router-dom"

export default function SelectTransaction() {
  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)
  const lang = searchParams.get("lang") || "en"

  const labels = {
    title:
      lang === "th"
        ? "เลือกรายการ"
        : lang === "zh"
        ? "请选择操作"
        : "Select Transaction",
    visitor: lang === "th" ? "ผู้เยี่ยมชม" : lang === "zh" ? "访客" : "Visitor",
    deposit: lang === "th" ? "ฝากของ" : lang === "zh" ? "寄存" : "Deposit",
    order: lang === "th" ? "สั่งสินค้า" : lang === "zh" ? "订购商品" : "Order Products",
  }

  const handleClick = (path: string) => {
    navigate(`${path}?lang=${lang}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">{labels.title}</h1>
      <div className="space-y-4 w-full max-w-sm">
        <button
          className="w-full bg-gray-700 text-white py-3 rounded"
          onClick={() => handleClick("/visitor")}
        >
          {labels.visitor}
        </button>
        <button
          className="w-full bg-blue-700 text-white py-3 rounded"
          onClick={() => handleClick("/deposit")}
        >
          {labels.deposit}
        </button>
        <button
          className="w-full bg-green-700 text-white py-3 rounded"
          onClick={() => handleClick("/order-products")}
        >
          {labels.order}
        </button>
      </div>
    </div>
  )
}
