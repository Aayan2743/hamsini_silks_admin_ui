// import { createContext, useContext, useEffect, useState } from "react";
// import api from "../api/axios";

// const AppSettingsContext = createContext();

// export const AppSettingsProvider = ({ children }) => {
//   const [settings, setSettings] = useState({
//     logo: "",
//     app_name: "",
//     favicon: "",
//   });

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadSettings = async () => {
//       try {
//         const res = await api.get("/auth/app-logo-settings");
//         console.log("response", res.data.data);
//         if (res.data?.status) {
//           setSettings({
//             logo: res.data.data.logo,
//             app_name: res.data.data.app_name,
//             favicon: res.data.data.favicon,
//           });

//           // 🔥 update favicon dynamically
//           if (res.data.data.favicon) {
//             let link =
//               document.querySelector("link[rel~='icon']") ||
//               document.createElement("link");

//             link.rel = "icon";
//             link.href = res.data.data.favicon;
//             document.head.appendChild(link);
//           }
//         }
//       } catch (err) {
//         console.error("Failed to load app settings", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadSettings();
//   }, []);

//   return (
//     <AppSettingsContext.Provider value={{ settings, loading }}>
//       {children}
//     </AppSettingsContext.Provider>
//   );
// };

// export const useAppSettings = () => useContext(AppSettingsContext);

import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AppSettingsContext = createContext();

const BASE_URL = import.meta.env.VITE_API_BASE_URL_Image_URl;

export const AppSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    logo: "",
    app_name: "",
    favicon: "",
  });

  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const loadSettings = async () => {
  //     try {
  //       const res = await api.get("/auth/app-logo-settings");

  //       if (res.data?.status && res.data?.data) {
  //         const data = res.data.data;

  //         const fullLogo = data.app_logo ? `${BASE_URL}/${data.app_logo}` : "";

  //         const fullFavicon = data.app_favicon
  //           ? `${BASE_URL}/${data.app_favicon}`
  //           : "";

  //         setSettings({
  //           logo: fullLogo,
  //           app_name: data.app_name || "",
  //           favicon: fullFavicon,
  //         });

  //         if (fullFavicon) {
  //           let link =
  //             document.querySelector("link[rel~='icon']") ||
  //             document.createElement("link");

  //           link.rel = "icon";
  //           link.href = fullFavicon;
  //           document.head.appendChild(link);
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Failed to load app settings", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadSettings();
  // }, []);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await api.get("/auth/app-logo-settings");

        console.log("API RESPONSE:", res.data.data);

        if (res.data?.success && res.data?.data) {
          const data = res.data.data; // ✅ FIXED

          const fullLogo = res.data?.data?.app_logo_url;

          const fullFavicon = res.data?.data?.app_favicon_url;

          setSettings({
            logo: fullLogo,
            app_name: data.app_name || "",
            favicon: fullFavicon,
          });
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
