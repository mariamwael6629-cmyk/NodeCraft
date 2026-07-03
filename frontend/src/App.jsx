import { useState } from "react";
import { AuthProvider } from "./AuthContext.jsx";
import GlobalStyle from "./GlobalStyle.jsx";
import GridBg from "./components/GridBg.jsx";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import WorkflowBuilder from "./pages/WorkflowBuilder.jsx";
import TemplatesPage from "./pages/TemplatesPage.jsx";
import MonitoringDashboard from "./pages/MonitoringDashboard.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import PricingPage from "./pages/PricingPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

const App = () => {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage setPage={setPage} />;
      case "builder":
        return <WorkflowBuilder />;
      case "templates":
        return <TemplatesPage setPage={setPage} />;
      case "monitoring":
        return <MonitoringDashboard />;
      case "team":
        return <TeamPage />;
      case "pricing":
        return <PricingPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <AuthProvider>
      <GlobalStyle />
      <GridBg />
      <Navbar page={page} setPage={setPage} />
      <div key={page} style={{ animation: "slide-in .3s ease" }}>
        {renderPage()}
      </div>
    </AuthProvider>
  );
};

export default App;
