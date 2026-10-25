import { useState } from "react";
import { C } from "../theme.js";
import { useAuth } from "../AuthContext.jsx";
import AuthModal from "./AuthModal.jsx";

const Navbar = ({ page, setPage }) => {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "builder", label: "Builder" },
    { id: "templates", label: "Templates" },
    { id: "monitoring", label: "Monitor" },
    { id: "team", label: "Team" },
    { id: "pricing", label: "Pricing" },
    { id: "settings", label: "Settings" },
  ];

  const goToBuilder = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setPage("builder");
  };

  return (
    <>
      <nav
        className="nc-nav"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 40px",
          background: C.charcoal,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("home")}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 4,
              background: "#EDE6D3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-hidden="true"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#161A16" strokeWidth="1.8" strokeLinecap="round">
              <path d="M7 3v18M17 3v18M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <span style={{ fontSize: 19, fontWeight: 700, fontFamily: "'Cabin Condensed', sans-serif" }}>
            <span style={{ color: C.ivory }}>Node</span>
            <span className="gradient-text">Craft</span>
          </span>
        </div>
        <div className="nc-nav-items" style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {navItems.map((n) => (
            <span key={n.id} className={`nav-item${page === n.id ? " active" : ""}`} onClick={() => setPage(n.id)}>
              {n.label}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {user ? (
            <>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: `${user.color}20`,
                  border: `2px solid ${user.color}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: user.color,
                }}
                title={user.email}
              >
                {user.initials}
              </div>
              <button className="btn-ghost" style={{ padding: "8px 18px", fontSize: 13 }} onClick={logout}>
                Sign out
              </button>
            </>
          ) : (
            <button className="btn-ghost" style={{ padding: "8px 18px", fontSize: 13 }} onClick={() => setShowAuth(true)}>
              Sign in
            </button>
          )}
          <button className="btn-emerald nc-nav-cta" style={{ padding: "8px 18px", fontSize: 13 }} onClick={goToBuilder}>
            Start Building
          </button>
        </div>
      </nav>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
};

export default Navbar;
