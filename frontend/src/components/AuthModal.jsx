import { useState } from "react";
import { C } from "../theme.js";
import { useAuth } from "../AuthContext.jsx";

const AuthModal = ({ onClose }) => {
  const { login, register, authError } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = mode === "login" ? await login(email, password) : await register(email, password, fullName);
    setSubmitting(false);
    if (ok) onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-card-bright"
        style={{ width: 380, padding: 32 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{mode === "login" ? "Sign in" : "Create account"}</div>
          <span style={{ cursor: "pointer", color: C.muted, fontSize: 20 }} onClick={onClose}>
            ×
          </span>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "register" && (
            <div>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 6, fontWeight: 600 }}>
                Full Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{ width: "100%" }}
                placeholder="Jane Doe"
              />
            </div>
          )}
          <div>
            <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 6, fontWeight: 600 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%" }}
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 6, fontWeight: 600 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ width: "100%" }}
              placeholder="••••••••"
            />
          </div>

          {authError && <div style={{ color: "#D9533F", fontSize: 12 }}>{authError}</div>}

          <button className="btn-emerald" type="submit" disabled={submitting} style={{ marginTop: 8 }}>
            {submitting ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div style={{ marginTop: 16, fontSize: 13, color: C.muted, textAlign: "center" }}>
          {mode === "login" ? (
            <>
              No account?{" "}
              <span style={{ color: C.emeraldGlow, cursor: "pointer", fontWeight: 600 }} onClick={() => setMode("register")}>
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span style={{ color: C.emeraldGlow, cursor: "pointer", fontWeight: 600 }} onClick={() => setMode("login")}>
                Sign in
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
