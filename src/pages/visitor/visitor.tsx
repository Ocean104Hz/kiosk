import { useLocation } from "react-router-dom"

export default function VisitorPage() {
  const searchParams = new URLSearchParams(useLocation().search)
  const lang = searchParams.get("lang") || "en"

  const title =
    lang === "th"
      ? "หน้าผู้เยี่ยมชม"
      : lang === "zh"
      ? "访客页面"
      : "Visitor Page"

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  )
}


