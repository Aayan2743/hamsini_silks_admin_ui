import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* AUTH */
import ProtectedRoute from "./auth/ProtectedRoute";
import PublicRoute from "./auth/PublicRoute";
import { Toaster } from "react-hot-toast";

/* LAYOUT */
import DashboardLayout from "./layouts/DashboardLayout";

/* PAGES */
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Employees from "./pages/Employees";
import AddClient from "./pages/AddClient";
import ViewClient from "./pages/ViewClient";
import EditClient from "./pages/EditClient";
import Confirmation from "./pages/Confirmation";
import ConfirmationList from "./pages/ConfirmationList";
import JobConfirmation from "./pages/JobConfirmation";
import ConfirmationPrint from "./pages/ConfirmationPrint";
import InvoiceCashMemoList from "./pages/InvoiceCashMemoList";
import InvoicePrint from "./pages/InvoicePrint";
import InvoiceWithLogoPrint from "./pages/InvoiceWithLogoPrint";
import ExtraCharges from "./pages/ExtraCharges";
import CashMemoPrint from "./pages/CashMemoPrint";
import RateCard from "./pages/RateCard";
import POS from "./pos/POS";

import ComingSoon from "./pages/ComingSoon";

/* MASTER DATA */
import Category from "./pages/Category";
import Brands from "./pages/brands/Brands";

/* JOB CARDS */
import JewelleryJobCard from "./pages/JewelleryJobCard";
import GemStoneJobCard from "./pages/GemStoneJobCard";
import DimondJobCard from "./pages/DimondJobCard";
import Orders from "./pages/orders/Orders";

import SettingsPage from "./pages/settings/SettingsPage";
import SocialMediaSettings from "./pages/settings/components/SocialMediaSettings";
import PaymentGatewaySettings from "./pages/settings/components/PaymentGatewaySettings";
import ProfileSettings from "./pages/settings/components/ProfileSettings";
// import LogoSettings from "./pages/settings/components/LogoSettings";
import VariationSettings from "./pages/settings/components/VariationSettings";
import WhatsAppIntegrationSettings from "./pages/settings/components/WhatsAppIntegrationSettings";
import AccountSettings from "./pages/settings/components/AccountSettings";
import PrintReceipt from "./pages/PrintReceipt";
import POSOrders from "./pages/POSOrders";
import POSOrderView from "./pages/POSOrderView";
import CouponSettings from "./pages/settings/components/CouponSettings";
import UserDashboard from "./pages/UserDashboard";
import OrdersPage from "./pages/OrdersPage";
import OrderDetail from "./pages/OrderDetail";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import { LogoSettingsProvider } from "./context/LogoSettingsContext";
import { ProfileProvider } from "./context/ProfileContext";
import LogoSettings from "./pages/settings/components/LogoSettings";
import { useProfile } from "./context/ProfileContext";


// import SettingsPage from "./pages/settings/SettingsPage";

export default function App() {
  // const { showBrandName } = useProfile();
  return (
    <BrowserRouter>
    <LogoSettingsProvider>
      <ProfileProvider>
         <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* ---------------- PUBLIC ---------------- */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/verify-otp"
          element={
            <PublicRoute>
              <VerifyOtp />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* ---------------- PROTECTED ---------------- */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* DEFAULT AFTER LOGIN */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* DASHBOARD */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<ComingSoon />} />
          <Route path="/reports" element={<ComingSoon />} />
          <Route path="/users" element={<UserDashboard />} />
          <Route path="/print/receipt/:id" element={<PrintReceipt />} />
          <Route path="/print/receipt/:id" element={<PrintReceipt />} />

          {/* PRODUCTS & MASTER */}
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/brands" element={<Brands />} />
           {/* {showBrandName && (
     <Route path="/brands" element={<Brands />} />
)} */}
          <Route path="/employees" element={<Employees />} />
          <Route path="/" element={<Navigate to="/settings/social-media" />} />

          {/* SETTINGS */}
          <Route path="/settings" element={<SettingsPage />}>
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="logo" element={<LogoSettings />} />
            <Route path="social-media" element={<SocialMediaSettings />} />
            <Route
              path="payment-gateway"
              element={<PaymentGatewaySettings />}
            />
            <Route path="variation-settings" element={<VariationSettings />} />

            {/* <Route path="account-settings" element={<AccountSettings />} /> */}
            <Route
              path="whatsapp-integration"
              element={<WhatsAppIntegrationSettings />}
            />

            <Route path="coupons-settings" element={<CouponSettings />} />
          </Route>

          {/* MASTER ATTRIBUTES */}

          {/* CONFIRMATION */}
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/confirmation-list" element={<ConfirmationList />} />
          <Route path="/edit-confirmation/:id" element={<JobConfirmation />} />
          <Route
            path="/confirmation-print/:id"
            element={<ConfirmationPrint />}
          />

          {/* INVOICE */}
          <Route
            path="/invoice-cash-memo-list"
            element={<InvoiceCashMemoList />}
          />
          <Route path="/invoice/:id" element={<InvoicePrint />} />
          <Route path="/invoice-logo/:id" element={<InvoiceWithLogoPrint />} />
          <Route path="/extra-charge/:id" element={<ExtraCharges />} />
          <Route path="/cash-memo/:id" element={<CashMemoPrint />} />

          {/* JOB CARDS */}
          <Route path="/jewellery-job-card" element={<JewelleryJobCard />} />
          <Route path="/gem-stone-job-card" element={<GemStoneJobCard />} />
          <Route path="/diamond-job-card" element={<DimondJobCard />} />

          {/* RATE CARD */}
          <Route path="/rate-card" element={<RateCard />} />
          <Route path="/orders" element={<POSOrders />} />
          <Route path="/pos/orders/:id" element={<POSOrderView />} />

          {/* Online Order */}
          <Route path="/online-orders" element={<OrdersPage />} />

          <Route path="/orders/:id" element={<OrderDetail />} />

          <Route
            path="/pos"
            element={
              <ProtectedRoute>
                <POS />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ---------------- FALLBACK ---------------- */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      </ProfileProvider>
      </LogoSettingsProvider>
    </BrowserRouter>
  );
}
