import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

/* ================= ROW ================= */
function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default function POSOrderView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ORDER ================= */
  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const res = await api.get(`/dashboard/pos/order/${id}`);
      setOrder(res.data.data);
    } catch (err) {
      console.error("ORDER VIEW ERROR:", err);
      alert("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CALCULATIONS ================= */
  const itemsTotal = useMemo(() => {
    if (!order) return 0;
    return order.items.reduce((s, i) => s + Number(i.qty) * Number(i.price), 0);
  }, [order]);

  const print77 = () => window.open(`/print/receipt/${id}`, "_blank");
  const printA4 = () => window.open(`/print/invoice/${id}`, "_blank");

  if (loading) {
    return <div className="p-6">Loading order...</div>;
  }

  if (!order) {
    return <div className="p-6">Order not found</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Order #{order.order_no}</h1>
        </div>

        <div className="flex gap-2">
          {/* <button
            onClick={print77}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
          >
            🧾 Print 77mm
          </button>
          <button
            onClick={printA4}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
          >
            🖨️ Print A4
          </button> */}

          <button
            onClick={() => navigate(`/orders`)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
          >
            Back
          </button>
        </div>
      </div>

      {/* ================= CUSTOMER ================= */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <h3 className="font-semibold mb-2">Customer Details</h3>
        <p className="text-sm">
          <b>Name:</b> {order.customer.name}
        </p>
        <p className="text-sm">
          <b>Mobile:</b> {order.customer.phone}
        </p>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= ITEMS ================= */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-4">
            Items ({order.items.length})
          </h3>

          {/* SCROLLABLE ITEMS (30+ SAFE) */}
          <div className="max-h-[520px] overflow-y-auto space-y-3 pr-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border rounded-xl p-3 hover:bg-gray-50"
              >
                {/* IMAGE (STATIC PLACEHOLDER) */}
                <div className="h-16 w-16 rounded-lg overflow-hidden border bg-gray-100">
                  <img
                    src={item.product_images?.[0]?.image_url || "/no-image.png"}
                    alt={item.product_name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* INFO */}
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.product_name}</p>
                  <p className="text-xs text-gray-500">{item.variation_name}</p>
                  <p className="text-xs text-gray-400">
                    Qty {item.qty} × ₹{item.price}
                  </p>
                </div>

                {/* TOTAL */}
                <div className="font-semibold text-sm">
                  ₹ {Number(item.qty) * Number(item.price)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-6">
          <h3 className="text-lg font-semibold mb-4">Bill Summary</h3>

          <div className="space-y-2">
            <Row label="Items Total" value={`₹ ${itemsTotal}`} />

            {order.gst.enabled && (
              <Row
                label={`GST (${order.gst.percent}%)`}
                value={`₹ ${order.gst.amount}`}
              />
            )}

            <Row label="Discount" value={`₹ ${order.discount}`} />
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-indigo-600">
              ₹ {order.total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
