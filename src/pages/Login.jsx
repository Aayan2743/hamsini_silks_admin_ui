// import { useState, useEffect } from "react";
// import { useAuth } from "../auth/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { Eye, EyeOff } from "lucide-react";
// import { useAppSettings } from "../context/AppSettingsContext";
// import { useLogoSettings } from "../context/LogoSettingsContext";
// import defaultimage from "../assets/profile.jpg";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL_Image_URl;
// const FALLBACK_LOGO = defaultimage;

// export default function Login() {
//   const { settings } = useAppSettings();
//   const { settings: logoSettings } = useLogoSettings();

//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [logo, setLogo] = useState(FALLBACK_LOGO);
//   const [loginValue, setLoginValue] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ===============================
//       APPLY LOGO FROM CONTEXT
//      (NO API CALL HERE)
//   =============================== */
//   useEffect(() => {
//     if (!logoSettings) return;

//     setLogo(logoSettings.app_logo_url || FALLBACK_LOGO);
//   }, [logoSettings]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const success = await login(loginValue, password);
//       if (success) {
//         navigate("/dashboard");
//       }
//     } catch (err) {
//       setError(err?.response?.data?.message || "Invalid credentials");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center flex items-center justify-end"
//       style={{ backgroundImage: "url('./logo/loginbanner.jpg')" }}
//     >
//       <div className="absolute inset-0 bg-black/40"></div>

//       <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-8 mr-0 md:mr-10">
//         {/* Logo */}
//         <div className="flex justify-center mb-6">
//           <img
//             src={logo}
//             alt="App Logo"
//             className="h-20 md:h-24 object-contain"
//           />
//         </div>

//         <h2 className="text-xl font-semibold text-center mb-6">Login</h2>

//         {error && (
//           <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="text-sm font-medium text-gray-600">
//               Email or Phone
//             </label>
//             <input
//               type="text"
//               placeholder="Enter email or phone"
//               value={loginValue}
//               onChange={(e) => setLoginValue(e.target.value)}
//               className="w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-600">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-4 top-4 text-gray-400"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           <div className="text-right">
//             <a
//               href="/forgot-password"
//               className="text-sm text-cyan-500 hover:underline"
//             >
//               Forgot Password?
//             </a>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
//           >
//             {loading ? "Signing In..." : "Sign In"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useLogoSettings } from "../context/LogoSettingsContext";
import defaultimage from "../assets/profile.jpg";

const FALLBACK_LOGO = defaultimage;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { settings: logoSettings } = useLogoSettings();

  const [logo, setLogo] = useState(FALLBACK_LOGO);
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (logoSettings?.app_logo_url) {
      setLogo(logoSettings.app_logo_url);
    }
  }, [logoSettings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(loginValue, password);

      if (!user) {
        setError("Invalid credentials");
        return;
      }
      console.log("test",user)
      /* 🔥 ROLE BASED REDIRECT */
      if (user.role==="superadmin") {
        navigate("/super-admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-end"
      style={{ backgroundImage: "url('./logo/loginbanner.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-8 mr-0 md:mr-10">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-20 object-contain" />
        </div>

        <h2 className="text-xl font-semibold text-center mb-6">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Email or Phone"
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 text-white py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
