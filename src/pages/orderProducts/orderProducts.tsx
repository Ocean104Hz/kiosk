import { useLocation } from "react-router-dom"

export default function OrderProductsPage() {
  const searchParams = new URLSearchParams(useLocation().search)
  const lang = searchParams.get("lang") || "en"

  const title =
    lang === "th"
      ? "หน้าสั่งสินค้า"
      : lang === "zh"
      ? "订购商品页面"
      : "Order Products Page"

  const description =
    lang === "th"
      ? "กรุณาเลือกรายการสินค้าที่ต้องการ"
      : lang === "zh"
      ? "请选择您要订购的商品"
      : "Please select the products you want to order"

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-gray-700">{description}</p>
    </div>
  )
}
