/* casestudy-missionmittelstand.jsx — Mission Mittelstand case study app shell.
   Composes <MMCase/> from casestudy-missionmittelstand-content.jsx.
   Nav, ReadingProgress, CaseLogo, LightboxProvider come from casestudy-shared.jsx. */

function MMApp() {
  useCursor("comet", "#7BBE45");
  useReveal("missionmittelstand");
  useAnimReady(true);

  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("am-theme") || "dark"; } catch (_) { return "dark"; }
  });
  const toggleTheme = () => setTheme(t => {
    const next = t === "dark" ? "light" : "dark";
    try { localStorage.setItem("am-theme", next); } catch (_) {}
    return next;
  });

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

  const [contactOpen, setContactOpen] = useState(false);
  const [protoOpen, setProtoOpen] = useState(false);

  const appStyle = {
    "--accent": "#7BBE45",
    "--accent-ink": "#0b0f09",
    "--font-display": '"Barlow", system-ui, sans-serif',
    "--font-body": '"Barlow", system-ui, sans-serif',
    "--font-mono": '"Space Mono", ui-monospace, monospace',
  };

  return (
    <LightboxProvider>
      <div className="app" id="top" data-theme={theme} data-font="swiss" style={appStyle}>
        <ReadingProgress />
        <GridBackdrop />
        <CaseStudyNav theme={theme} onToggleTheme={toggleTheme} onContact={() => setContactOpen(true)} />
        <main className="cs">
          <MMCase onPrototype={() => setProtoOpen(true)} />
          <CaseEndCTA onContact={() => setContactOpen(true)} homeHref="index.html" />
          <MMDisclaimer />
        </main>
        <Footer />
        <LegalModal which={legal} onClose={closeLegal} />
        <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
        <MMPrototypeModal open={protoOpen} onClose={() => setProtoOpen(false)} />
      </div>
    </LightboxProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<MMApp />);
