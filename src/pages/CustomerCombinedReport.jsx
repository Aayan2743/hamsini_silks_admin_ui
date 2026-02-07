import { useState } from "react";

export default function CustomerCombinedReport() {
  /* ================= MOCK DATA ================= */
  const customers = [
    {
      id: 1,
      name: "Mani",
      email: "mani@gmail.com",
      phone: "9951310866",
      wishlist: [
        { id: 101, name: "Soft Silk Saree", price: 4500 },
        { id: 102, name: "Cotton Kurti", price: 1200 },
      ],
      orders: [
        { id: 201, date: "2026-02-05", total: 2500, status: "delivered" },
        { id: 202, date: "2026-02-07", total: 6800, status: "shipping" },
      ],
    },
    {
      id: 2,
      name: "Raj",
      email: "raj@gmail.com",
      phone: "9876543210",
      wishlist: [],
      orders: [{ id: 203, date: "2026-02-06", total: 4200, status: "packing" }],
    },
    {
      id: 3,
      name: "Anita",
      email: "anita@gmail.com",
      phone: "9123456780",
      wishlist: [{ id: 103, name: "Designer Saree", price: 12000 }],
      orders: [
        { id: 204, date: "2026-02-04", total: 12000, status: "delivered" },
        { id: 205, date: "2026-02-06", total: 3500, status: "confirmed" },
        { id: 206, date: "2026-02-07", total: 2200, status: "packing" },
      ],
    },
  ];

  const [openWishlist, setOpenWishlist] = useState(null);
  const [openOrders, setOpenOrders] = useState(null);

  /* ================= UI ================= */
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Customer Report</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-center">Wishlist</th>
              <th className="px-4 py-3 text-center">Orders</th>
              <th className="px-4 py-3 text-right">Total Amount</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c, i) => {
              const totalAmount = c.orders.reduce((s, o) => s + o.total, 0);

              return (
                <>
                  {/* MAIN ROW */}
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3">{c.email}</td>
                    <td className="px-4 py-3">{c.phone}</td>

                    {/* WISHLIST */}
                    <td
                      className="px-4 py-3 text-center text-indigo-600 cursor-pointer hover:underline"
                      onClick={() =>
                        setOpenWishlist(openWishlist === c.id ? null : c.id)
                      }
                    >
                      {c.wishlist.length}
                    </td>

                    {/* ORDERS */}
                    <td
                      className="px-4 py-3 text-center text-indigo-600 cursor-pointer hover:underline"
                      onClick={() =>
                        setOpenOrders(openOrders === c.id ? null : c.id)
                      }
                    >
                      {c.orders.length}
                    </td>

                    <td className="px-4 py-3 text-right font-semibold">
                      ₹ {totalAmount}
                    </td>
                  </tr>

                  {/* WISHLIST DETAILS */}
                  {openWishlist === c.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="7" className="px-6 py-4">
                        <h3 className="font-semibold mb-2">
                          Wishlist Products
                        </h3>

                        {c.wishlist.length === 0 ? (
                          <p className="text-sm text-gray-400">
                            No wishlist items
                          </p>
                        ) : (
                          <ul className="space-y-1 text-sm">
                            {c.wishlist.map((w) => (
                              <li
                                key={w.id}
                                className="flex justify-between border-b pb-1"
                              >
                                <span>{w.name}</span>
                                <span className="font-medium">₹ {w.price}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  )}

                  {/* ORDER DETAILS */}
                  {openOrders === c.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="7" className="px-6 py-4">
                        <h3 className="font-semibold mb-2">Orders</h3>

                        <table className="min-w-full text-sm border">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-3 py-2 text-left">Order ID</th>
                              <th className="px-3 py-2 text-left">Date</th>
                              <th className="px-3 py-2 text-left">Status</th>
                              <th className="px-3 py-2 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {c.orders.map((o) => (
                              <tr key={o.id} className="border-t">
                                <td className="px-3 py-2">ORD-{o.id}</td>
                                <td className="px-3 py-2">{o.date}</td>
                                <td className="px-3 py-2 capitalize">
                                  {o.status}
                                </td>
                                <td className="px-3 py-2 text-right font-medium">
                                  ₹ {o.total}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
