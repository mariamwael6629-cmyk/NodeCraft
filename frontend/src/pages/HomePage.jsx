import { C } from "../theme.js";
import WorkflowPreview from "../components/WorkflowPreview.jsx";
import Glyph from "../components/Glyph.jsx";

const HomePage = ({ setPage }) => {
  const features = [
    { icon: "🎯", title: "Visual Node Builder", desc: "Drag, connect, configure. Build complex automations without touching code." },
    { icon: "🧠", title: "AI-Powered Generation", desc: "Describe your workflow in plain language. NodeCraft builds it instantly." },
    { icon: "⚡", title: "Real-time Execution", desc: "Watch your automations run live. Debug issues before they go to production." },
    { icon: "🔒", title: "Enterprise Security", desc: "SOC 2 Type II. End-to-end encryption. Granular access controls." },
    { icon: "🌐", title: "500+ Integrations", desc: "Connect every tool in your stack. APIs, databases, SaaS apps, webhooks." },
    { icon: "📊", title: "Deep Analytics", desc: "Track performance, errors, and ROI across all your automations." },
  ];
  const metrics = [
    { n: "2.4M+", l: "Workflows Run Daily" },
    { n: "99.98%", l: "Uptime SLA" },
    { n: "<50ms", l: "Avg. Execution" },
    { n: "12,000+", l: "Teams" },
  ];
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 40px 80px",
          textAlign: "center",
          position: "relative",
        }}
      >

        <div className="tag" style={{ marginBottom: 24, animation: "slide-in .6s ease" }}>
          AI workflow automation platform
        </div>
        <h1
          style={{
            fontSize: "clamp(40px,6vw,80px)",
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "0",
            maxWidth: 900,
            marginBottom: 24,
            animation: "slide-in .6s .1s both",
          }}
        >
          Build AI Workflows <br />
          <span className="gradient-text">Visually.</span> Automate <span className="gradient-text">Everything.</span>
        </h1>
        <p
          style={{
            fontSize: 18,
            color: C.muted,
            maxWidth: 560,
            lineHeight: 1.7,
            marginBottom: 40,
            animation: "slide-in .6s .2s both",
          }}
        >
          Connect AI models, APIs and the rest of your stack into automated pipelines, with no code.
          Deploy in seconds.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", animation: "slide-in .6s .3s both" }}>
          <button className="btn-emerald" style={{ fontSize: 16, padding: "14px 36px" }} onClick={() => setPage("builder")}>
            Start building
          </button>
          <button className="btn-ghost" style={{ fontSize: 16, padding: "14px 36px" }} onClick={() => setPage("templates")}>
            Watch the demo
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: 48,
            marginTop: 72,
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "slide-in .6s .4s both",
          }}
        >
          {metrics.map((m) => (
            <div key={m.n} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 30, fontWeight: 700, fontFamily: "'Cabin Condensed', sans-serif", color: C.ivory, fontVariantNumeric: "tabular-nums" }}>
                {m.n}
              </div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
                {m.l}
              </div>
            </div>
          ))}
        </div>

        <div
          className="glass-card"
          style={{
            width: "100%",
            maxWidth: 800,
            marginTop: 64,
            padding: 32,
            animation: "slide-in .6s .5s both",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: 13, color: C.muted, fontFamily: "'Fira Code', monospace" }}>lead-generation-pipeline.flow</span>
            <div
              style={{
                marginLeft: "auto",
                background: "rgba(108,192,122,.1)",
                color: C.emeraldGlow,
                fontSize: 11,
                padding: "3px 10px",
                borderRadius: 20,
                border: `1px solid rgba(108,192,122,.2)`,
              }}
            >
              Live
            </div>
          </div>
          <WorkflowPreview />
        </div>
      </section>

      <section style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: 44, fontWeight: 700, marginBottom: 16 }}>
            Everything you need to <span className="gradient-text">automate anything</span>
          </h2>
          <p style={{ color: C.muted, fontSize: 17 }}>Powerful primitives. Infinite possibilities.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass-card"
              style={{
                padding: 28,
                transition: "all .3s",
                cursor: "default",
                animationDelay: `${i * 0.06}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.borderBright;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.transform = "";
              }}
            >
              <div style={{ marginBottom: 14, color: C.ivory, width: 40, height: 40, display: "grid", placeItems: "center", border: `1px solid ${C.borderMed}`, borderRadius: 6 }}><Glyph e={f.icon} size={20} /></div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "80px 40px", textAlign: "center" }}>
        <div
          className="glass-card-bright"
          style={{
            maxWidth: 700,
            margin: "0 auto",
            padding: 56,
            background: "#EDE6D3",
            color: "#161A16",
            borderColor: "#EDE6D3",
          }}
        >
          <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 16 }}>
            Ready to automate everything?
          </h2>
          <p style={{ color: "#4A4A40", marginBottom: 32, fontSize: 16 }}>Join 12,000+ teams building the future of work.</p>
          <button className="btn-emerald" data-dark style={{ fontSize: 16, padding: "14px 40px" }} onClick={() => setPage("builder")}>
            Get started free
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
