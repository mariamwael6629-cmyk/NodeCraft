import { C } from "../theme.js";
import WorkflowPreview from "../components/WorkflowPreview.jsx";

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
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 40px 80px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 600,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(16,185,129,.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "60%",
            transform: "translate(-50%,-50%)",
            width: 400,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(139,92,246,.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="tag" style={{ marginBottom: 24, animation: "slide-in .6s ease" }}>
          ✦ AI Workflow Automation Platform
        </div>
        <h1
          style={{
            fontSize: "clamp(40px,6vw,80px)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-2px",
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
          Connect AI models, APIs, and your entire tech stack into powerful automated pipelines — no code required.
          Deploy in seconds.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", animation: "slide-in .6s .3s both" }}>
          <button className="btn-emerald" style={{ fontSize: 16, padding: "14px 36px" }} onClick={() => setPage("builder")}>
            Start Building →
          </button>
          <button className="btn-ghost" style={{ fontSize: 16, padding: "14px 36px" }} onClick={() => setPage("templates")}>
            ▶ Watch Demo
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
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px" }} className="gradient-text">
                {m.n}
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4, letterSpacing: ".5px", textTransform: "uppercase" }}>
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
            <div style={{ display: "flex", gap: 6 }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
              ))}
            </div>
            <span style={{ fontSize: 12, color: C.muted, marginLeft: 8 }}>lead-generation-pipeline.flow</span>
            <div
              style={{
                marginLeft: "auto",
                background: "rgba(16,185,129,.1)",
                color: C.emeraldGlow,
                fontSize: 11,
                padding: "3px 10px",
                borderRadius: 20,
                border: `1px solid rgba(16,185,129,.2)`,
              }}
            >
              ● LIVE
            </div>
          </div>
          <WorkflowPreview />
        </div>
      </section>

      <section style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-1px", marginBottom: 16 }}>
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
                e.currentTarget.style.borderColor = "rgba(16,185,129,.3)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.transform = "";
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
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
            background: "linear-gradient(135deg,rgba(16,185,129,.08),rgba(139,92,246,.06))",
            borderColor: "rgba(16,185,129,.2)",
          }}
        >
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px", marginBottom: 16 }}>
            Ready to automate everything?
          </h2>
          <p style={{ color: C.muted, marginBottom: 32, fontSize: 16 }}>Join 12,000+ teams building the future of work.</p>
          <button className="btn-emerald" style={{ fontSize: 16, padding: "14px 40px" }} onClick={() => setPage("builder")}>
            Get started free →
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
