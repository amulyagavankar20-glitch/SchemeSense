import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./pages/auth/Login";
import { Signup } from "./pages/auth/Signup";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { EmailVerification } from "./pages/auth/EmailVerification";
import { TwoFactorAuth } from "./pages/auth/TwoFactorAuth";
import { AccountRecovery } from "./pages/auth/AccountRecovery";
import { Home } from "./pages/Home";
import { Search } from "./pages/Search";
import { SchemeDetails } from "./pages/SchemeDetails";
import { SchemeComparison } from "./pages/SchemeComparison";
import { SavedSchemes } from "./pages/SavedSchemes";
import { Documents } from "./pages/Documents";
import { DocumentVerification } from "./pages/DocumentVerification";
import { ApplicationForm } from "./pages/ApplicationForm";
import { Applications } from "./pages/Applications";
import { ApplicationDetails } from "./pages/ApplicationDetails";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { Help } from "./pages/Help";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/auth/login",
    Component: Login,
  },
  {
    path: "/auth/signup",
    Component: Signup,
  },
  {
    path: "/auth/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/auth/verify-email",
    Component: EmailVerification,
  },
  {
    path: "/auth/2fa",
    Component: TwoFactorAuth,
  },
  {
    path: "/auth/recovery",
    Component: AccountRecovery,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "search", Component: Search },
      { path: "scheme/:id", Component: SchemeDetails },
      { path: "compare", Component: SchemeComparison },
      { path: "saved", Component: SavedSchemes },
      { path: "documents", Component: Documents },
      { path: "documents/verify", Component: DocumentVerification },
      { path: "apply/:schemeId", Component: ApplicationForm },
      { path: "applications", Component: Applications },
      { path: "applications/:id", Component: ApplicationDetails },
      { path: "profile", Component: Profile },
      { path: "settings", Component: Settings },
      { path: "help", Component: Help },
      { path: "*", Component: NotFound },
    ],
  },
]);
