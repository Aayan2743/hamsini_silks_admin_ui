import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAppSettings } from "../context/AppSettingsContext";

export default function Login() {
  const { settings } = useAppSettings();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginValue, setLoginValue] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(loginValue, password);

      console.log("Login success:", success);
      if (success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials");
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
        {/* Logo */}
        <div className="flex justify-center mb-6">
          {/* <img src="./logo/pos.png" alt="Logo" className="h-20 md:h-24" /> */}

          <div className="flex justify-center mb-6">
            <img
              src={settings.logo || "/logo/pos.png"}
              alt="App Logo"
              className="h-20 md:h-24 object-contain"
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-center mb-6">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email / Phone */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Email or Phone
            </label>
            <input
              type="text"
              placeholder="Enter email or phone"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              className="w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-sm text-cyan-500 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
