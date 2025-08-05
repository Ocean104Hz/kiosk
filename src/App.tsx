import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/Homepage/homepage"
import SelectTransaction from "./pages/selectTransaction/selectTransaction"
import Visitor from "./pages/visitor/visitor"
import Deposit from "./pages/deposit/deposit"
import OrderProducts from "./pages/orderProducts/orderProducts"
import HomePage2 from "./pages/Homepage/HomePage2"
import HomePageEn from "./pages/Homepage/HomePageEn"
import HomePageZh from "./pages/Homepage/HomePageZh"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/homepageTH" element={<HomePage2 />} />
      <Route path="/homepageEN" element={<HomePageEn />} />
      <Route path="/homepageZh" element={<HomePageZh />} />
      <Route path="/selectTransaction" element={<SelectTransaction />} />
      <Route path="/visitor" element={<Visitor />} />
      <Route path="/deposit" element={<Deposit />} />
      <Route path="/order-products" element={<OrderProducts />} />
    </Routes>
  )
}
