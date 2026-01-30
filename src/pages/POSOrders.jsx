import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function POSOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= SEARCH + PAGINATION ================= */
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });

  /* ================= FETCH ORDERS (SERVER SIDE) ================= */
  const loadOrders = async () => {
    try {
      setLoading(true);

      const res = await api.get("/dashboard/pos/orders", {
        params: {
          search, // 🔥 server-side search
          page, // 🔥 server-side page
          perPage, // 🔥 server-side perPage
        },
      });

      setOrders(res.data.data || []);
      setPagination(res.data.pagination || { total: 0, totalPages: 1 });
    } catch (err) {
      console.error("ORDER LIST ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 RELOAD WHEN SEARCH / PAGE / PERPAGE CHANGES */
  useEffect(() => {
    loadOrders();
  }, [search, page, perPage]);

  const printReceipt = (id) => window.open(`/print/receipt/${id}`, "_blank");

  const printInvoice = (id) => window.open(`/print/invoice/${id}`, "_blank");

  return (
    <div className="space-y-4">
      {/* ===== HEADER (UI UNCHANGED) ===== */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Orders</h1>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset page on search
            }}
            className="w-64 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          <button
            onClick={() => setPage(1)}
            className="px-4 py-2 border rounded-xl text-sm hover:bg-gray-100 hidden"
          >
            Search
          </button>

          <button
            onClick={() => navigate("/pos")}
            className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
          >
            + Create Pos Order
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && <p className="text-sm text-gray-500">Loading products...</p>}

      {/* ===== OLD TABLE UI (UNCHANGED) ===== */}
      {!loading && (
        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Order No</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Mobile</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-400">
                    No orders found
                  </td>
                </tr>
              )}

              {orders.map((o, i) => (
                <tr key={o.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{(page - 1) * perPage + i + 1}</td>
                  <td className="px-4 py-3 font-medium">{o.order_no}</td>
                  <td className="px-4 py-3">{o.customer_name}</td>
                  <td className="px-4 py-3">{o.customer_phone}</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    ₹ {o.total}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => navigate(`/pos/orders/${o.id}`)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-gray-900 hover:underline"
                      title="View Order"
                    >
                      👁 View
                    </button>

                    {/* <button
                      onClick={() => printReceipt(o.id)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      77mm
                    </button>
                    <button
                      onClick={() => printInvoice(o.id)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      A4
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== PAGINATION (UI SAFE) ===== */}
      <div className="flex justify-between items-center text-sm">
        {/* PER PAGE */}
        <div className="flex items-center gap-2">
          <span>Rows:</span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            {[5, 10, 15, 25].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* PAGE CONTROLS */}
        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span>
            Page {page} / {pagination.totalPages}
          </span>

          <button
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
