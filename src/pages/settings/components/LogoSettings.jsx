import { useEffect, useState } from "react";
import SettingsLayout from "../SettingsLayout";
import api from "../../../api/axios"; // your axios instance
import useDynamicTitle from "../../../hooks/useDynamicTitle";
const DEFAULT_LOGO = null;
const DEFAULT_FAVICON = null;

export default function LogoSettings() {
  useDynamicTitle("Logo Settings");
  const [editMode, setEditMode] = useState(false);

  const [appName, setAppName] = useState("");
  const [logo, setLogo] = useState(DEFAULT_LOGO);
  const [favicon, setFavicon] = useState(DEFAULT_FAVICON);

  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);

  /* ---------------- GET SETTINGS ---------------- */
  const fetchSettings = async () => {
    try {
      const res = await api.get("/dashboard/logo-settings");

      const data = res.data.data;

      setAppName(data.app_name || "");
      setLogo(data.logo || DEFAULT_LOGO);
      setFavicon(data.favicon || DEFAULT_FAVICON);
    } catch (err) {
      console.error("Failed to load app settings", err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  /* ---------------- IMAGE HANDLER ---------------- */
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    if (type === "logo") {
      setLogo(preview);
      setLogoFile(file);
    } else {
      setFavicon(preview);
      setFaviconFile(file);
    }
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("app_name", appName);

      if (logoFile) {
        formData.append("app_logo", logoFile);
      }

      if (faviconFile) {
        formData.append("app_favicon", faviconFile);
      }

      await api.put("/dashboard/update-logo-settings", formData);

      setEditMode(false);
      setLogoFile(null);
      setFaviconFile(null);

      fetchSettings(); // refresh with server URLs
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <SettingsLayout>
      <div className="bg-white rounded-xl border p-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Logo</h2>

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

        {/* APPLICATION NAME */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Application Name</p>

          {editMode ? (
            <input
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full md:w-1/2 border rounded-lg px-3 py-2 text-sm"
            />
          ) : (
            <p className="text-gray-600 text-sm">{appName}</p>
          )}
        </div>

        <hr />

        {/* LOGO */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full border bg-gray-50 overflow-hidden flex items-center justify-center">
            {logo ? (
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-gray-400 text-sm">No Logo</span>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Company Logo</p>
            <p className="text-xs text-gray-500">512 × 512 px</p>

            {editMode && (
              <label className="px-4 py-1.5 text-sm border rounded-lg cursor-pointer hover:bg-gray-50">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleImageChange(e, "logo")}
                />
              </label>
            )}
          </div>
        </div>

        <hr />

        {/* FAVICON */}
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded border bg-gray-50 overflow-hidden flex items-center justify-center">
            {favicon ? (
              <img
                src={favicon}
                alt="Favicon"
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-gray-400 text-xs">ICO</span>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Favicon</p>
            <p className="text-xs text-gray-500">32 × 32 px</p>

            {editMode && (
              <label className="px-4 py-1.5 text-sm border rounded-lg cursor-pointer hover:bg-gray-50">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleImageChange(e, "favicon")}
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
