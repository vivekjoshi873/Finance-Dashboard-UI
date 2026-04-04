import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useStore from "./store/useStore";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import BottomTabBar from "./components/BottomTabBar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";

export default function App() {
  const darkMode = useStore((s) => s.darkMode);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
        <div className="main-area">
          <TopBar />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/insights" element={<Insights />} />
            </Routes>
          </main>
        </div>
        <BottomTabBar />
      </div>
    </BrowserRouter>
  );
}
