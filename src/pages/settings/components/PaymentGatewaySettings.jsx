import { useEffect, useRef, useState } from "react";
import SettingsLayout from "../SettingsLayout";
import api from "../../../api/axios";
import { CreditCard, Wallet, Eye, EyeOff } from "lucide-react";

export default function PaymentGatewaySettings() {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);

  /* 🔐 secrets (uncontrolled) */
  const razorpaySecret = useRef("");
  const cashfreeSecret = useRef("");
  const phonepeSecret = useRef("");

  const [showSecret, setShowSecret] = useState({
    razorpay: false,
    cashfree: false,
    phonepe: false,
  });

  const [gateways, setGateways] = useState({
    razorpay: { key: "", enabled: false },
    cashfree: { key: "", enabled: false },
    phonepe: { key: "", enabled: false },
    cod: { enabled: true },
  });

  /* ---------------- WARN BEFORE LEAVE ---------------- */
  useEffect(() => {
    const beforeUnload = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  /* ---------------- LOAD ---------------- */
  const fetchGateways = async () => {
    try {
      const res = await api.get("/dashboard/get-payment-gateways");
      const d = res.data.data;

      setGateways({
        razorpay: { key: d.razorpay_key || "", enabled: d.razorpay_enabled },
        cashfree: { key: d.cashfree_app_id || "", enabled: d.cashfree_enabled },
        phonepe: { key: d.phonepe_merchant_id || "", enabled: d.phonepe_enabled },
        cod: { enabled: d.cod_enabled },
      });

      razorpaySecret.current = "";
      cashfreeSecret.current = "";
      phonepeSecret.current = "";
      setDirty(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGateways();
  }, []);

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    await api.put("/dashboard/update-payment-gateways", {
      razorpay_key: gateways.razorpay.key,
      razorpay_secret: razorpaySecret.current || undefined,
      razorpay_enabled: gateways.razorpay.enabled,

      cashfree_app_id: gateways.cashfree.key,
      cashfree_secret: cashfreeSecret.current || undefined,
      cashfree_enabled: gateways.cashfree.enabled,

      phonepe_merchant_id: gateways.phonepe.key,
      phonepe_secret: phonepeSecret.current || undefined,
      phonepe_enabled: gateways.phonepe.enabled,

      cod_enabled: gateways.cod.enabled,
    });

    setEditMode(false);
    fetchGateways();
  };

  const cancelEdit = () => {
    if (dirty && !confirm("Discard unsaved changes?")) return;
    setEditMode(false);
    fetchGateways();
  };

  if (loading) {
    return (
      <SettingsLayout>
        <div className="p-6 text-sm text-gray-500">Loading…</div>
      </SettingsLayout>
    );
  }

  /* ---------------- CARD ---------------- */
  const GatewayCard = ({ title, gatewayKey, icon, secretRef }) => {
    const data = gateways[gatewayKey];

    return (
      <div className="border rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
            <h3 className="font-semibold">{title}</h3>
          </div>

          <span
            className={`px-3 py-1 text-xs rounded-full ${
              data.enabled
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {data.enabled ? "Enabled" : "Disabled"}
          </span>
        </div>

        {/* KEY */}
        <input
          value={data.key}
          disabled={!editMode}
          onChange={(e) => {
            setDirty(true);
            setGateways((p) => ({
              ...p,
              [gatewayKey]: { ...p[gatewayKey], key: e.target.value },
            }));
          }}
          placeholder={`${title} Key`}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        {/* SECRET */}
        {editMode && (
          <div className="relative">
            <input
              type={showSecret[gatewayKey] ? "text" : "password"}
              placeholder={`${title} Secret`}
              onChange={(e) => {
                secretRef.current = e.target.value;
                setDirty(true);
              }}
              autoComplete="new-password"
              className="w-full border rounded-lg px-3 py-2 text-sm pr-10"
            />

            <button
              type="button"
              onClick={() =>
                setShowSecret((s) => ({
                  ...s,
                  [gatewayKey]: !s[gatewayKey],
                }))
              }
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showSecret[gatewayKey] ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        )}

        {!editMode && (
          <p className="text-xs text-gray-500">
            Secret: ••••{secretRef.current ? secretRef.current.slice(-4) : "****"}
          </p>
        )}

        <button
          disabled={!editMode}
          onClick={() => {
            setDirty(true);
            setGateways((p) => ({
              ...p,
              [gatewayKey]: { ...p[gatewayKey], enabled: !p[gatewayKey].enabled },
            }));
          }}
          className={`px-4 py-2 rounded-lg text-sm ${
            data.enabled
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {data.enabled ? "Disable" : "Enable"}
        </button>
      </div>
    );
  };

  return (
    <SettingsLayout>
      <div className="bg-white rounded-xl border p-6 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">Payment Gateway</h2>

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 border rounded-lg text-sm"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <GatewayCard
          title="Razorpay"
          gatewayKey="razorpay"
          icon={<CreditCard size={18} />}
          secretRef={razorpaySecret}
        />

        <GatewayCard
          title="Cashfree"
          gatewayKey="cashfree"
          icon={<Wallet size={18} />}
          secretRef={cashfreeSecret}
        />

        <GatewayCard
          title="PhonePe"
          gatewayKey="phonepe"
          icon={<Wallet size={18} />}
          secretRef={phonepeSecret}
        />
      </div>
    </SettingsLayout>
  );
}
