/* app.jsx – orchestration + Tweaks (final: Mash-up flagship) */

// Single type system – Swiss (Archivo + Space Mono).
const SWISS_FONTS = { display: '"Archivo"', body: '"Archivo"', mono: '"Space Mono"' };
const CARD_LABELS = { "Solid": "solid", "Outline": "outline", "Elevated": "elevated", "Minimal": "minimal" };
const WORK_LAYOUT_LABELS = { "Flagship": "flagship", "Pyramid": "pyramid" };
const PALETTE_THEME = { dark: "dark", light: "light" };
const labelOf = (map, val) => Object.keys(map).find((k) => map[k] === val) || Object.keys(map)[0];

// relative luminance -> pick black/white ink so accent buttons always read
function accentInkFor(hex) {
  const h = String(hex).replace("#", "");
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, "0");
  const n = parseInt(x.slice(0, 6), 16); if (Number.isNaN(n)) return "#fff";
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const L = 0.2126 * f((n >> 16) & 255) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255);
  return L > 0.5 ? "#0b0b0d" : "#ffffff";
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "dark",
  "accent": "#7FD858",
  "card": "outline",
  "workLayout": "flagship",
  "aboutPhoto": true,
  "motion": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const fonts = SWISS_FONTS;
  const theme = PALETTE_THEME[t.palette] || "dark";
  const toggleTheme = () => setTweak("palette", t.palette === "dark" ? "light" : "dark");

  useReveal(t.card + theme + t.aboutPhoto + t.workLayout);
  useAnimReady(t.motion);
  useParallax(t.motion, theme);
  useCursor("ring");

  // hash-routed legal modals (#impressum / #privacy) – reachable by direct link
  const [legal, setLegal] = useState(null);
  useEffect(() => {
    const KEYS = { impressum: "impressum", privacy: "privacy" };
    const sync = () => {
      const h = (window.location.hash || "").replace(/^#/, "").toLowerCase();
      setLegal(KEYS[h] || null);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  const closeLegal = () => {
    setLegal(null);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  };

  // smooth-scroll for in-page anchors
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const el = document.querySelector(id);
      if (el) { e.preventDefault(); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: t.motion ? "smooth" : "auto" }); }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [t.motion]);

  // Scroll to hash on initial page load – handles navigation from case-study pages
  // (e.g. index.html#certificates). React renders after the browser's native
  // anchor-scroll attempt, so we re-do it ourselves after the first paint.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    const tryScroll = () => {
      const el = document.querySelector(hash);
      if (el) {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: "auto" });
      }
    };
    // Two rAF frames guarantee React has committed its first paint to the DOM
    requestAnimationFrame(() => requestAnimationFrame(tryScroll));
  }, []);

  const appStyle = {
    "--accent": t.accent,
    "--accent-ink": accentInkFor(t.accent),
    "--font-display": fonts.display + ", system-ui, sans-serif",
    "--font-body": fonts.body + ", system-ui, sans-serif",
    "--font-mono": fonts.mono + ", ui-monospace, monospace",
  };

  return (
    <div className={"app" + (t.motion ? "" : " motion-off")} id="top"
      data-theme={theme} data-density="regular" data-card={t.card} data-font="swiss"
      style={appStyle}>
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <DirMashup heroAnchor="halftone" workLayout={t.workLayout} />
        <AboutSection showPhoto={t.aboutPhoto} />
        <CertificatesSection />
        <ContactSection />
      </main>
      <Footer />

      <LegalModal which={legal} onClose={closeLegal} />

      <TweaksPanel title="Tweaks">
        <TweakRadio label={UI.tweakCaseGrid} value={labelOf(WORK_LAYOUT_LABELS, t.workLayout)}
          options={Object.keys(WORK_LAYOUT_LABELS)}
          onChange={(v) => setTweak("workLayout", WORK_LAYOUT_LABELS[v])} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
