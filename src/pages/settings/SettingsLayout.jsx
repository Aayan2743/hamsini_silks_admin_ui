import SettingsSidebar from "./components/SettingsSidebar";

export default function SettingsLayout({ children }) {
  return (
    <div className="flex gap-8">
      <SettingsSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
