import { useLocation } from "react-router-dom"

export default function DepositPage() {
  const searchParams = new URLSearchParams(useLocation().search)
  const lang = searchParams.get("lang") || "en"

  const title =
    lang === "th"
      ? "หน้าฝากของ"
      : lang === "zh"
      ? "寄存页面"
      : "Deposit Page"

  const description =
    lang === "th"
      ? "กรุณานำของที่จะฝากมายื่นที่เคาน์เตอร์"
      : lang === "zh"
      ? "请将您要寄存的物品带到柜台"
      : "Please bring your items to the counter for deposit"

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-gray-700">{description}</p>
    </div>
  )
}
