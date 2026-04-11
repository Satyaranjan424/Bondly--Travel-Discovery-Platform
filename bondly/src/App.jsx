import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { EditTripPage } from "./pages/EditTripPage.jsx";
import { ExplorePage } from "./pages/ExplorePage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { PublishTripPage } from "./pages/PublishTripPage.jsx";
import { TripDetailsPage } from "./pages/TripDetailsPage.jsx";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="trips/:tripId" element={<TripDetailsPage />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="publish" element={<ProtectedRoute><PublishTripPage /></ProtectedRoute>} />
        <Route path="trips/:tripId/edit" element={<ProtectedRoute><EditTripPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
