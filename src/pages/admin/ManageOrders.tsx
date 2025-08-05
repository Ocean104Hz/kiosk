import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface OrderData {
  id?: string;
  รหัส: string;
  รายการ: string;
  "รายการ(eng)": string;
  "รายการ(zh)": string;
  ราคา: number;
  ลำดับ: number;
  ประเภท?: string;
}

export default function ManageOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [editingOrder, setEditingOrder] = useState<OrderData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("ทั้งหมด");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 🔐 ตรวจสอบสิทธิ์ก่อนแสดงหน้า

  useEffect(() => {
    const checkLogin = () => {
      const user = localStorage.getItem("role");
      if (user !== "admin") {
        navigate("/login");
      }
    };
    checkLogin();
  }, []);

  const fetchOrders = async () => {
    const querySnapshot = await getDocs(collection(db, "order"));
    const fetchedOrders: OrderData[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as OrderData;
      fetchedOrders.push({ ...data, id: docSnap.id });
    });

    fetchedOrders.sort((a, b) => a.ลำดับ - b.ลำดับ);
    setOrders(fetchedOrders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSave = async () => {
    if (!editingOrder) return;

    if (editingOrder.id) {
      await updateDoc(doc(db, "order", editingOrder.id), {
        รหัส: editingOrder.รหัส,
        รายการ: editingOrder.รายการ,
        "รายการ(eng)": editingOrder["รายการ(eng)"],
        "รายการ(zh)": editingOrder["รายการ(zh)"],
        ราคา: editingOrder.ราคา,
        ลำดับ: editingOrder.ลำดับ,
      });
    } else {
      await addDoc(collection(db, "order"), {
        รหัส: editingOrder.รหัส,
        รายการ: editingOrder.รายการ,
        "รายการ(eng)": editingOrder["รายการ(eng)"],
        "รายการ(zh)": editingOrder["รายการ(zh)"],
        ราคา: editingOrder.ราคา,
        ลำดับ: editingOrder.ลำดับ,
      });
    }

    setEditingOrder(null);
    setIsCreating(false);
    fetchOrders();
  };

  const handleDelete = async (id: string) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) {
      await deleteDoc(doc(db, "order", id));
      fetchOrders();
    }
  };

  const openCreateModal = () => {
    setEditingOrder({
      รหัส: "",
      รายการ: "",
      "รายการ(eng)": "",
      "รายการ(zh)": "",
      ราคา: 0,
      ลำดับ: 0,
    });
    setIsCreating(true);
  };
  const handleExport = () => {
    const exportData = orders.map(({ id, ...rest }) => rest); // ไม่เอา id
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, "orders_export.xlsx");
  };
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data: OrderData[] = XLSX.utils.sheet_to_json(ws);

      for (const item of data) {
        const cleanItem = {
          ...item,
          ลำดับ: Number(item.ลำดับ),
          ราคา: Number(item.ราคา),
        };

        const docId = String(cleanItem.ลำดับ); // 🆔 ใช้ลำดับเป็นชื่อ doc
        await setDoc(doc(db, "order", docId), cleanItem);
      }

      fetchOrders();
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-10">
      {/* Header + Logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">รายการออร์เดอร์ทั้งหมด</h1>
        <div className="space-x-3">
          <button
            onClick={openCreateModal}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + เพิ่มรายการใหม่
          </button>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleImport}
            className="hidden"
            id="importExcel"
          />
          <label
            htmlFor="importExcel"
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 cursor-pointer"
          >
            Import Excel
          </label>

          <button
            onClick={handleExport}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Export Excel
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="flex gap-2">
        
        <div className="mb-4 flex items-center gap-4">
        <label className="font-semibold">เลือกประเภท:</label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-400 px-3 py-2 rounded"
        >
          {["ทั้งหมด", "อาหาร", "เครื่องดื่ม", "ของใช้"].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2 flex items-center gap-2">

        <input
          type="text"
          placeholder="ค้นหาด้วยชื่อ, รหัส หรือราคา..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-400 p-2 rounded w-[300px] mb-2"
        />
        </div>
      </div>

      {/* ตารางแสดงรายการ */}
      <table className="table-auto border border-collapse border-black w-full text-center">
        <thead className="bg-blue-300">
          <tr>
            <th className="border px-4 py-2">ลำดับ</th>
            <th className="border px-4 py-2">รายการ</th>
            <th className="border px-4 py-2">รายการ(eng)</th>
            <th className="border px-4 py-2">รายการ(zh)</th>
            <th className="border px-4 py-2">ราคา</th>
            <th className="border px-4 py-2">รหัส</th>
            <th className="border px-4 py-2">ประเภท</th>
            <th className="border px-4 py-2">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {orders
            .filter((order) =>
              filterCategory === "ทั้งหมด"
                ? true
                : order.ประเภท === filterCategory
            )
            .filter((order) =>
              // 🔍 Filter จาก searchTerm
              searchTerm === ""
                ? true
                : `${order.รายการ} ${order["รายการ(eng)"]} ${order["รายการ(zh)"]} ${order.รหัส} ${order.ราคา}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
            .map((order, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{order.ลำดับ}</td>
                <td className="border px-4 py-2">{order.รายการ}</td>
                <td className="border px-4 py-2">{order["รายการ(eng)"]}</td>
                <td className="border px-4 py-2">{order["รายการ(zh)"]}</td>
                <td className="border px-4 py-2">{order.ราคา}</td>
                <td className="border px-4 py-2">{order.รหัส}</td>
                <td className="border px-4 py-2">{order.ประเภท || "-"}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                    onClick={() => setEditingOrder(order)}
                  >
                    แก้ไข
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(order.id!)}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal เพิ่ม/แก้ไข */}
      {editingOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-[400px]">
            <h2 className="text-xl font-bold mb-4">
              {editingOrder.id ? "แก้ไขรายการ" : "เพิ่มรายการใหม่"}
            </h2>

            {[
              "ลำดับ",
              "รายการ",
              "รายการ(eng)",
              "รายการ(zh)",
              "ราคา",
              "รหัส",
            ].map((field) => (
              <div className="mb-3" key={field}>
                <label className="block font-semibold mb-1">{field}</label>
                <input
                  className="w-full p-2 border rounded"
                  value={(editingOrder as any)[field]}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      [field]:
                        field === "ราคา" || field === "ลำดับ"
                          ? Number(e.target.value)
                          : e.target.value,
                    })
                  }
                />
              </div>
            ))}

            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => {
                  setEditingOrder(null);
                  setIsCreating(false);
                }}
              >
                ยกเลิก
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleSave}
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
