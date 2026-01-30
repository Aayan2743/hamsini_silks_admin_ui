// import { useState, useMemo } from "react";

// export default function CartPanel({ cart = [], setCart }) {
//   const [customer, setCustomer] = useState("");
//   const [discount, setDiscount] = useState(0);
//   const [paymentMode, setPaymentMode] = useState("pay"); // pay | link

//   /* ================= CALCULATIONS ================= */
//   const subtotal = useMemo(
//     () => cart.reduce((s, i) => s + i.price * i.qty, 0),
//     [cart]
//   );

//   const gst = useMemo(() => (subtotal * 5) / 100, [subtotal]);
//   const total = Math.max(subtotal + gst - discount, 0);

//   /* ================= QTY HANDLERS ================= */
//   const increaseQty = (index) => {
//     setCart((prev) =>
//       prev.map((item, i) => {
//         if (i !== index) return item;
//         if (item.qty >= item.stock) return item; // ❌ stock limit
//         return { ...item, qty: item.qty + 1 };
//       })
//     );
//   };

//   const decreaseQty = (index) => {
//     setCart((prev) =>
//       prev
//         .map((item, i) => (i === index ? { ...item, qty: item.qty - 1 } : item))
//         .filter((item) => item.qty > 0)
//     );
//   };

//   /* ================= PAYLOAD LOG ================= */
//   const handleSubmit = () => {
//     const payload = {
//       customer,
//       payment_mode: paymentMode,
//       items: cart.map((item) => ({
//         product_id: item.product_id,
//         product_name: item.product_name,
//         variation_id: item.variation_id,
//         variation_name: item.variation_name,
//         price: item.price,
//         qty: item.qty,
//         stock: item.stock,
//       })),
//       subtotal: Number(subtotal.toFixed(2)),
//       gst: Number(gst.toFixed(2)),
//       discount,
//       total: Number(total.toFixed(2)),
//     };

//     console.log("🧾 POS PAYMENT PAYLOAD:", payload);
//   };

//   return (
//     <div className="w-96 bg-white border-l flex flex-col h-screen">
//       {/* HEADER */}
//       <div className="p-4 border-b">
//         <h3 className="text-lg font-semibold">Billing</h3>
//       </div>

//       {/* CUSTOMER */}
//       <div className="p-4 border-b space-y-2">
//         <label className="text-sm text-gray-600">Customer Name / Mobile</label>
//         <input
//           value={customer}
//           onChange={(e) => setCustomer(e.target.value)}
//           placeholder="Walk-in customer / Mobile"
//           className="w-full border rounded-lg px-3 py-2 text-sm"
//         />
//       </div>

//       {/* ITEMS */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-3">
//         {cart.map((item, i) => {
//           const outOfStock = item.stock <= 0;
//           const maxReached = item.qty >= item.stock;

//           return (
//             <div
//               key={i}
//               className="border rounded-xl p-3 flex justify-between items-center"
//             >
//               {/* LEFT */}
//               <div>
//                 <p className="font-medium text-sm">{item.product_name}</p>
//                 <p className="text-xs text-gray-500">{item.variation_name}</p>
//                 <p className="text-sm mt-1 font-semibold">₹ {item.price}</p>

//                 {outOfStock && (
//                   <p className="text-xs text-red-500">Out of stock</p>
//                 )}
//               </div>

//               {/* QTY */}
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => decreaseQty(i)}
//                   className="h-8 w-8 border rounded-lg flex items-center justify-center hover:bg-gray-100"
//                 >
//                   −
//                 </button>

//                 <span className="w-6 text-center font-medium">{item.qty}</span>

//                 <button
//                   disabled={outOfStock || maxReached}
//                   onClick={() => increaseQty(i)}
//                   className={`h-8 w-8 border rounded-lg flex items-center justify-center ${
//                     outOfStock || maxReached
//                       ? "opacity-40 cursor-not-allowed"
//                       : "hover:bg-gray-100"
//                   }`}
//                 >
//                   +
//                 </button>
//               </div>
//             </div>
//           );
//         })}

//         {cart.length === 0 && (
//           <p className="text-center text-gray-400 mt-10">No items added</p>
//         )}
//       </div>

//       {/* SUMMARY */}
//       <div className="border-t p-4 space-y-3 text-sm">
//         <Row label="Subtotal" value={`₹ ${subtotal.toFixed(2)}`} />
//         <Row label="GST (5%)" value={`₹ ${gst.toFixed(2)}`} />

