import { useState, useEffect } from "react";
import { C } from "../theme.js";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

const timeAgo = (iso) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const BarChart = ({ data }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80, marginTop: 16 }}>
    {data.map((v, i) => (
      <div
        key={i}
        style={{
          flex: 1,
          borderRadius: "4px 4px 0 0",
          background: v > 90 ? "rgba(159,85,42,.7)" : v > 70 ? "rgba(159,85,42,.4)" : "rgba(239,68,68,.4)",
          height: `${v}%`,
          transition: "all .3s",
        }}
        title={`${v}% success`}
      />
    ))}
  </div>
);

const MonitoringDashboard = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("24h");
  const [stats, setStats] = useState(null);
  const [workflows, setWorkflows] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    Promise.all([api.monitoring.stats(), api.monitoring.workflows(), api.monitoring.activity()])
      .then(([s, w, a]) => {
        if (cancelled) return;
        setStats(s);
        setWorkflows(w);
        setTimeline(a);
      })
      .catch((err) => !cancelled && setError(err.message || "Failed to load monitoring data"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) {
    return (
      <div style={{ position: "relative", zIndex: 1, paddingTop: 140, textAlign: "center", color: C.muted }}>
        Sign in to view monitoring data.
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ position: "relative", zIndex: 1, paddingTop: 140, textAlign: "center", color: C.muted }}>
        Loading monitoring data…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ position: "relative", zIndex: 1, paddingTop: 140, textAlign: "center", color: "#EF4444" }}>{error}</div>
    );
  }

  const history = stats.success_history.length ? stats.success_history : [100];
  const health = stats.health;
  const ringOffset = 2 * Math.PI * 50 * (1 - health.overall_success_rate / 100);

  return (
    <div style={{ position: "relative", zIndex: 1, padding: "80px 40px 40px", maxWidth: 1400, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px" }}>Automation Monitor</h1>
          <p style={{ color: C.muted, marginTop: 4 }}>Real-time execution & performance tracking</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["1h", "24h", "7d", "30d"].map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                background: timeRange === t ? "rgba(159,85,42,.15)" : "transparent",
                color: timeRange === t ? C.emeraldGlow : C.muted,
                border: `1px solid ${timeRange === t ? "rgba(159,85,42,.3)" : C.border}`,
                cursor: "pointer",
                transition: "all .2s",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {stats.stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: "rgba(159,85,42,.1)", color: C.emeraldGlow }}>{s.delta}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-1px", marginBottom: 4 }}>{s.val}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Execution Success Rate</div>
            <div className="tag">Past {timeRange}</div>
          </div>
          <BarChart data={history} />
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Overall Health</div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <svg width="120" height="120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="12" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={C.emerald}
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={ringOffset}
                strokeLinecap="round"
              />
              <text x="60" y="55" textAnchor="middle" fill={C.ivory} fontSize="18" fontWeight="800">
                {health.overall_success_rate}
              </text>
              <text x="60" y="72" textAnchor="middle" fill={C.muted} fontSize="11">
                % healthy
              </text>
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { l: "Running", n: health.running, c: C.emerald },
              { l: "Paused", n: health.paused, c: "#F59E0B" },
              { l: "Error", n: health.error, c: "#EF4444" },
            ].map((s) => (
              <div key={s.l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.c }} />
                  <span style={{ color: C.muted }}>{s.l}</span>
                </div>
                <span style={{ fontWeight: 600 }}>{s.n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Workflow Status</div>
          {workflows.length === 0 ? (
            <div style={{ color: C.muted, fontSize: 13 }}>No workflows yet. Create one in the Builder.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {workflows.map((w) => {
                const color = w.status === "running" ? C.emerald : w.status === "error" ? "#EF4444" : "#F59E0B";
                return (
                  <div
                    key={w.id}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, cursor: "pointer", transition: "background .15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.04)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: color,
                        flexShrink: 0,
                        boxShadow: w.status === "running" ? `0 0 6px ${color}` : "none",
                        animation: w.status === "running" ? "pulse-glow 2s ease infinite" : "none",
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{w.name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>Last run: {w.last_run ? timeAgo(w.last_run) : "never"}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: w.success_rate > 95 ? C.emeraldGlow : w.success_rate > 90 ? "#F59E0B" : "#EF4444" }}>{w.success_rate}%</div>
                      <div style={{ fontSize: 10, color: C.muted }}>{w.runs.toLocaleString()} runs</div>
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "3px 8px",
                        borderRadius: 20,
                        flexShrink: 0,
                        background: w.status === "running" ? "rgba(159,85,42,.1)" : w.status === "error" ? "rgba(239,68,68,.1)" : "rgba(245,158,11,.1)",
                        color,
                        border: `1px solid ${color}30`,
                      }}
                    >
                      {w.status}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Activity Timeline</div>
          {timeline.length === 0 ? (
            <div style={{ color: C.muted, fontSize: 13 }}>No activity yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {timeline.map((e, i) => (
                <div key={e.id} style={{ display: "flex", gap: 12, paddingBottom: 16, position: "relative" }}>
                  {i < timeline.length - 1 && <div style={{ position: "absolute", left: 7, top: 18, width: 1, height: "100%", background: C.border }} />}
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      flexShrink: 0,
                      marginTop: 2,
                      background: e.type === "success" ? C.emerald : e.type === "error" ? "#EF4444" : e.type === "warning" ? "#F59E0B" : "#CF7B4A",
                      boxShadow: e.type === "success" ? `0 0 6px ${C.emerald}50` : e.type === "error" ? "0 0 6px #EF444450" : "none",
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 12, marginBottom: 3 }}>{e.event}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>{timeAgo(e.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
