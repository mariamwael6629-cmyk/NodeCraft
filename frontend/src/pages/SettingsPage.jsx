import { useState, useEffect } from "react";
import { C } from "../theme.js";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

const sections = [
  { id: "general", icon: "⚙️", label: "General" },
  { id: "api", icon: "🔑", label: "API Keys" },
  { id: "integrations", icon: "🔗", label: "Integrations" },
  { id: "notifications", icon: "🔔", label: "Notifications" },
  { id: "theme", icon: "🎨", label: "Appearance" },
];

const GeneralSection = ({ settings, onSave }) => {
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  useEffect(() => setForm(settings), [settings]);

  const fields = [
    { key: "workspace_name", label: "Workspace Name" },
    { key: "timezone", label: "Default Timezone" },
    { key: "concurrency", label: "Execution Concurrency" },
    { key: "max_duration", label: "Max Run Duration (s)" },
  ];

  const save = async () => {
    setSaving(true);
    try {
      await onSave({
        workspace_name: form.workspace_name,
        timezone: form.timezone,
        concurrency: Number(form.concurrency),
        max_duration: Number(form.max_duration),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>General Settings</h2>
      {fields.map((f) => (
        <div key={f.key} style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".3px" }}>{f.label}</label>
          <input value={form[f.key] ?? ""} onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))} style={{ width: "100%" }} />
        </div>
      ))}
      <button className="btn-emerald" style={{ marginTop: 8 }} onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
};

