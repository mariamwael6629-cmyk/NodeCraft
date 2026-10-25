import { useState, useEffect } from "react";
import { C } from "../theme.js";
import { api } from "../api.js";

const PricingPage = () => {
  const [annual, setAnnual] = useState(true);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api.pricing
      .list()
      .then((data) => !cancelled && setPlans(data))
      .catch((err) => !cancelled && setError(err.message || "Failed to load pricing"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ position: "relative", zIndex: 1, padding: "80px 40px 60px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-1px", marginBottom: 16 }}>Simple, transparent pricing</h1>
        <p style={{ color: C.muted, fontSize: 17, marginBottom: 32 }}>Scale as you grow. Cancel anytime.</p>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,.05)", border: `1px solid ${C.border}`, borderRadius: 14, padding: "8px 16px" }}>
          <span style={{ fontSize: 14, color: annual ? C.muted : C.ivory, fontWeight: annual ? 400 : 600 }}>Monthly</span>
          <div className={`toggle-switch${annual ? " on" : ""}`} onClick={() => setAnnual(!annual)}>
            <div className="toggle-knob" />
          </div>
          <span style={{ fontSize: 14, color: annual ? C.ivory : C.muted, fontWeight: annual ? 600 : 400 }}>Annual</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "rgba(159,85,42,.1)", color: C.emeraldGlow, border: `1px solid rgba(159,85,42,.2)` }}>
            Save 20%
          </span>
        </div>
      </div>

      {error && <div style={{ textAlign: "center", color: "#EF4444", fontSize: 13, marginBottom: 24 }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: "center", color: C.muted, padding: 60 }}>Loading plans…</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, alignItems: "start" }}>
          {plans.map((p) => {
            const price = p.is_custom ? "Custom" : annual ? p.price_annual : p.price_monthly;
            return (
              <div key={p.id} className={`pricing-card${p.featured ? " featured" : ""}`} style={{ position: "relative", marginTop: p.featured ? 0 : 16 }}>
                {p.featured && (
                  <div
                    style={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#9F552A",
                      borderRadius: 20,
                      padding: "4px 16px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "white",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Most Popular
                  </div>
                )}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.muted, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
                    {typeof price === "number" ? (
                      <>
                        <span style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>$</span>
                        <span style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-2px" }}>{price}</span>
                        <span style={{ fontSize: 13, color: C.muted }}>/mo</span>
                      </>
                    ) : (
                      <span style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-1px" }}>{price}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{p.description}</p>
                </div>

                <div style={{ height: 1, background: C.border, margin: "20px 0" }} />

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {p.features.map((f) => (
                    <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13 }}>
                      <span style={{ color: C.emeraldGlow, fontWeight: 700, flexShrink: 0 }}>✓</span>
                      <span style={{ color: C.muted }}>{f}</span>
                    </div>
                  ))}
                </div>

                <button className={p.featured ? "btn-emerald" : "btn-ghost"} style={{ width: "100%", padding: "12px", fontSize: 14 }}>
                  {p.cta}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 48, color: C.muted, fontSize: 13 }}>
        All plans include 14-day free trial · No credit card required · Cancel anytime
      </div>
    </div>
  );
};

export default PricingPage;
