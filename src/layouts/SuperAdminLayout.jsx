import { Outlet } from "react-router-dom";

export default function SuperAdminLayout() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="h-16 flex items-center px-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">Super Admin Panel</h1>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
