import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate()

  const handleLanguageSelect = (lang: string) => {
    localStorage.setItem("language", lang)
    navigate("/selectTransaction?lang=" + lang)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Select Language / เลือกภาษา / 选择语言</h1>
      <div className="space-x-4">
        <button
          onClick={() => handleLanguageSelect("en")}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          English
        </button>
        <button
          onClick={() => handleLanguageSelect("th")}
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          ภาษาไทย
        </button>
        <button
          onClick={() => handleLanguageSelect("zh")}
          className="bg-red-600 text-white px-6 py-3 rounded"
        >
          中文
        </button>
      </div>
    </div>
  )
}
