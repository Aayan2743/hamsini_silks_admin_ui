// import { Navigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";

// export default function ProtectedRoute({ children }) {
//   const { isAuthenticated } = useAuth();

//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// }

// import { Navigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";

// export default function ProtectedRoute({ children }) {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// }


import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // 1️⃣ Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ Role-based protection
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect based on role
    if (role === "super_admin") {
      return <Navigate to="/super-admin" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  // 3️⃣ Allowed
  return children ? children : <Outlet />;
}
