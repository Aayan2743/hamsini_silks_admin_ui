import { Users } from "lucide-react";
import { useEffect } from "react";
import useDynamicTitle from "../hooks/useDynamicTitle";


export default function Dashboard() {
  

  useDynamicTitle("Dashboard");
  return (
    <div className="space-y-6">
      {/* ===== TOP STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Customer" value="125" />
        <StatCard title="Total Products" value="484">
          <div className="text-sm mt-2 text-gray-500">
            <p>
              Inhouse Products: <b>4</b>
            </p>
            <p>
              Sellers Products: <b>480</b>
            </p>
          </div>
        </StatCard>

        <SalesCard />

        <StatCard title="Total Sellers" value="27">
          <div className="text-sm mt-2">
            <p className="text-red-500">Pending Seller: 2</p>
            <p className="text-green-600">Approved Sellers: 23</p>
          </div>
        </StatCard>
      </div>

      {/* ===== CATEGORY & BRAND ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <InfoCard title="Total Category" value="16">
          <ListItem label="Skincare" amount="₹29,462.79" />
          <ListItem label="Food" amount="₹20,919.92" />
          <ListItem label="Not Found" amount="₹11,300.00" />
        </InfoCard>

        <InfoCard title="Total Brands" value="26">
          <ListItem label="Not Found" amount="₹12,873.92" />
          <ListItem label="Not Found" amount="₹11,622.30" />
          <ListItem label="Not Found" amount="₹11,300.00" />
        </InfoCard>

        <OrdersSummary />
      </div>

      {/* ===== EMPTY ANALYTICS SECTIONS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EmptyCard title="In-house Top Category" />
        <EmptyCard title="In-house Top Brands" />
      </div>
    </div>
  );
}

/* ===================== COMPONENTS ===================== */

function StatCard({ title, value, children }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-3xl font-bold mt-1">{value}</p>
      {children}
    </div>
  );
}

function SalesCard() {
  return (
    <div className="bg-sky-50 rounded-xl p-5 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-sm text-gray-500">Total Sales</h3>
        <p className="text-3xl font-bold text-blue-600 mt-1">64K</p>
      </div>

      <button className="mt-4 bg-blue-500 text-white rounded-lg py-2 text-sm">
        Sales this month ₹18,369.00
      </button>

      <div className="text-sm mt-4">
        <p className="text-gray-500">In-house Sales: ₹0.00</p>
        <p className="text-green-600">Sellers Sales: ₹18,369.00</p>
      </div>
    </div>
  );
}

function InfoCard({ title, value, children }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <div className="mt-4 space-y-2">{children}</div>
    </div>
  );
}

function ListItem({ label, amount }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{amount}</span>
    </div>
  );
}

function OrdersSummary() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
      <h3 className="text-sm text-gray-500">Total Order</h3>
      <p className="text-3xl font-bold text-purple-600">303</p>

      <OrderItem label="Order placed" value="295" color="blue" />
      <OrderItem label="Confirmed Order" value="1" color="green" />
      <OrderItem label="Processed Order" value="0" color="red" />
      <OrderItem label="Order Shipped" value="0" color="yellow" />

      <button className="w-full bg-purple-500 text-white py-2 rounded-lg text-sm">
        All Orders
      </button>
    </div>
  );
}

function OrderItem({ label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    yellow: "bg-yellow-50 text-yellow-600",
  };

  return (
    <div
      className={`flex justify-between p-3 rounded-lg text-sm ${colors[color]}`}
    >
      <span>{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function EmptyCard({ title }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm min-h-[220px]">
      <h3 className="text-sm font-medium text-blue-600">{title}</h3>
      <p className="text-xs text-gray-400 mt-1">By Sales</p>

      <div className="flex gap-2 mt-3">
        <Badge active>All</Badge>
        <Badge>Today</Badge>
        <Badge>Week</Badge>
        <Badge>Month</Badge>
      </div>
    </div>
  );
}

function Badge({ children, active }) {
  return (
    <span
      className={`px-3 py-1 text-xs rounded-md cursor-pointer ${
        active ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
      }`}
    >
      {children}
    </span>
  );
}
