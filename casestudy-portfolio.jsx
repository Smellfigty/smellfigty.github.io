/* casestudy-portfolio.jsx – Portfolio case study: app shell.
   Composes OldDesignCase + NewDesignCase from the active-language content file
   (portfolio-content.jsx / portfolio-content.ru.jsx).
   Nav, ReadingProgress, CaseEndCTA from casestudy-shared.jsx; chrome from core.jsx + legal.jsx. */

function CaseStudyApp() {
  const [view, setView] = useState("old");

  useCursor("comet", "#7FD858");
  useReveal(view);
  useAnimReady(true);

  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("am-theme") || "dark"; } catch(_) { return "dark"; }
  });
  const toggleTheme = () => setTheme(t => {
    const next = t === "dark" ? "light" : "dark";
    try { localStorage.setItem("am-theme", next); } catch(_) {}
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

  const choose = (v) => {
    if (v === view) return;
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const appStyle = {
    "--accent": "#7FD858",
    "--accent-ink": "#0b0b0d",
    "--font-display": '"Archivo", system-ui, sans-serif',
    "--font-body": '"Archivo", system-ui, sans-serif',
    "--font-mono": '"Space Mono", ui-monospace, monospace',
  };

  return (
    <LightboxProvider>
      <div className="app" id="top" data-theme={theme} data-font="swiss" data-view={view} style={appStyle}>
        <ReadingProgress />
        <GridBackdrop />
        <CaseStudyNav theme={theme} onToggleTheme={toggleTheme} onContact={() => setContactOpen(true)} />
        <div className="cs-switchbar"><CSSwitch view={view} onChange={choose} /></div>
        <main className="cs">
          {view === "new" ? <NewDesignCase /> : <OldDesignCase />}
          <CaseEndCTA onContact={() => setContactOpen(true)} homeHref="index.html" />
        </main>
        <Footer />
        <LegalModal which={legal} onClose={closeLegal} />
        <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      </div>
    </LightboxProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<CaseStudyApp />);
