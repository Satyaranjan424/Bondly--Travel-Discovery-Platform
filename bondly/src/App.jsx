import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { EditTripPage } from "./pages/EditTripPage.jsx";
import { ExplorePage } from "./pages/ExplorePage.jsx";
import { HomeSocialPage } from "./pages/HomeSocialPage.jsx";
import { MessagesPage } from "./pages/MessagesPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { PublishTripPage } from "./pages/PublishTripPage.jsx";
import { SavedPage } from "./pages/SavedPage.jsx";
import { MemoriesPage } from "./pages/MemoriesPage.jsx";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage.jsx";
import { SettingsPage } from "./pages/SettingsPage.jsx";
import { TripDetailsPage } from "./pages/TripDetailsPage.jsx";
import { UserProfilePage } from "./pages/UserProfilePage.jsx";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomeSocialPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="trips/:tripId" element={<TripDetailsPage />} />
        <Route path="users/:userId" element={<UserProfilePage />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="publish" element={<ProtectedRoute><PublishTripPage /></ProtectedRoute>} />
        <Route path="saved" element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />
        <Route path="messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
        <Route path="memories" element={<ProtectedRoute><MemoriesPage /></ProtectedRoute>} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="trips/:tripId/edit" element={<ProtectedRoute><EditTripPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