//         <div className="flex justify-between items-center">
//           <span className="text-gray-600">Discount</span>
//           <input
//             type="number"
//             min={0}
//             value={discount}
//             onChange={(e) => setDiscount(Number(e.target.value))}
//             className="w-24 border rounded px-2 py-1 text-right"
//           />
//         </div>

//         <div className="flex justify-between font-semibold text-lg pt-2">
//           <span>Total</span>
//           <span>₹ {total.toFixed(2)}</span>
//         </div>
//       </div>

//       {/* PAYMENT */}
//       <div className="p-4 border-t space-y-3">
//         <div className="grid grid-cols-2 gap-2">
//           <button
//             onClick={() => setPaymentMode("pay")}
//             className={`py-3 rounded-xl text-sm font-semibold ${
//               paymentMode === "pay"
//                 ? "bg-green-600 text-white shadow"
//                 : "border hover:bg-gray-100"
//             }`}
//           >
//             💳 Pay Now
//           </button>

//           <button
//             onClick={() => setPaymentMode("link")}
//             className={`py-3 rounded-xl text-sm font-semibold ${
//               paymentMode === "link"
//                 ? "bg-blue-600 text-white shadow"
//                 : "border hover:bg-gray-100"
//             }`}
//           >
//             🔗 Payment Link
//           </button>
//         </div>

//         {paymentMode === "pay" ? (
//           <button
//             disabled={cart.length === 0}
//             onClick={handleSubmit}
//             className="w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-2xl text-lg font-bold disabled:opacity-40"
//           >
//             Proceed to Pay ₹ {total.toFixed(2)}
//           </button>
//         ) : (
//           <button
//             disabled={!customer || cart.length === 0}
//             onClick={handleSubmit}
//             className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-2xl text-lg font-bold disabled:opacity-40"
//           >
//             Send Payment Link
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// /* SMALL ROW */
// function Row({ label, value }) {
//   return (
//     <div className="flex justify-between">
//       <span className="text-gray-600">{label}</span>
//       <span>{value}</span>
//     </div>
//   );
// }

import { useState, useMemo } from "react";
import api from "../api/axios";

