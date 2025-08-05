import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/homepage"
import SelectTransaction from "./pages/selectTransaction/selectTransaction"
import Visitor from "./pages/visitor/visitor"
import Deposit from "./pages/deposit/deposit"
import OrderProducts from "./pages/orderProducts/orderProducts"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/selectTransaction" element={<SelectTransaction />} />
      <Route path="/visitor" element={<Visitor />} />
      <Route path="/deposit" element={<Deposit />} />
      <Route path="/order-products" element={<OrderProducts />} />
    </Routes>
  )
}
