import React from "react";
import {
  Users,
  Shield,
  Settings,
  BarChart3,
  LogOut,
} from "lucide-react";

const StatCard = ({ icon: Icon, title, value }) => (
  <div className="bg-white rounded-xl shadow-sm border p-5 flex items-center gap-4">
    <div className="p-3 bg-cyan-100 text-cyan-600 rounded-lg">
      <Icon size={22} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  </div>
);

const ActionCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition cursor-pointer">
    <div className="p-3 bg-gray-100 rounded-lg w-fit mb-4">
      <Icon size={22} />
    </div>
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-gray-500 mt-1">{description}</p>
  </div>
);

const SuperAdmin = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Super Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Full system access & controls
          </p>
        </div>

        <span className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-sm font-medium">
          <Shield size={16} />
          Super Admin
        </span>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={Users} title="Total Admins" value="12" />
        <StatCard icon={BarChart3} title="System Logs" value="1,284" />
        <StatCard icon={Settings} title="Configurations" value="38" />
        <StatCard icon={Shield} title="Security Alerts" value="2" />
      </div>

      {/* QUICK ACTIONS */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard
          icon={Users}
          title="Manage Admins"
          description="Create, edit or deactivate admin users"
        />

        <ActionCard
          icon={Settings}
          title="System Settings"
          description="Global application configuration"
        />

        <ActionCard
          icon={BarChart3}
          title="View Reports"
          description="Audit logs, system usage & analytics"
        />
      </div>

      {/* FOOTER ACTION */}
      {/* <div className="mt-12 flex justify-end">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div> */}
    </div>
  );
};

export default SuperAdmin;
