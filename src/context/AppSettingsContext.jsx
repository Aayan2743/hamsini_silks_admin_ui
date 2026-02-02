import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AppSettingsContext = createContext();

export const AppSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    logo: "",
    app_name: "",
    favicon: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await api.get("/auth/app-logo-settings");

        if (res.data?.status) {
          setSettings({
            logo: res.data.data.logo,
            app_name: res.data.data.app_name,
            favicon: res.data.data.favicon,
          });

          // 🔥 update favicon dynamically
          if (res.data.data.favicon) {
            let link =
              document.querySelector("link[rel~='icon']") ||
              document.createElement("link");

            link.rel = "icon";
            link.href = res.data.data.favicon;
            document.head.appendChild(link);
          }
        }
      } catch (err) {
        console.error("Failed to load app settings", err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  return (
    <AppSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => useContext(AppSettingsContext);
