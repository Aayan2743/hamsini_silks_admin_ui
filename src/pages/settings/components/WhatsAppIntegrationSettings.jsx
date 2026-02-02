// import { useState } from "react";
// import SettingsLayout from "../SettingsLayout";

// export default function WhatsAppIntegrationSettings() {
//   const [editMode, setEditMode] = useState(false);
//   const [apiKey, setApiKey] = useState("");

//   const handleSave = () => {
//     console.log("360Messenger API Key:", apiKey);
//     setEditMode(false);
//   };

//   return (
//     <SettingsLayout>
//       <div className="bg-white rounded-xl border p-6 space-y-6">
//         {/* HEADER */}
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-semibold">WhatsApp Integration</h2>

//           {!editMode ? (
//             <button
//               onClick={() => setEditMode(true)}
//               className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-50"
//             >
//               Edit
//             </button>
//           ) : (
//             <div className="flex gap-2">
//               <button
//                 onClick={handleSave}
//                 className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => setEditMode(false)}
//                 className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>

//         {/* API KEY */}
//         <div className="space-y-2">
//           <p className="text-sm font-medium">360Messenger API Key</p>

//           {editMode ? (
//             <input
//               type="password"
//               value={apiKey}
//               onChange={(e) => setApiKey(e.target.value)}
//               placeholder="Enter 360Messenger API Key"
//               className="w-full md:w-1/2 border rounded-lg px-3 py-2 text-sm"
//             />
//           ) : (
//             <p className="text-sm text-gray-600">
//               {apiKey ? "••••••••••••••" : "Not configured"}
//             </p>
//           )}

//           <p className="text-xs text-gray-500">
//             Used for sending WhatsApp messages via 360Messenger
//           </p>
//         </div>
//       </div>
//     </SettingsLayout>
//   );
// }

import { useEffect, useState } from "react";
import SettingsLayout from "../SettingsLayout";
import api from "../../../api/axios";
import toast from "react-hot-toast";

export default function WhatsAppIntegrationSettings() {
  const [editMode, setEditMode] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------------- GET ---------------- */
  const fetchWhatsAppSettings = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/admin-dashboard/whatsapp-settings"
      );

      if (res.data?.success === false) {
        toast.error(res.data?.message || "Failed to load WhatsApp settings");
        return;
      }

      setApiKey(res.data?.data?.api_key || "");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load WhatsApp settings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhatsAppSettings();
  }, []);

  /* ---------------- SAVE (POST) ---------------- */
  const handleSave = async () => {
    try {
      const res = await api.post(
        "/admin-dashboard/whatsapp-settings",
        {
          api_key: apiKey,
        }
      );

      if (res.data?.success === false) {
        toast.error(res.data?.message || "Update failed");
        return;
      }

      toast.success(
        res.data?.message || "WhatsApp settings updated"
      );

      setEditMode(false);
      fetchWhatsAppSettings();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Update failed"
      );
    }
  };

  if (loading) {
    return (
      <SettingsLayout>
        <div className="p-6 text-sm text-gray-500">Loading...</div>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout>
      <div className="bg-white rounded-xl border p-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">WhatsApp Integration</h2>

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* API KEY */}
        <div className="space-y-2">
          <p className="text-sm font-medium">360Messenger API Key</p>

          {editMode ? (
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter 360Messenger API Key"
              className="w-full md:w-1/2 border rounded-lg px-3 py-2 text-sm"
            />
          ) : (
            <p className="text-sm text-gray-600">
              {apiKey ? "••••••••••••••" : "Not configured"}
            </p>
          )}

          <p className="text-xs text-gray-500">
            Used for sending WhatsApp messages via 360Messenger
          </p>
        </div>
      </div>
    </SettingsLayout>
  );
}

