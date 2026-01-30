import { useState } from "react";
import SettingsLayout from "../SettingsLayout";

export default function WhatsAppIntegrationSettings() {
  const [editMode, setEditMode] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const handleSave = () => {
    console.log("360Messenger API Key:", apiKey);
    setEditMode(false);
  };

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
