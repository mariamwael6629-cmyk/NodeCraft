import { useState, useEffect } from "react";
import { C } from "../theme.js";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import Glyph from "../components/Glyph.jsx";

const categories = ["All", "AI Agents", "Marketing", "Sales", "Support", "Data", "HR"];

const TemplatesPage = ({ setPage }) => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingId, setUsingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.templates
      .list()
      .then((data) => !cancelled && setTemplates(data))
      .catch((err) => !cancelled && setError(err.message || "Failed to load templates"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = templates.filter(
    (t) => (activeFilter === "All" || t.category === activeFilter) && (search === "" || t.name.toLowerCase().includes(search.toLowerCase()))
  );

  const useTemplate = async (template) => {
    if (!user) {
      setPage("home");
      return;
    }
    setUsingId(template.id);
    try {
      await api.workflows.fromTemplate(template.id);
      setPage("builder");
    } catch (err) {
      setError(err.message || "Failed to use template");
    } finally {
      setUsingId(null);
    }
  };

  return (
    <div style={{ position: "relative", zIndex: 1, padding: "80px 40px 40px", maxWidth: 1300, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px", marginBottom: 12 }}>Template Marketplace</h1>
        <p style={{ color: C.muted, fontSize: 16 }}>Start from a proven workflow. Customize in minutes.</p>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates…" style={{ flex: 1, minWidth: 200, maxWidth: 360 }} />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveFilter(c)}
              style={{
                padding: "6px 16px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                background: activeFilter === c ? "rgba(201,154,69,.2)" : "transparent",
                color: activeFilter === c ? C.purpleGlow : C.muted,
                border: `1px solid ${activeFilter === c ? "rgba(201,154,69,.4)" : C.border}`,
                transition: "all .2s",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {error && <div style={{ color: "#D9533F", fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: "center", color: C.muted, padding: 60 }}>Loading templates…</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
          {filtered.map((t) => (
            <div key={t.id} className="template-card" onClick={() => useTemplate(t)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <Glyph e={t.icon} size={26} />
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: 20,
                    background: `${t.color}15`,
                    color: t.color,
                    border: `1px solid ${t.color}30`,
                  }}
                >
                  {t.category}
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 16 }}>{t.description}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.muted }}>
                  <span style={{ color: t.color, fontWeight: 600 }}>{t.node_count}</span> nodes
                </div>
                <div style={{ fontSize: 11, color: C.muted }}>{t.uses.toLocaleString()} uses</div>
                <button
                  className="btn-purple"
                  style={{ padding: "5px 12px", fontSize: 11 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    useTemplate(t);
                  }}
                  disabled={usingId === t.id}
                >
                  {usingId === t.id ? "Adding…" : "Use Template"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
