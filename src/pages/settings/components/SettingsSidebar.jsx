import { NavLink } from "react-router-dom";
import SuperAdmin from "../../components/superadmindashboard/SuperAdmin";

const menu = [
  { label: "Profile", path: "/settings/profile" },
  { label: "Logo", path: "/settings/logo" },
  { label: "Social media", path: "/settings/social-media" },
  { label: "Payment gateway", path: "/settings/payment-gateway" },
  { label: "Variation Settings", path: "/settings/variation-settings" },
  { label: "Whats App Integration", path: "/settings/whatsapp-integration" },
  // { label: "account-settings", path: "/settings/account-settings" },
  { label: "coupons-settings", path: "/settings/coupons-settings" },
  // { label: "Settings", path: "" },
];
export default function SettingsSidebar() {
  return (
    <div className="w-60">
      <ul className="space-y-1 text-sm">
        {menu.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md cursor-pointer ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </ul>
    </div>
  );
}
