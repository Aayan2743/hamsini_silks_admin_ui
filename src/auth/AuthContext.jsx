// import api from "../api/axios";
// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user")) || null,
//   );

//   const isAuthenticated = !!localStorage.getItem("token"); // 🔥 KEY LINE

//   const login = async (loginValue, password) => {
//     try {
//       const res = await api.post("/auth/admin-login", {
//         username: loginValue, // email or phone
//         password,
//       });
//           console.log("TEST",res)
//       if (res.data.success) {
//         localStorage.setItem("token", res.data.token);
//         localStorage.setItem("user", JSON.stringify(res.data.user));
//         setUser(res.data.user);
//         return true;
//       }

//       return false;
//     } catch (err) {
//       throw err;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
import api from "../api/axios";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const isAuthenticated = !!localStorage.getItem("token");

  /* ===============================
        LOGIN (SUPER ADMIN → ADMIN)
  =============================== */
  const login = async (loginValue, password) => {
    try {
      /* 🔥 TRY SUPER ADMIN LOGIN FIRST */
      try {
        const superRes = await api.post("/auth/super-admin-login", {
          username: loginValue,
          password,
        });

        if (superRes.data?.success) {
          const { token, user } = superRes.data;

          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("role", "super_admin");

          setUser({ ...user, role: "super_admin" });
          return { ...user, role: "super_admin" };
        }
      } catch (err) {
        // ❌ ignore & try admin login
      }

      /* 🔁 FALLBACK TO ADMIN LOGIN */
      const adminRes = await api.post("/auth/admin-login", {
        username: loginValue,
        password,
      });

      if (adminRes.data?.success) {
        const { token, user } = adminRes.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user.role || "admin");

        setUser(user);
        return user;
      }

      return null;
    } catch (err) {
      throw err;
    }
  };

  /* ===============================
        LOGOUT
  =============================== */
  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
