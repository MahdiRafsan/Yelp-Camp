import "mapbox-gl/dist/mapbox-gl.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import CampgroundDetailsPage from "./pages/CampgroundDetailsPage";
import UserProfilePage from "./pages/UserProfilePage";

import ProtectedRoutes from "./components/ProtectedRoutes";
import Navbar from "./components/Navbar/Navbar";
import Auth from "./components/Auth/Auth";
import ProfileForm from "./components/UserProfile/ProfileForm";
import PasswordForm from "./components/UserProfile/PasswordForm";
import RootLayout from "./layouts/RootLayout";
import DeleteProfile from "./components/UserProfile/DeleteProfile";

function App() {
  return (
    <>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route element={<RootLayout />}>
          <Route path="/landing" element={<Navbar />} />
          <Route path="/" element={<ProtectedRoutes />}>
            <Route index element={<HomePage />} />
            <Route
              path="/campgrounds/:campgroundId"
              element={<CampgroundDetailsPage />}
            />
            <Route element={<UserProfilePage />}>
              <Route path="/profile" element={<ProfileForm />} />
              <Route path="/password" element={<PasswordForm />} />
              <Route path="delete" element={<DeleteProfile />} />
            </Route>
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