const ApiKeysSection = () => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState(null);

  const load = () => api.apiKeys.list().then(setKeys).finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const generate = async () => {
    const name = `Key ${keys.length + 1}`;
    const created = await api.apiKeys.create(name);
    setNewKey(created);
    load();
  };

  const revoke = async (id) => {
    await api.apiKeys.revoke(id);
    load();
  };

  if (loading) return <div style={{ color: C.muted }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 640 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>API Keys</h2>
      {newKey && (
        <div className="glass-card" style={{ padding: 16, marginBottom: 16, borderColor: "rgba(159,85,42,.3)" }}>
          <div style={{ fontSize: 12, color: C.emeraldGlow, marginBottom: 6, fontWeight: 600 }}>New key created — copy it now, it won't be shown again:</div>
          <div style={{ fontFamily: "monospace", fontSize: 12, wordBreak: "break-all" }}>{newKey.key}</div>
        </div>
      )}
      {keys.filter((k) => !k.revoked).map((k) => (
        <div key={k.id} className="glass-card" style={{ padding: 20, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{k.name}</div>
              <div style={{ fontSize: 12, color: C.muted, fontFamily: "monospace" }}>{k.masked_key}</div>
              <div style={{ fontSize: 11, color: C.mutedDark, marginTop: 4 }}>Created {new Date(k.created_at).toLocaleDateString()}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", color: "#EF4444", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}
                onClick={() => revoke(k.id)}
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      ))}
      <button className="btn-purple" style={{ marginTop: 8 }} onClick={generate}>
        + Generate New Key
      </button>
    </div>
  );
};

const IntegrationsSection = () => {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.integrations.list().then(setIntegrations).finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const toggle = async (id) => {
    await api.integrations.toggle(id);
    load();
  };

  if (loading) return <div style={{ color: C.muted }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 640 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Integrations</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {integrations.map((i) => (
          <div key={i.id} className="glass-card" style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{i.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{i.name}</span>
            </div>
            <button
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                background: i.connected ? "rgba(159,85,42,.1)" : "rgba(255,255,255,.06)",
                color: i.connected ? C.emeraldGlow : C.muted,
                border: `1px solid ${i.connected ? "rgba(159,85,42,.3)" : C.border}`,
              }}
              onClick={() => toggle(i.id)}
            >
              {i.connected ? "✓ Connected" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const NotificationsSection = ({ settings, onSave }) => {
  const items = [
    { key: "notify_email", label: "Email Alerts", desc: "Workflow failures and weekly digests" },
    { key: "notify_slack", label: "Slack Notifications", desc: "Real-time execution alerts" },
    { key: "notify_sms", label: "SMS Alerts", desc: "Critical failures only" },
  ];
  return (
    <div style={{ maxWidth: 480 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Notifications</h2>
      {items.map((n) => (
        <div key={n.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: `1px solid ${C.border}` }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{n.label}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{n.desc}</div>
          </div>
          <div className={`toggle-switch${settings[n.key] ? " on" : ""}`} onClick={() => onSave({ [n.key]: !settings[n.key] })}>
            <div className="toggle-knob" />
          </div>
        </div>
      ))}
    </div>
  );
};

const ThemeSection = ({ settings, onSave }) => (
  <div style={{ maxWidth: 480 }}>
    <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Appearance</h2>
    <div style={{ fontSize: 12, color: C.muted, marginBottom: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".3px" }}>Accent Color</div>
    <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
      {[C.emerald, C.purple, "#CF7B4A", "#D36A2D", "#EF4444", "#CF7B4A"].map((c) => (
        <div
          key={c}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: c,
            cursor: "pointer",
            border: c === settings.accent_color ? "3px solid white" : "3px solid transparent",
            transition: "all .2s",
            boxShadow: `0 0 12px ${c}50`,
          }}
          onClick={() => onSave({ accent_color: c })}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.2)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        />
      ))}
    </div>
    <div style={{ fontSize: 12, color: C.muted, marginBottom: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".3px" }}>Canvas Theme</div>
    <div style={{ display: "flex", gap: 12 }}>
      {["Dark (Default)", "Dim", "Light"].map((t) => (
        <div
          key={t}
          onClick={() => onSave({ canvas_theme: t })}
          style={{
            padding: "12px 20px",
            borderRadius: 12,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            background: t === settings.canvas_theme ? "rgba(159,85,42,.1)" : "rgba(255,255,255,.04)",
            border: `1px solid ${t === settings.canvas_theme ? "rgba(159,85,42,.3)" : C.border}`,
            color: t === settings.canvas_theme ? C.emeraldGlow : C.muted,
          }}
        >
          {t}
        </div>
      ))}
    </div>
  </div>
);

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("general");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    api.settings.get().then(setSettings).finally(() => setLoading(false));
  }, [user]);

  const saveSettings = async (patch) => {
    const updated = await api.settings.update(patch);
    setSettings(updated);
  };

  if (!user) {
    return (
      <div style={{ position: "relative", zIndex: 1, paddingTop: 140, textAlign: "center", color: C.muted }}>
        Sign in to manage workspace settings.
      </div>
    );
  }

  if (loading || !settings) {
    return (
      <div style={{ position: "relative", zIndex: 1, paddingTop: 140, textAlign: "center", color: C.muted }}>
        Loading settings…
      </div>
    );
  }

  return (
    <div style={{ position: "relative", zIndex: 1, display: "flex", height: "100vh", paddingTop: 60 }}>
      <div style={{ width: 220, borderRight: `1px solid ${C.border}`, background: "rgba(29,28,27,.95)", padding: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 12, letterSpacing: "1px", textTransform: "uppercase", padding: "0 4px" }}>Settings</div>
        {sections.map((s) => (
          <div key={s.id} className={`sidebar-item${activeSection === s.id ? " active" : ""}`} onClick={() => setActiveSection(s.id)}>
            <span style={{ fontSize: 16 }}>{s.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 40 }}>
        {activeSection === "general" && <GeneralSection settings={settings} onSave={saveSettings} />}
        {activeSection === "api" && <ApiKeysSection />}
        {activeSection === "integrations" && <IntegrationsSection />}
        {activeSection === "notifications" && <NotificationsSection settings={settings} onSave={saveSettings} />}
        {activeSection === "theme" && <ThemeSection settings={settings} onSave={saveSettings} />}
      </div>
    </div>
  );
};

export default SettingsPage;
