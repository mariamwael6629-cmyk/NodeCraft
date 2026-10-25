import { useState, useEffect } from "react";
import { C } from "../theme.js";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import Glyph from "../components/Glyph.jsx";

const timeAgo = (iso) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const InviteModal = ({ onClose, onInvited }) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("Viewer");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.team.invite({ email, full_name: fullName, role });
      onInvited();
      onClose();
    } catch (err) {
      setError(err.message || "Invite failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-card-bright" style={{ width: 380, padding: 32 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Invite Member</div>
          <span style={{ cursor: "pointer", color: C.muted, fontSize: 20 }} onClick={onClose}>
            ×
          </span>
        </div>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 6, fontWeight: 600 }}>Full Name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: "100%" }} placeholder="Jane Doe" />
          </div>
          <div>
            <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 6, fontWeight: 600 }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%" }} placeholder="jane@company.com" />
          </div>
          <div>
            <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 6, fontWeight: 600 }}>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: "100%" }}>
              <option>Admin</option>
              <option>Editor</option>
              <option>Viewer</option>
            </select>
          </div>
          {error && <div style={{ color: "#D9533F", fontSize: 12 }}>{error}</div>}
          <button className="btn-emerald" type="submit" disabled={submitting} style={{ marginTop: 8 }}>
            {submitting ? "Sending…" : "Send Invite"}
          </button>
        </form>
      </div>
    </div>
  );
};

const TeamPage = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInvite, setShowInvite] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([api.team.members(), api.team.activity()])
      .then(([m, a]) => {
        setMembers(m);
        setActivity(a);
      })
      .catch((err) => setError(err.message || "Failed to load team data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) {
    return (
      <div style={{ position: "relative", zIndex: 1, paddingTop: 140, textAlign: "center", color: C.muted }}>
        Sign in to view your team workspace.
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ position: "relative", zIndex: 1, paddingTop: 140, textAlign: "center", color: C.muted }}>
        Loading team…
      </div>
    );
  }

  const memberById = Object.fromEntries(members.map((m) => [m.id, m]));
  const roleCounts = members.reduce((acc, m) => {
    acc[m.role] = (acc[m.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ position: "relative", zIndex: 1, padding: "80px 40px 40px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px" }}>Team Workspace</h1>
          <p style={{ color: C.muted, marginTop: 4 }}>Collaborate on workflows in real-time</p>
        </div>
        <button className="btn-emerald" onClick={() => setShowInvite(true)}>
          Invite Member
        </button>
      </div>

      {error && <div style={{ color: "#D9533F", fontSize: 13, marginBottom: 16 }}>{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div>
          <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 20, fontSize: 15 }}>Team Members</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {members.map((m) => (
                <div
                  key={m.id}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 12, cursor: "pointer", transition: "background .15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(237,230,211,.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: `${m.color}20`,
                        border: `2px solid ${m.color}40`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 700,
                        color: m.color,
                      }}
                    >
                      {m.initials}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: m.status === "online" ? C.emerald : m.status === "away" ? "#E8A33A" : "#6B7280",
                        border: `2px solid ${C.charcoal}`,
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{m.full_name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{m.email}</div>
                  </div>
                  <div style={{ fontSize: 11, color: C.muted }}>{m.workflows} workflows</div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: m.role === "Admin" ? "rgba(201,154,69,.15)" : "rgba(237,230,211,.06)",
                      color: m.role === "Admin" ? C.purpleGlow : C.muted,
                      border: `1px solid ${m.role === "Admin" ? "rgba(201,154,69,.3)" : C.border}`,
                    }}
                  >
                    {m.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Activity Log</div>
            {activity.length === 0 ? (
              <div style={{ color: C.muted, fontSize: 13 }}>No activity yet.</div>
            ) : (
              activity.map((a, i) => (
                <div key={a.id} style={{ display: "flex", gap: 10, paddingBottom: 14, marginBottom: 14, borderBottom: i < activity.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(237,230,211,.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                    <Glyph e={a.icon} size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 600, color: C.emeraldGlow }}>{memberById[a.user_id]?.full_name || "Someone"}</span>
                      <span style={{ color: C.muted }}> {a.action}</span>
                    </div>
                    <div style={{ fontSize: 10, color: C.mutedDark, marginTop: 4 }}>{timeAgo(a.created_at)}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Permissions</div>
            {[
              { label: "Admin", desc: "Full access" },
              { label: "Editor", desc: "Create & edit" },
              { label: "Viewer", desc: "Read only" },
            ].map((p) => (
              <div key={p.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.label}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{p.desc}</div>
                </div>
                <div style={{ background: "rgba(237,230,211,.06)", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                  {roleCounts[p.label] || 0} {roleCounts[p.label] === 1 ? "member" : "members"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onInvited={load} />}
    </div>
  );
};

export default TeamPage;
