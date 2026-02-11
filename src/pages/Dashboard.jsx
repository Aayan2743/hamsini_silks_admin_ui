import { Users, Package, ShoppingCart, TrendingUp, Filter } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { useState, useEffect } from "react";
import useDynamicTitle from "../hooks/useDynamicTitle";
import api from "../api/axios";

export default function Dashboard() {
  useDynamicTitle("Dashboard");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [orderData, setOrderData] = useState([]);

  /* ================= FETCH API ================= */
  const fetchDashboard = async (start = "", end = "") => {
    try {
      const res = await api.get("/admin-dashboard/stats", {
        params: {
          start_date: start,
          end_date: end,
        },
      });

      if (res.data?.status) {
        const data = res.data.data;

        // Top Stats
        setStats({
          customers: data.customers,
          products: data.products,
          orders: data.orders,
          revenue: parseFloat(data.revenue),
        });

        // Revenue Chart (convert revenue to number)
        const formattedRevenue = data.revenue_chart.map((item) => ({
          month: item.month,
          revenue: parseFloat(item.revenue),
        }));

        setRevenueData(formattedRevenue);

        // Orders Chart
        setOrderData(data.orders_chart);
      }
    } catch (error) {
      console.error("Dashboard fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* ========= FILTER SECTION ========= */}
      <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-end gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div>
            <label className="text-sm text-gray-500">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full mt-1 border rounded-lg p-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full mt-1 border rounded-lg p-2 text-sm"
            />
          </div>
        </div>

        <button
          onClick={() => fetchDashboard(startDate, endDate)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Filter size={16} />
          Apply Filter
        </button>
      </div>

      {/* ========= TOP STATS ========= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Customers"
          value={stats.customers}
          icon={<Users size={20} />}
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Products"
          value={stats.products}
          icon={<Package size={20} />}
          gradient="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Orders"
          value={stats.orders}
          icon={<ShoppingCart size={20} />}
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          title="Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
          icon={<TrendingUp size={20} />}
          gradient="from-orange-500 to-red-500"
        />
      </div>

      {/* ========= CHARTS ========= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <XAxis dataKey="month" />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Orders Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderData}>
              <XAxis dataKey="day" />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="orders" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ========= STAT CARD ========= */

function StatCard({ title, value, icon, gradient }) {
  return (
    <div
      className={`rounded-2xl p-6 text-white shadow-lg bg-gradient-to-r ${gradient}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm opacity-80">{title}</h3>
        <div className="bg-white/20 p-2 rounded-lg">{icon}</div>
      </div>
      <p className="text-3xl font-bold mt-4">{value}</p>
    </div>
  );
}
