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
  getDoc
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
  const uniqueCategories = Array.from(
  new Set(orders.map((order) => order.ประเภท).filter(Boolean))
  );
  const [editingOrder, setEditingOrder] = useState<OrderData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCollection, setSelectedCollection] = useState<"order" | "prepared-food">("order");
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    const querySnapshot = await getDocs(collection(db, selectedCollection));
    const fetchedOrders: OrderData[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as OrderData;
      fetchedOrders.push({ ...data, id: docSnap.id });
    });

    fetchedOrders.sort((a, b) => a.ลำดับ - b.ลำดับ);
    setOrders(fetchedOrders);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedCollection]);

  const handleSave = async () => {
  if (!editingOrder) return;
  const docRef = editingOrder.id
    ? doc(db, selectedCollection, editingOrder.id)
    : doc(db, selectedCollection, String(editingOrder.รหัส));

  await setDoc(docRef, editingOrder);
  setEditingOrder(null);
  setIsCreating(false);
  fetchOrders();
};


  const handleDelete = async (id: string) => {
    if (confirm("\u0e04\u0e38\u0e13\u0e41\u0e19\u0e48\u0e43\u0e08\u0e2b\u0e23\u0e37\u0e2d\u0e44\u0e21\u0e27\u0e48\u0e32\u0e15\u0e49\u0e2d\u0e07\u0e25\u0e1a\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e19\u0e35\u0e49?")) {
      await deleteDoc(doc(db, selectedCollection, id));
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
      ประเภท: "",
    });
    setIsCreating(true);
  };

  const handleExport = () => {
    const exportData = orders.map(({ id, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, `${selectedCollection}_export.xlsx`);
  };

 const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setIsLoading(true); // ⏳ เริ่มโหลด

  const reader = new FileReader();
  reader.onload = async (evt) => {
    try {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data: OrderData[] = XLSX.utils.sheet_to_json(ws);

      // ✅ เช็คหัวตาราง
      const expectedHeaders = ["รหัส", "รายการ", "รายการ(eng)", "รายการ(zh)", "ราคา", "ลำดับ"];
      const actualHeaders = Object.keys(data[0] || {});
      const missingHeaders = expectedHeaders.filter((key) => !actualHeaders.includes(key));
      if (missingHeaders.length > 0) {
        alert(`หัวตารางหายไป: ${missingHeaders.join(", ")}`);
        setIsLoading(false);
        return;
      }

      const changes: string[] = [];

      for (const item of data) {
        if (!item.รหัส) continue;

        const cleanItem: OrderData = {
          รหัส: String(item.รหัส || "-"),
          รายการ: String(item.รายการ || "-"),
          "รายการ(eng)": String(item["รายการ(eng)"] || "-"),
          "รายการ(zh)": String(item["รายการ(zh)"] || "-"),
          ราคา: isNaN(Number(item.ราคา)) ? 0 : Number(item.ราคา),
          ลำดับ: isNaN(Number(item.ลำดับ)) ? 0 : Number(item.ลำดับ),
          ประเภท: String(item.ประเภท || "-").trim(),
        };

        const docRef = doc(db, selectedCollection, cleanItem.รหัส);
        const existingDoc = await getDoc(docRef);

        if (!existingDoc.exists()) {
          await setDoc(docRef, cleanItem);
          changes.push(`🟢 เพิ่มใหม่: ${cleanItem.รหัส}`);
        } else {
          const existingData = existingDoc.data();
          const diff: string[] = [];

          for (const key of Object.keys(cleanItem)) {
            if (cleanItem[key as keyof OrderData] !== existingData[key]) {
              diff.push(`${key}: '${existingData[key]}' → '${cleanItem[key as keyof OrderData]}'`);
            }
          }

          if (diff.length > 0) {
            await setDoc(docRef, cleanItem);
            changes.push(`🟡 อัปเดต: ${cleanItem.รหัส}\n  ${diff.join("\n  ")}`);
          }
        }
      }

      if (changes.length === 0) {
        alert("ไม่พบการเปลี่ยนแปลงใด ๆ");
      } else {
        alert(`สรุปผลการนำเข้า:\n\n${changes.join("\n\n")}`);
      }

      fetchOrders();
    } catch (err) {
      alert("เกิดข้อผิดพลาดระหว่าง import");
      console.error(err);
    } finally {
      setIsLoading(false); // ✅ หยุดโหลดแม้ error
    }
  };

  reader.readAsBinaryString(file);
};
  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">รายการออร์เดอร์ทั้งหมด</h1>
        <div className="space-x-3">
          <button onClick={openCreateModal} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            + เพิ่มรายการใหม่
          </button>

          <input type="file" accept=".xlsx, .xls" onChange={handleImport} className="hidden" id="importExcel" />
          <label htmlFor="importExcel" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 cursor-pointer">
            Import Excel
          </label>

          <button onClick={handleExport} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Export Excel
          </button>

          <button onClick={() => { localStorage.clear(); navigate("/"); }} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>

      <div className="flex gap-4 items-center mb-4">
        <label className="font-semibold">เลือก Collection:</label>
        <select
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value as any)}
          className="border border-gray-400 px-3 py-2 rounded"
        >
          <option value="order">order</option>
          <option value="prepared-food">prepared-food</option>
        </select>

        <label className="font-semibold">เลือกประเภท:</label>
        <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-400 px-3 py-2 rounded"
          >
            <option value="ทั้งหมด">ทั้งหมด</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

        <input
          type="text"
          placeholder="ค้นหาด้วยชื่อ, รหัส หรือราคา..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-400 p-2 rounded w-[300px]"
        />
      </div>

      {isLoading ? (
        <div className="text-center my-10 text-lg text-gray-600">กำลังโหลดข้อมูล...</div>
      ) : (
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
              .filter((order) => filterCategory === "ทั้งหมด" || order.ประเภท === filterCategory)
              .filter((order) =>
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
                    <button className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500" onClick={() => setEditingOrder(order)}>แก้ไข</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(order.id!)}>ลบ</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {editingOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-[400px]">
            <h2 className="text-xl font-bold mb-4">
              {editingOrder.id ? "แก้ไขรายการ" : "เพิ่มรายการใหม่"}
            </h2>

            {["ลำดับ", "รายการ", "รายการ(eng)", "รายการ(zh)", "ราคา", "รหัส"].map((field) => (
              <div className="mb-3" key={field}>
                <label className="block font-semibold mb-1">{field}</label>
                <input
                  className="w-full p-2 border rounded"
                  value={(editingOrder as any)[field]}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      [field]: field === "ราคา" || field === "ลำดับ" ? Number(e.target.value) : e.target.value,
                    })
                  }
                />
              </div>
            ))}

            {/* ประเภท */}
            <div className="mb-3">
              <label className="block font-semibold mb-1">ประเภท</label>
              <select
                  className="w-full p-2 border rounded"
                  value={editingOrder.ประเภท || ""}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      ประเภท: e.target.value,
                    })
                  }
                >
                  <option value="">-- เลือกประเภท --</option>
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => {
                  setEditingOrder(null);
                  setIsCreating(false);
                }}
              >ยกเลิก</button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleSave}
              >บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}