export default function CartPanel({ cart = [], setCart }) {
  /* ================= CUSTOMER ================= */
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
  });

  const [discount, setDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("pay");

  /* ================= GST ================= */
  const [gstEnabled, setGstEnabled] = useState(true);
  const [gstPercent, setGstPercent] = useState(5);

  /* ================= HELPERS ================= */
  const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

  /* ================= CALCULATIONS ================= */
  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.qty, 0),
    [cart]
  );

  const gst = useMemo(() => {
    if (!gstEnabled) return 0;
    return (subtotal * gstPercent) / 100;
  }, [subtotal, gstEnabled, gstPercent]);

  const total = Math.max(subtotal + gst - discount, 0);

  /* ================= QTY HANDLERS ================= */
  const increaseQty = (index) => {
    setCart((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        if (item.qty >= item.stock) return item;
        return { ...item, qty: item.qty + 1 };
      })
    );
  };

  const decreaseQty = (index) => {
    setCart((prev) =>
      prev
        .map((item, i) => (i === index ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0)
    );
  };

  /* ================= SUBMIT ================= */
  const handleSubmitd = () => {
    if (!customer.name || !isValidPhone(customer.phone)) {
      alert("Enter valid customer name & 10-digit mobile (6–9)");
      return;
    }

    const payload = {
      customer,
      payment_mode: paymentMode,
      gst: {
        enabled: gstEnabled,
        percent: gstPercent,
        amount: Number(gst.toFixed(2)),
      },
      items: cart.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        variation_id: item.variation_id,
        variation_name: item.variation_name,
        price: item.price,
        qty: item.qty,
        stock: item.stock,
      })),
      subtotal: Number(subtotal.toFixed(2)),
      discount,
      total: Number(total.toFixed(2)),
    };

    console.log("🧾 POS PAYMENT PAYLOAD:", payload);
  };

  const handleSubmit = async () => {
    // 🔐 basic validation
    if (!customer.name || !isValidPhone(customer.phone)) {
      alert("Enter valid customer name & 10-digit mobile (6–9)");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const payload = {
      customer,
      payment_mode: paymentMode,
      gst: {
        enabled: gstEnabled,
        percent: gstPercent,
        amount: Number(gst.toFixed(2)),
      },
      items: cart.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        variation_id: item.variation_id,
        variation_name: item.variation_name,
        price: item.price,
        qty: item.qty,
        stock: item.stock,
      })),
      subtotal: Number(subtotal.toFixed(2)),
      discount,
      total: Number(total.toFixed(2)),
    };

    console.log("🧾 POS PAYMENT PAYLOAD:", payload);

    try {
      // 🔥 API CALL (auth handled by axios instance)
      const res = await api.post("/dashboard/pos/create-order", payload);

      if (res.data?.status) {
        alert(`Order Created: ${res.data.order_no}`);

        // 🧹 clear cart after success
        setCart([]);

        // OPTIONAL (later)
        // window.open(`/print/receipt/${res.data.order_id}`);
        // window.open(`/invoice/a4/${res.data.order_id}`);
      } else {
        alert("Order failed");
      }
    } catch (err) {
      console.error("POS ORDER API ERROR:", err);

      alert(
        err.response?.data?.message ||
          "Something went wrong while creating order"
      );
    }
  };

  return (
    <div className="w-96 bg-white border-l flex flex-col h-screen">
      {/* HEADER */}
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Billing</h3>
      </div>

      {/* CUSTOMER (EXTENDED, UI SAME) */}
      <div className="p-4 border-b space-y-2">
        <input
          value={customer.name}
          onChange={(e) => setCustomer((p) => ({ ...p, name: e.target.value }))}
          placeholder="Customer Name"
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <input
          value={customer.phone}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            if (val.length <= 10) {
              setCustomer((p) => ({ ...p, phone: val }));
            }
          }}
          placeholder="Mobile Number"
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        {!isValidPhone(customer.phone) && customer.phone.length > 0 && (
          <p className="text-xs text-red-500">
            Enter valid 10-digit mobile starting with 6–9
          </p>
        )}
      </div>

      {/* ITEMS (UNCHANGED) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.map((item, i) => {
          const outOfStock = item.stock <= 0;
          const maxReached = item.qty >= item.stock;

          return (
            <div
              key={i}
              className="border rounded-xl p-3 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-sm">{item.product_name}</p>
                <p className="text-xs text-gray-500">{item.variation_name}</p>
                <p className="text-sm mt-1 font-semibold">₹ {item.price}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQty(i)}
                  className="h-8 w-8 border rounded-lg"
                >
                  −
                </button>

                <span>{item.qty}</span>

                <button
                  disabled={outOfStock || maxReached}
                  onClick={() => increaseQty(i)}
                  className="h-8 w-8 border rounded-lg"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SUMMARY (GST EDITABLE, UI SAME) */}
      <div className="border-t p-4 space-y-3 text-sm">
        <Row label="Subtotal" value={`₹ ${subtotal.toFixed(2)}`} />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={gstEnabled}
              onChange={(e) => setGstEnabled(e.target.checked)}
            />
            GST (%)
          </label>

          <input
            type="number"
            value={gstPercent}
            disabled={!gstEnabled}
            onChange={(e) => setGstPercent(Number(e.target.value))}
            className="w-20 border rounded px-2 py-1 text-right"
          />
        </div>

        <Row label="GST" value={`₹ ${gst.toFixed(2)}`} />

        <div className="flex justify-between items-center">
          <span>Discount</span>
          <input
            type="number"
            min={0}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-24 border rounded px-2 py-1 text-right"
          />
        </div>

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₹ {total.toFixed(2)}</span>
        </div>
      </div>

      {/* PAYMENT (UNCHANGED UI) */}
      <div className="p-4 border-t space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setPaymentMode("pay")}
            className={`py-3 rounded-xl ${
              paymentMode === "pay" ? "bg-green-600 text-white" : "border"
            }`}
          >
            Pay Now
          </button>

          <button
            onClick={() => setPaymentMode("link")}
            className={`py-3 rounded-xl ${
              paymentMode === "link" ? "bg-blue-600 text-white" : "border"
            }`}
          >
            Payment Link
          </button>
        </div>

        <button
          disabled={
            cart.length === 0 || !customer.name || !isValidPhone(customer.phone)
          }
          onClick={handleSubmit}
          className="w-full bg-green-700 text-white py-4 rounded-2xl disabled:opacity-40"
        >
          Proceed to Pay ₹ {total.toFixed(2)}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
