import { Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import ErrorPage from "./components/ErrorPage";
import ChangePassword from "./components/ChangePassword";
import UpdateProfile from "./components/UpdateProfile";
import Layout from "./components/Layout";
import Unauthorized from "./components/Unauthorized";
import Links from "./components/Links";
import Dashboard from "./components/Dashboard";
import RequireAuth from "./components/RequireAuth";
import TestForm from "./components/TestForm";
import TestLogin from "./components/TestLogin";
import EmailVerificationPage from "./components/EmailVerificationPage";
import ResetPassword from "./components/ResetPasswordPage";
import ForgotPassword from "./components/ForgetPasswordPage";
import Home from "components/Home";
import AdminDashboard from "components/admin/AdminDashboard";

const ROLES = {
  Admin: "Admin",
  Influencer: "Influencer",
  Brand: "Brand",
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="home" element={<Home />} />

        <Route path="verify-email" element={<EmailVerificationPage />} />
        <Route path="forget-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>

      {/* Protected Routes (Require Authentication) */}
      <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Influencer, ROLES.Brand]} />}>
        <Route path="changepassword" element={<ChangePassword />} />
        <Route path="updateprofile" element={<UpdateProfile />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
       
        <Route path="admin-dashboard" element={<AdminDashboard />} />
      </Route>

      {/* Unauthorized Route */}
      <Route path="unauthorized" element={<Unauthorized />} />

      {/* Test Routes (For Development Purposes) */}
      <Route path="testform" element={<TestForm />} />
      <Route path="testlogin" element={<TestLogin />} />

      {/* Links (this can be a user dashboard or profile page) */}
      <Route path="links" element={<Links />} />
    </Routes>
  );
};

export default App;
