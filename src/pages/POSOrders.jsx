// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios";

// export default function POSOrders() {
//   const navigate = useNavigate();

//   // ================= STATE =================
//   const [allOrders, setAllOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(10);

//   // ================= FETCH ORDERS =================
//   const loadOrders = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/admin-dashboard/orders");
//       setAllOrders(res.data.data || []);
//     } catch (err) {
//       console.error("ORDER LIST ERROR:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   // ================= SEARCH =================
//   const filteredOrders = useMemo(() => {
//     if (!search) return allOrders;

//     const q = search.toLowerCase();

//     return allOrders.filter((o) => {
//       const productName = o.items?.[0]?.product?.name?.toLowerCase() || "";

//       const customerName = o.user?.name?.toLowerCase() || "";
//       const customerPhone = String(o.user?.phone || "");

//       return (
//         String(o.id).includes(q) ||
//         productName.includes(q) ||
//         customerName.includes(q) ||
//         customerPhone.includes(q)
//       );
//     });
//   }, [allOrders, search]);

//   // ================= PAGINATION =================
//   const totalPages = Math.ceil(filteredOrders.length / perPage);

//   const paginatedOrders = useMemo(() => {
//     const start = (page - 1) * perPage;
//     return filteredOrders.slice(start, start + perPage);
//   }, [filteredOrders, page, perPage]);

//   // ================= RESET PAGE =================
//   useEffect(() => {
//     setPage(1);
//   }, [search, perPage]);

//   // ================= UI =================
//   return (
//     <div className="space-y-4">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold">Orders</h1>
//       </div>

//       {loading && <p className="text-sm text-gray-500">Loading orders...</p>}

//       {!loading && (
//         <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead className="bg-gray-100 text-gray-600">
//               <tr>
//                 <th className="px-4 py-3 text-left">#</th>
//                 <th className="px-4 py-3 text-left">Order No</th>
//                 <th className="px-4 py-3 text-left">Customer</th>
//                 <th className="px-4 py-3 text-left">Phone</th>
//                 <th className="px-4 py-3 text-left">Email</th>
//                 <th className="px-4 py-3 text-right">Total</th>
//                 <th className="px-4 py-3 text-left">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {paginatedOrders.length === 0 && (
//                 <tr>
//                   <td colSpan="7" className="text-center py-6 text-gray-400">
//                     No orders found
//                   </td>
//                 </tr>
//               )}

//               {paginatedOrders.map((o, i) => (
//                 <tr key={o.id} className="border-t hover:bg-gray-50">
//                   <td className="px-4 py-3">{(page - 1) * perPage + i + 1}</td>

//                   <td className="px-4 py-3 font-medium">ORD-{o.id}</td>

//                   <td className="px-4 py-3">{o.user?.name || "Walk-in"}</td>

//                   <td className="px-4 py-3">{o.user?.phone || "-"}</td>

//                   <td className="px-4 py-3">{o.user?.email || "-"}</td>

//                   <td className="px-4 py-3 text-right font-semibold">
//                     ₹ {o.total_amount}
//                   </td>

//                   <td className="px-4 py-3">
//                     <button
//                       onClick={() => navigate(`/pos/orders/${o.id}`)}
//                       className="text-sm text-indigo-600 hover:underline"
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* PAGINATION */}
//       {!loading && filteredOrders.length > 0 && (
//         <div className="flex justify-between items-center text-sm">
//           <div className="flex items-center gap-2">
//             <span>Rows:</span>
//             <select
//               value={perPage}
//               onChange={(e) => setPerPage(Number(e.target.value))}
//               className="border rounded px-2 py-1"
//             >
//               {[5, 10, 15, 25].map((n) => (
//                 <option key={n} value={n}>
//                   {n}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage(page - 1)}
//               className="px-3 py-1 border rounded disabled:opacity-40"
//             >
//               Prev
//             </button>

//             <span>
//               Page {page} / {totalPages || 1}
//             </span>

//             <button
//               disabled={page === totalPages}
//               onClick={() => setPage(page + 1)}
//               className="px-3 py-1 border rounded disabled:opacity-40"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const STATUS_OPTIONS = ["confirmed", "packing", "shipping", "delivered"];

export default function POSOrders() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  /* ================= FETCH ORDERS ================= */
  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin-dashboard/orders");
      setAllOrders(res.data.data || []);
    } catch (err) {
      console.error("ORDER LIST ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  /* ================= STATUS UPDATE ================= */
  const updateStatus = async (orderId, status) => {
    let tracking_id = null;

    if (status === "shipping") {
      tracking_id = prompt("Enter Tracking ID");
      if (!tracking_id) return;
    }

    try {
      await api.post(`/admin-dashboard/orders/${orderId}/status`, {
        status,
        tracking_id,
      });
      loadOrders(); // refresh
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  /* ================= SEARCH ================= */
  const filteredOrders = useMemo(() => {
    if (!search) return allOrders;

    const q = search.toLowerCase();

    return allOrders.filter((o) => {
      return (
        String(o.id).includes(q) ||
        o.user?.name?.toLowerCase().includes(q) ||
        String(o.user?.phone || "").includes(q)
      );
    });
  }, [allOrders, search]);

  /* ================= PAGINATION (OLD STYLE) ================= */
  const totalPages = Math.ceil(filteredOrders.length / perPage);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredOrders.slice(start, start + perPage);
  }, [filteredOrders, page, perPage]);

  useEffect(() => {
    setPage(1);
  }, [search, perPage]);

  /* ================= UI ================= */
  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Orders</h1>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading orders...</p>}

      {!loading && (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Order No</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-400">
                    No orders found
                  </td>
                </tr>
              )}

              {paginatedOrders.map((o, i) => (
                <tr key={o.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{(page - 1) * perPage + i + 1}</td>

                  <td className="px-4 py-3 font-medium">ORD-{o.id}</td>

                  <td className="px-4 py-3">{o.user?.name || "Walk-in"}</td>

                  <td className="px-4 py-3">{o.user?.phone || "-"}</td>

                  <td className="px-4 py-3">{o.user?.email || "-"}</td>

                  <td className="px-4 py-3 text-right font-semibold">
                    ₹ {o.total_amount}
                  </td>

                  {/* STATUS DROPDOWN */}
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    {o.tracking_id && (
                      <div className="text-xs text-gray-500 mt-1">
                        Tracking: {o.tracking_id}
                      </div>
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/pos/orders/${o.id}`)}
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== OLD PAGINATION UI ===== */}
      {!loading && filteredOrders.length > 0 && (
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <span>Rows:</span>
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[5, 10, 15, 25].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Prev
            </button>

            <span>
              Page {page} / {totalPages || 1}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
