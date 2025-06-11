import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Products from "./scenes/products";
import Bar from "./scenes/bar";
import UserProfile from "./scenes/userProfile";
import FAQ from "./scenes/faq";
import Calendar from "./scenes/calendar/calendar";
import CredentialsSignInPage from "./scenes/Authentication/CredentialsSignInPage";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⏳ Track loading
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false); // ✅ Done loading everything
  }, []);

  // ⛔ Show nothing while loading
  if (loading) return null;

  const isLoginPage = location.pathname === "/login";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {/* ✅ Only show Sidebar/Topbar if logged in and not on login page */}
          {token && !isLoginPage && <Sidebar isSidebar={isSidebar} user={user} />}
          <main className="content">
            {token && !isLoginPage && <Topbar setIsSidebar={setIsSidebar} user={user} />}

            <Routes>
              <Route
                path="/login"
                element={
                  <CredentialsSignInPage
                    setToken={(newToken) => {
                      localStorage.setItem("token", newToken);
                      setToken(newToken);
                    }}
                    setUser={(userData) => {
                      localStorage.setItem("user", JSON.stringify(userData));
                      setUser(userData);
                      navigate("/"); // ✅ Navigate after setting both
                    }}
                  />
                }
              />
              {token ? (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/UserProfile" element={<UserProfile />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/calendar" element={<Calendar />} />
              
                </>
              ) : (
                <Route path="*" element={<Navigate to="/login" />} />
              )}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
