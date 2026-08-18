/* casestudy-migroplan-content.de.jsx – Deutsche Ausgabe der MigroPlan-Fallstudie.
   Gleiche Struktur & Komponenten wie casestudy-migroplan-content.jsx, deutsche Texte
   im Stil der bestehenden DE-Inhalte (Ton & Terminologie). Exportiert <MigroCase/>.
   Bilder 1:1 wie in der EN-Version (live-shots/, ein Verzeichnis höher). */

const MS = "../live-shots/";

/* ---- Live-Screenshot im Browser-Chrome-Rahmen; Klick zum Zoomen,
   Chrome-Link öffnet die echte Produktionsseite ---- */
function LiveShot({ src, caption, alt = "MigroPlan Live-Seite", href = "https://migroplan.com/", fit, pos }) {
  const open = useLightbox();
  return (
    <figure className={"mg-live" + (fit ? " mg-live--fit" : "")}>
      <div className="mg-live-shell">
        <div className="mg-live-chrome">
          <span className="mg-live-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span className="mg-live-url">migroplan.com</span>
          <a className="mg-live-open" href={href} target="_blank" rel="noopener noreferrer" data-hot>
            <span className="mg-live-pulse" aria-hidden="true"></span>live · öffnen ↗
          </a>
        </div>
        <button type="button" className="mg-live-shot" data-hot
          onClick={() => open({ src, alt, caption })}
          aria-label={"Bild vergrößern: " + alt}>
          <img src={src} alt={alt} loading="lazy" style={pos ? { objectPosition: pos } : undefined} />
          <span className="mg-live-zoom" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          </span>
        </button>
      </div>
      {caption && <figcaption className="cs-cap">{caption}</figcaption>}
    </figure>
  );
}

/* ---- Mobile-Screenshot im Phone-Rahmen; Klick zum Zoomen ---- */
function MobileShot({ src, caption, alt = "MigroPlan auf dem Smartphone" }) {
  const open = useLightbox();
  return (
    <figure className="mg-phone">
      <div className="mg-phone-frame">
        <button type="button" className="mg-phone-shot" data-hot
          onClick={() => open({ src, alt, caption })}
          aria-label={"Bild vergrößern: " + alt}>
          <img src={src} alt={alt} loading="lazy" />
        </button>
      </div>
      {caption && <figcaption className="cs-cap">{caption}</figcaption>}
    </figure>
  );
}

/* ---- animierte Kennzahl ---- */
function MigroStat({ to, pre = "", suf = "", text, label }) {
  const ref = useRef(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < (window.innerHeight || 800) * 0.85 && r.bottom > 0;
    };
    if (inView()) { setRun(true); return; }
    const onScroll = () => { if (inView()) { setRun(true); cleanup(); } };
    const t = setTimeout(() => { setRun(true); cleanup(); }, 2500);
    function cleanup() { window.removeEventListener("scroll", onScroll); clearTimeout(t); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return cleanup;
  }, []);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVal(to == null ? 0 : to); return; }
    let raf = 0, start = 0, done = false;
    const target = to == null ? 0 : to;
    const dur = 1300;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick); else done = true;
    };
    raf = requestAnimationFrame(tick);
    const fb = setTimeout(() => { if (!done) setVal(target); }, dur + 500);
    return () => { cancelAnimationFrame(raf); clearTimeout(fb); };
  }, [run, to]);
  return (
    <div className="gm-stat" ref={ref}>
      <div className="gm-stat-n">{text ? text : <span className="accent">{pre}{val}{suf}</span>}</div>
      <div className="gm-stat-k">{label}</div>
    </div>
  );
}

function MKL({ items }) {
  return <ul className="cs-steps">{items.map(([b, t], i) => <li className="cs-li" key={i}><strong>{b}</strong> {t}</li>)}</ul>;
}
function MPlain({ items }) {
  return <ul className="cs-steps">{items.map((t, i) => <li className="cs-li" key={i}>{t}</li>)}</ul>;
}

/* ---- Mini-Inline-Wireframe-Primitive ---- */
function WireBox({ style: s, className: cn, children }) {
  return (
    <div style={{ background: "var(--bg-2)", border: "1px solid var(--line-2)", borderRadius: 3, ...s }}
      className={cn}>{children}</div>
  );
}
function WireBar({ w = "100%", h = 7, accent = false, style: s }) {
  return <div style={{ width: w, height: h, borderRadius: 2, background: accent ? "var(--accent)" : "var(--line-2)", marginBottom: 4, ...s }} />;
}
function WireLabel({ children, style: s }) {
  return <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".05em", color: "var(--ink-faint)", lineHeight: 1.3, ...s }}>{children}</div>;
}

/* Fünf Funnel-Richtungs-Karten */
const FUNNEL_DIRS = [
  {
    id: "A",
    title: "Quiz zuerst",
    pin: "Hauptansatz: erst Passung prüfen, dann entscheiden",
    layout: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 10px 8px" }}>
        <WireBar w="65%" h={8} accent />
        <WireBar w="80%" h={5} />
        <WireBar w="55%" h={5} />
        <WireBox style={{ padding: "7px 8px", marginTop: 4, border: "1px solid color-mix(in oklab, var(--accent) 50%, var(--line-2))" }}>
          <WireLabel>[ TEST MACHEN – 2 MIN. ]</WireLabel>
          <WireBar w="90%" h={14} accent style={{ marginTop: 5, borderRadius: 2 }} />
          <WireBar w="55%" h={8} style={{ marginTop: 3 }} />
        </WireBox>
        <WireBar w="35%" h={7} style={{ marginTop: 3 }} />
        <WireBar w="100%" h={1} style={{ marginTop: 6, marginBottom: 6 }} />
        <WireLabel>→ Ablauf → Preise</WireLabel>
      </div>
    ),
  },
  {
    id: "B",
    title: "Pakete zuerst",
    pin: "Konfigurator als Hero: Auswahl direkt im ersten Screen",
    layout: () => (
      <div style={{ display: "flex", gap: 6, padding: "10px 10px 8px" }}>
        <div style={{ flex: "1.1", display: "flex", flexDirection: "column", gap: 4 }}>
          <WireBar w="90%" h={7} accent />
          <WireBar w="70%" h={5} />
          <WireBar w="80%" h={5} />
          <WireBar w="50%" h={5} />
          <WireBar w="40%" h={9} style={{ marginTop: 4 }} />
        </div>
        <WireBox style={{ flex: 1, padding: "6px 7px", border: "1px solid color-mix(in oklab, var(--accent) 50%, var(--line-2))" }}>
          <WireLabel>KONFIGURIEREN</WireLabel>
          <WireBar w="100%" h={6} style={{ marginTop: 4 }} />
          <WireBar w="100%" h={6} />
          <WireBar w="60%" h={5} style={{ marginTop: 6 }} />
          <WireBar w="100%" h={11} accent style={{ marginTop: 4, borderRadius: 2 }} />
        </WireBox>
      </div>
    ),
  },
  {
    id: "C",
    title: "Drei Karten",
    pin: "Klassisches Pricing-Layout mit hervorgehobenem Kombi-Paket",
    layout: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 10px 8px" }}>
        <WireBar w="60%" h={8} accent style={{ margin: "0 auto 2px" }} />
        <WireBar w="80%" h={5} style={{ margin: "0 auto" }} />
        <div style={{ display: "flex", gap: 5, marginTop: 6 }}>
          {[false, true, false].map((hot, i) => (
            <WireBox key={i} style={{
              flex: 1, padding: "6px 5px",
              border: hot ? "1px solid color-mix(in oklab, var(--accent) 60%, var(--line-2))" : undefined,
              transform: hot ? "translateY(-4px)" : undefined
            }}>
              <WireBar w="80%" h={5} accent={hot} />
              <WireBar w="60%" h={4} style={{ marginTop: 3 }} />
              <WireBar w="70%" h={4} />
              <WireBar w="100%" h={8} accent={hot} style={{ marginTop: 5, borderRadius: 2 }} />
            </WireBox>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "D",
    title: "Experte / Editorial",
    pin: "Vertrauen zuerst: Profil, Service-Erklärung, Preise danach",
    layout: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 10px 8px" }}>
        <WireBar w="95%" h={7} accent />
        <WireBar w="85%" h={7} />
        <WireBar w="60%" h={7} />
        <WireBar w="100%" h={40} style={{ marginTop: 4, borderRadius: 3, background: "var(--line)" }} />
        <WireLabel style={{ marginTop: 4 }}>EXPERTENPROFIL + BIO</WireLabel>
        <WireBar w="100%" h={1} style={{ marginTop: 5, marginBottom: 4 }} />
        <WireLabel>→ Ablauf → Testimonials → Preise später</WireLabel>
      </div>
    ),
  },
  {
    id: "E",
    title: "Sticky Cart",
    pin: "Langer Inhalt links, fester Konfigurator rechts",
    layout: () => (
      <div style={{ display: "flex", gap: 6, padding: "10px 10px 8px" }}>
        <div style={{ flex: "1.5", display: "flex", flexDirection: "column", gap: 4 }}>
          <WireBar w="95%" h={7} accent />
          <WireBar w="75%" h={5} />
          <WireBar w="55%" h={5} />
          <WireBar w="100%" h={1} style={{ margin: "5px 0" }} />
          <WireLabel>Schritt 1 ↓ Schritt 2 ↓ Schritt 3 ↓</WireLabel>
          <WireBar w="100%" h={24} style={{ marginTop: 2 }} />
          <WireBar w="80%" h={24} />
        </div>
        <div style={{ flex: 1 }}>
          <WireBox style={{ padding: "6px 7px", border: "1px solid color-mix(in oklab, var(--accent) 50%, var(--line-2))" }}>
            <WireLabel>STICKY-WARENKORB</WireLabel>
            <WireBar w="100%" h={6} style={{ marginTop: 4 }} />
            <WireBar w="100%" h={6} />
            <WireBar w="70%" h={5} style={{ marginTop: 5 }} />
            <WireBar w="100%" h={11} accent style={{ marginTop: 4, borderRadius: 2 }} />
          </WireBox>
          <WireLabel style={{ marginTop: 5 }}>→ folgt dem Scroll</WireLabel>
        </div>
      </div>
    ),
  },
];

function FunnelDirCard({ dir, chosen }) {
  return (
    <Reveal className={"mg-fdir" + (chosen ? " mg-fdir--chosen" : " mg-fdir--rejected")} data-stamp={chosen ? undefined : "Verworfen"}>
      <div className="mg-fdir-head">
        <span className="mg-fdir-id">{dir.id}</span>
        <div>
          <div className="mg-fdir-title">{dir.title}</div>
          {chosen && <span className="tag tag-accent" style={{ fontSize: ".64rem", marginTop: ".3rem", display: "inline-block" }}>Finale Richtung</span>}
        </div>
      </div>
      <div className="mg-fdir-wire">
        <dir.layout />
      </div>
      <div className="mg-fdir-pin">{dir.pin}</div>
    </Reveal>
  );
}

/* ---- Storyboard der Test-Schritte ---- */
const QUIZ_STEPS = [
  { n: "Start", q: "Ist das Visum das Richtige für dich?", note: "4 Fragen · keine Anmeldung · ~2 Min", cta: "Starten →" },
  { n: "F1", q: "Wie alt bist du?", opts: ["Unter 45", "45 oder älter"] },
  { n: "F2", q: "Was machst du beruflich?", opts: ["Freelance – IT, Design, Lehre …", "Kleinunternehmen – Agentur, Schule …"] },
  { n: "F3", q: "Wie hoch ist dein monatliches Einkommen?", opts: ["Unter 1.500 €", "1.500–2.000 €", "Über 2.000 €"] },
  { n: "F4", q: "Hast du Kunden in Deutschland?", opts: ["Ja, habe ich", "Aktuell nicht"] },
  { n: "Ergebnis", q: "Ausgezeichnete Chancen!", note: "Buche eine kostenlose Beratung für mehr Infos", cta: "Jetzt buchen →", result: true },
];

function QuizFrame({ step }) {
  return (
    <div className={"mg-qframe" + (step.result ? " mg-qframe--result" : "")}>
      <div className="mg-qframe-n">{step.n}</div>
      <div className="mg-qframe-q">{step.q}</div>
      {step.note && <div className="mg-qframe-note">{step.note}</div>}
      {step.opts && (
        <div className="mg-qframe-opts">
          {step.opts.map((o, i) => <div className="mg-qframe-opt" key={i}>{o}</div>)}
        </div>
      )}
      {step.cta && <div className={"mg-qframe-cta" + (step.result ? " accent" : "")}>{step.cta}</div>}
    </div>
  );
}

/* ---- Hauptartikel ---- */
function MigroCase() {
  return (
    <div className="cs-view">

      {/* ── Hero ── */}
      <section className="cs-section cs-hero">
        <div className="cs-wrap">
          <div className="cs-kicker">
            <Reveal><MonoLabel>Fallstudie · MigroPlan</MonoLabel></Reveal>
            <Reveal as="span" className="mono-sm" style={{ color: "var(--ink-faint)" }}>· 2026 · 1,5 Tage · Kundenprojekt</Reveal>
          </div>
          <div className="ax-hero-grid">
            <Reveal className="ax-hero-text">
              <h1 className="cs-title">Visa-Support für Freelancer.<br /><span className="accent">Live in 36 Stunden.</span></h1>
              <p className="cs-sub">Eine mobile-first Landingpage für MigroPlan: mit klarem Funnel, Vorab-Check und Cal.eu-Terminbuchung.</p>
              <p className="cs-lead">
                MigroPlan unterstützt Freelancer bei der Vorbereitung ihres Antrags für ein Visum zur selbständigen Tätigkeit in Deutschland. Vor dem Projekt lief der Service hauptsächlich über Telegram. Ziel war daher ein klarer Web-Einstieg, der das Angebot erklärt, Anfragen vorqualifiziert und passende Interessenten zur Beratung führt.
              </p>
              <p className="cs-lead">
                Ich habe den Funnel aufgebaut, die Seitenstruktur entwickelt, die zentrale UX-Copy geschärft, das mobile-first Interface gestaltet und den Booking-Flow angebunden. KI-gestützte Exploration half dabei, mehrere Richtungen schnell zu vergleichen. Die finale Seite wurde jedoch entlang der Prioritäten des Kunden und der praktischen Anforderungen des Services ausgearbeitet.
              </p>
              <div className="ax-skip-wrap" style={{ display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
                <a href="https://migroplan.com/" target="_blank" rel="noopener noreferrer" className="btn btn-accent ax-skip-btn" data-hot>
                  Live ansehen
                  <span className="btn-arrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </span>
                </a>
                <a href="#funnel" className="btn ax-skip-btn" data-hot>
                  Direkt zum Prozess
                  <span className="btn-arrow btn-arrow--down">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M6 13l6 6 6-6" />
                    </svg>
                  </span>
                </a>
              </div>
            </Reveal>
            <Reveal className="ax-hero-media">
              <LiveShot
                src={MS + "hero.png"}
                alt="MigroPlan Landingpage – Hero"
                caption={<><strong>Die finale Hero Section.</strong> Da sie den ersten Entscheidungspunkt des Landing-Funnels trägt, floss ein großer Teil von Research und Iteration in die richtige Positionierung.</>}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="cs-section gm-stats-sec">
        <div className="cs-wrap">
          <div className="gm-statband mg-statband">
            <MigroStat pre="<" to={36} suf=" Std." label="VOM BRIEFING ZUM LAUNCH" />
            <MigroStat to={5} label="FUNNEL-ANSÄTZE VERGLICHEN" />
            <MigroStat to={3} label="QUIZ-PFADE KONZIPIERT" />
            <MigroStat to={2} label="BOOKING-FLOWS ANGEBUNDEN" />
          </div>
        </div>
      </section>

      {/* ── Nutshell ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h2 className="cs-h">Projekt auf einen Blick</h2></div>
          <Reveal className="cs-meta">
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Meine Rolle</div>
              <div className="cs-meta-v">Funnel-Strategie, Landing-UX, UI-Design, zweisprachige UX-Texte und Unterstützung bei der Umsetzung</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Zeitrahmen</div>
              <div className="cs-meta-v">1,5 Tage vom ersten Wireframe bis zum Launch</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Stack &amp; Tools</div>
              <div className="cs-meta-v">HTML / CSS / JS, Cal.eu, individuelles Eignungsquiz, RU/EN-i18n, Claude für Konzeptarbeit und schnelle Umsetzung</div>
            </div>
          </Reveal>
          <Reveal className="cs-chips cs-mt-m" style={{ justifyContent: "center" }}>
            {["Funnel-Design", "Landingpage-UX", "Zweisprachiges UI (RU/EN)", "Conversion-Architektur", "Cal.eu-Integration", "Interaktiver Test", "AI-gestützter Sprint"].map((c) => (
              <span className="tag" key={c}>{c}</span>
            ))}
          </Reveal>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel">
              <h4>Was ich umgesetzt habe</h4>
              <MPlain items={[
                "Ein zweisprachiger Landing-Funnel auf Russisch und Englisch",
                "Mobile-first Layouts, parallel zur Desktop-Version konzipiert",
                "Ein 4-Fragen-Check zur Vorqualifizierung mit sofortigem Ergebnis und passenden CTAs",
                "Cal.eu-Terminbuchung für kostenlose Erstgespräche und bezahlte Beratungen",
                "Preise, Paketvergleich, FAQ und SEO-Content in beiden Sprachen",
              ]} />
            </Reveal>
            <Reveal className="cs-panel cs-panel-accent">
              <h4>Ergebnis</h4>
              <MPlain items={[
                "Aus einem Telegram-basierten Service wurde ein klarer Web-Einstieg",
                "Besucher konnten das Angebot verstehen, bevor sie eine Beratung anfragten",
                "Das Quiz trennte passende Anfragen von weniger relevanten Leads",
                "Die Terminbuchung wechselte vom manuellen Chat in einen strukturierten Cal.eu-Flow",
                "Die komplette RU/EN-Landingpage ging in unter 36 Stunden live",
              ]} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Context & Brief ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Kontext &amp; Briefing</h3></div>
          <div className="cs-grid2 mg-ctx-grid">
            <div className="mg-ctx-col">
              <Reveal>
                <h4 className="gm-subh" style={{ marginTop: 0 }}>Das UX-Problem</h4>
                <p className="cs-p">
                  MigroPlan unterstützt Freelancer bei der Vorbereitung eines Visums zur selbständigen Tätigkeit in
                  Deutschland: Businessplan, Finanzplanung, Dokumentenstruktur und Schritt-für-Schritt-Begleitung,
                  bevor der Antrag bei den Behörden landet. Der Service ist kein allgemeiner Visa-Blog und keine
                  Anwaltskanzlei. Diese Abgrenzung musste auf der Seite schnell klar werden.
                </p>
                <p className="cs-p">
                  Die zentrale Herausforderung lag bei Vertrauen und Passung. Besucher mussten verstehen, ob der Service
                  zu ihrem Beruf passt, was sie konkret bekommen und ob eine Beratung für sie überhaupt sinnvoll ist.
                  Gleichzeitig sollte nicht jede neugierige Anfrage direkt im Kalender landen. Der Funnel musste erklären,
                  vorqualifizieren und zur Buchung führen, ohne die Seite in einen langen Rechtstext zu verwandeln.
                </p>
              </Reveal>
              <Reveal className="ax-success ax-success-compact">
                <div className="ax-sub5" style={{ marginBottom: ".7rem" }}>Was der Kunde priorisieren wollte</div>
                <div className="ax-questions ax-questions-tight">
                  <p className="ax-q">„Beratung buchen – <span className="accent">die Leute sollen in den Call kommen.</span>"</p>
                  <p className="ax-q">„Das <span className="accent">Kombi-Paket</span> als Standardoption zeigen."</p>
                  <p className="ax-q">„Unpassende Anfragen <span className="accent">früh herausfiltern.</span>"</p>
                </div>
                <p className="ax-success-note">
                  Diese Prioritäten haben wir abgestimmt, bevor ich am Layout gearbeitet habe. Daraus ergab sich die
                  Richtung des Funnels: zuerst zeigen, für wen der Service geeignet ist, dann den Ablauf erklären,
                  über den Check vorqualifizieren und passende Interessenten zur Buchung führen.
                </p>
              </Reveal>
            </div>
            <div className="mg-ctx-col">
              <Reveal className="ax-hero-media mg-ctx-media">
                <LiveShot
                  src={MS + "funnel-entry.png"}
                  pos="top center"
                  alt="MigroPlan – für wen das Visum infrage kommt und wie der 4-Schritte-Prozess funktioniert"
                  caption={<>Die Zielgruppen- und Prozessbereiche wurden zum Rückgrat der Seite: zuerst die Passung klären, dann den Ablauf in vier Schritten verständlich machen.</>}
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Funnel Architecture ── */}
      <section className="cs-section" id="funnel">
        <span className="ax-anchor" aria-hidden="true"></span>
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Funnel-Architektur: fünf Ansätze</h3></div>
          <p className="cs-p">
            Vor der Umsetzung habe ich fünf strukturell unterschiedliche Landing-Funnel ausgearbeitet. Jeder Ansatz
            testete eine andere erste Entscheidung: Startet der Nutzer mit einem Quiz, sieht er zuerst das Angebot,
            vergleicht er Pakete, baut die Seite Vertrauen über redaktionellen Content auf oder führt sie direkt in
            eine konfigurierbare Service-Strecke?
          </p>
          <p className="cs-p" style={{ marginTop: ".9rem" }}>
            Für jedes Konzept entstanden ein Lo-Fi-Wireframe und eine kurze Hypothese. Mit Claude im Workflow ließ
            sich diese Explorationsphase an einem Abend statt über mehrere Tage erledigen. Am Ende lagen alle fünf
            Richtungen, eine klare Empfehlung und die passende Begründung dafür vor.
          </p>

          <div className="mg-fdirs cs-mt-l" data-deselect="stamp">
            {FUNNEL_DIRS.map((d) => (
              <FunnelDirCard key={d.id} dir={d} chosen={d.id === "A"} />
            ))}
          </div>

          <Reveal className="cs-panel cs-panel-accent cs-mt-l">
            <h4>Warum Richtung A gewonnen hat</h4>
            <p className="cs-p" style={{ marginTop: ".6rem" }}>
              Die wichtigste Priorität des Kunden war, unpassende Anfragen auszusortieren, bevor sie im Kalender
              landen. Richtung A setzt diesen Filter direkt an den Anfang des Funnels: Das Quiz wird zur Hero Section,
              während Pakete und Preise eine Entscheidungsebene tiefer liegen. Besucher, die schon genau wissen, was
              sie brauchen, haben trotzdem einen direkten Weg zum Angebot – mit klaren Paketen, Leistungsumfang und Preisen.
            </p>
            <p className="cs-p" style={{ marginTop: ".8rem" }}>
              So funktioniert der Funnel für beide Gruppen. Unsichere Besucher können zuerst prüfen, ob der Service für
              sie sinnvoll ist. Passende Interessenten kommen mit einem klareren Gefühl für ihre Chancen zur Buchung,
              während weniger relevante Anfragen früh einen ehrlicheren nächsten Schritt erhalten.
            </p>
            <p className="cs-p" style={{ marginTop: ".8rem" }}>
              B und E würden besser zu einem shopartigen Produkt mit wiederkehrenden Käufen passen. C war die sichere
              Standardlösung für eine Service-Seite. D bräuchte eine stärkere Personenmarke dahinter. Für einen neuen
              Service in einem Bereich, in dem Nutzer vor der Entscheidung Vertrauen und Orientierung brauchen, war
              A die richtige Richtung.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Turning the funnel into a page ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Vom gewählten Funnel zur fertigen Seite</h3></div>

          <div className="mg-stageflow cs-mt-l">
            <div className="mg-stage">
              <span className="mg-stage-n">01 · Einstieg</span>
              <span className="mg-stage-t">Ein klares Versprechen</span>
              <span className="mg-stage-d">Vorbereitung für einen stärkeren Antrag auf das Freelancer-Visum in Deutschland.</span>
            </div>
            <div className="mg-stage">
              <span className="mg-stage-n">02 · Passung</span>
              <span className="mg-stage-t">Für wen es passt</span>
              <span className="mg-stage-d">Nennt die Berufe, für die der Service gebaut ist, damit Besucher sehen, ob das Angebot für sie gilt.</span>
            </div>
            <div className="mg-stage mg-stage--gate">
              <span className="mg-stage-n">03 · Vorqualifizierung</span>
              <span className="mg-stage-t">Eignungscheck</span>
              <span className="mg-stage-d">Ein kurzer Check trennt starke Profile, Grenzfälle und unpassende Anfragen — und leitet jeden zum passenden nächsten Schritt.</span>
            </div>
            <div className="mg-stage">
              <span className="mg-stage-n">04 · Vergleich</span>
              <span className="mg-stage-t">Preise</span>
              <span className="mg-stage-d">Das Kombi-Paket ist die Standardoption; die alternativen Pakete daneben machen Preis und Umfang vergleichbar.</span>
            </div>
            <div className="mg-stage">
              <span className="mg-stage-n">05 · Buchung</span>
              <span className="mg-stage-t">Beratung</span>
              <span className="mg-stage-d">Kostenlose und bezahlte Beratungen führen in getrennte Cal.eu-Eventtypen, ein bis zwei Klicks von den wichtigsten CTAs entfernt.</span>
            </div>
          </div>

          {/* eligibility quiz */}
          <Reveal className="cs-mt-l">
            <h4 className="gm-subh" style={{ marginTop: 0 }}>Der Eignungscheck</h4>
            <p className="cs-p">
              Der Check gibt Besuchern vor der Buchung eine erste Orientierung: Passt dieser Visumsweg zu ihrem
              Fall, und welcher nächste Schritt ist sinnvoll? Das Ergebnis kommt zuerst. Kontaktdaten werden erst
              danach abgefragt, wenn der Nutzer bereits eine konkrete Empfehlung erhalten hat.
            </p>
          </Reveal>
          <Reveal className="cs-panel cs-mt-m">
            <div className="ax-sub5" style={{ marginBottom: ".7rem" }}>Design-Logik</div>
            <MKL items={[
              ["Nur 4 Fragen:", "Alter, Tätigkeit, Einkommen und Kunden in Deutschland."],
              ["3 Ergebnispfade:", "starkes Profil, Sonderfall oder falscher Visumsweg."],
              ["Erst Ergebnis, dann Kontakt:", "Kontaktdaten werden erst nach der Empfehlung abgefragt."],
              ["Modal-Flow:", "Der Check öffnet sich über der Landingpage und bringt Nutzer danach an dieselbe Scrollposition zurück."],
            ]} />
          </Reveal>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal>
              <LiveShot
                src={MS + "quiz-q1.png"}
                alt="MigroPlan-Eignungscheck – erste Frage"
                caption={<>Der Check öffnet sich als Modal über der Seite: eine Frage pro Schritt, sichtbarer Fortschritt, keine Registrierung.</>}
              />
            </Reveal>
            <Reveal>
              <LiveShot
                src={MS + "quiz-result.png"}
                alt="MigroPlan-Eignungscheck – Ergebnis"
                caption={<>Das Ergebnis führt direkt zum nächsten Schritt: In diesem Beispiel landet ein starkes Profil bei der kostenlosen Erstberatung.</>}
              />
            </Reveal>
          </div>

          {/* pricing and booking */}
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel cs-panel-accent">
              <h4>Preise und Buchung</h4>
              <p className="cs-p" style={{ marginTop: ".6rem" }}>
                Der Pricing-Block folgt derselben Funnel-Logik. Das Kombi-Paket steht visuell klar im Vordergrund,
                während die einzelnen Dokumente daneben den Vergleich erleichtern und den Gesamtumfang des Pakets greifbarer machen.
              </p>
              <p className="cs-p" style={{ marginTop: ".8rem" }}>
                Von dort bleibt der Weg zur Buchung kurz: Quiz-Ergebnis, Pricing-Karten und Beratungs-CTAs führen alle zu
                Cal.eu. Die kostenlose 15-Minuten-Erstberatung und die bezahlte 60-Minuten-Beratung laufen über getrennte
                Eventtypen, sodass jede Buchung von Anfang an richtig zugeordnet ist.
              </p>
            </Reveal>
            <Reveal>
              <LiveShot
                src={MS + "funnel-pricing.png"}
                alt="MigroPlan – Preispakete"
                caption={<>Das Kombi-Paket trägt den stärksten CTA; die einzelnen Dokumente daneben machen seinen Wert nachvollziehbar.</>}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Mobile-first ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Für Mobile gedacht</h3></div>
          <p className="cs-p">
            Dem Kunden und mir war von Anfang an klar, dass die Seite wahrscheinlich vor allem auf dem Smartphone geöffnet wird: aus einem Telegram-Chat, über einen Link oder über eine schnelle Suche. Deshalb war Mobile der wichtigste Bezugspunkt.
          </p>
          <p className="cs-p" style={{ marginTop: ".8rem" }}>
            Das hat die gesamte Oberfläche geprägt. Die Blöcke bleiben schmal und leicht zu scannen. Die Texte sind kompakt gehalten. Jeder Abschnitt konzentriert sich auf eine klare Aussage, statt zu viel Information auf einen kleinen Bildschirm zu pressen. Auch die Farbpalette ist bewusst einfach, damit rote CTAs und wichtige Akzente sichtbar bleiben, ohne die Seite unruhig wirken zu lassen.
          </p>
          <p className="cs-p" style={{ marginTop: ".8rem" }}>
            Auch die Integrationen wurden mit Blick auf mobile Nutzung geprüft. Der Test öffnet sich direkt auf der Seite, Cal.eu ermöglicht die Buchung ohne unnötige Zwischenschritte, und der zentrale Telegram-Button führt direkt in die mobile App.
          </p>

          <div className="mg-phones cs-mt-l">
            <MobileShot
              src={MS + "mobile-hero.png"}
              alt="MigroPlan mobile – Hero"
              caption={<>Ein kompakter erster Screen: kurze Copy, ein klarer Haupt-CTA und ein Telegram-Button, der auf dem Smartphone direkt funktioniert.</>}
            />
            <MobileShot
              src={MS + "mobile-steps.png"}
              alt="MigroPlan mobile – So funktioniert es"
              caption={<>Der Prozess wird zu einem schmalen vertikalen Flow: vier Schritte in einer Spalte, gut lesbar auf einem kleinen Screen.</>}
            />
          </div>

          <Reveal className="cs-panel cs-panel-accent cs-mt-l">
            <h4>Mobiler Fix nach dem Launch</h4>
            <p className="cs-p" style={{ marginTop: ".6rem" }}>
              Nach dem Launch habe ich die Seite auf echten Smartphones geprüft und ein Layout-Problem im Header gefunden. Auf sehr schmalen Screens nahm der volle <span className="mg-tgchip">Telegram</span>-Button zu viel Platz ein und verschob die Header-Elemente.
            </p>
            <p className="cs-p" style={{ marginTop: ".8rem" }}>
              Für Mobile habe ich den Button deshalb auf das Telegram-Icon reduziert. Der Button blieb klar erkennbar, der Link öffnet weiterhin direkt Telegram, und der Header bleibt jetzt auch auf kleineren Screens stabil. Die Icon-only-Version ist in den mobilen Screenshots oben zu sehen.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── AI-Assisted Sprint ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Wie ich Claude im Sprint eingesetzt habe</h3></div>
          <p className="cs-p">
            Ich habe Claude während des 36-Stunden-Sprints durchgehend genutzt: zuerst für die Ausarbeitung möglicher Richtungen, danach für Copy, Layout-Entscheidungen und schnelle Build-Iterationen. Der Ablauf blieb trotzdem ein normaler Kundenprozess: fester Zeitrahmen, klares Geschäftsziel und ein Kunde, der genau wusste, was die Seite leisten sollte.
          </p>
          <ol className="ax-steps cs-mt-l">
            {[
              ["Funnel-Ideen · Stunden 0–4.", "Ich gab Claude den Service-Kontext, die Zielgruppe und meine erste Designrichtung und habe damit mehrere mögliche Landing-Funnel ausgearbeitet. Am Ende des ersten Abends standen fünf Optionen, jeweils mit einer anderen ersten Entscheidung für den Besucher, und eine Richtung, die ich empfehlen konnte."],
              ["Kundenabstimmung · Stunde 5.", "Wir hatten einen etwa halbstündigen Call. Dabei haben wir festgelegt, welche Services besonders sichtbar sein sollen, das Kombi-Paket als Standardangebot bestätigt und entschieden, dass der Test vor der Terminbuchung vorqualifizieren soll. Da die fünf Richtungen bereits vorbereitet waren, blieb das Gespräch kurz und konkret."],
              ["Copy · Stunden 6–18.", "Nach der Positionierung habe ich die Texte Abschnitt für Abschnitt geschrieben und überarbeitet. Russisch und Englisch entstanden als zwei eigene Fassungen, jeweils mit eigenem Rhythmus und leicht anderer Gewichtung."],
              ["Build und Feinschliff · Stunden 18–30.", "Danach ging es um Layout, Quiz-Routing, i18n-Struktur und mobile Breakpoints. Feedback floss direkt in die nächste Version ein, dadurch blieb der Sprint eng getaktet und ohne lange Pausen zwischen den Iterationen."],
              ["Launch · Stunden 30–36.", "Zum Schluss kamen Domain, Deployment, letzte Textkorrekturen in beiden Sprachen und die Cal.eu-Eventtypen dazu. Am zweiten Abend war die Seite live."],
            ].map(([b, t], i) => (
              <li className="ax-step" key={i}>
                <span className="ax-step-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="ax-step-t"><strong>{b}</strong> {t}</span>
              </li>
            ))}
          </ol>


        </div>
      </section>

      {/* ── Tech stack ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Technische Highlights</h3></div>
          <div className="ax-dsys">
            <Reveal className="cs-panel">
              <h4>Statischer Build</h4>
              <MKL items={[
                ["Die Landingpage läuft als statischer HTML/CSS/JS-Build.", "Beide Sprachversionen – RU und EN – liegen in derselben Datei."],
                ["Der Sprachwechsel passiert clientseitig über eine kleine i18n-Key-Map.", "Formatierte Textbausteine sind separat abgelegt, damit die roten Keyword-Akzente auch nach dem Sprachwechsel erhalten bleiben."],
                ["Ich habe den Aufbau bewusst schlank gehalten:", "kein Framework, kein Build-Step und nichts, was nach der Übergabe zusätzlich gepflegt werden muss."],
              ]} />
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Eigene Quiz-Logik</h4>
              <MKL items={[
                ["Der Eignungscheck ist in Vanilla JS gebaut:", "vier Fragen, drei Ergebnispfade und ein Modal."],
                ["Das Routing prüft Tätigkeit, Einkommensniveau und Kunden in Deutschland.", "Ein einfacher Score steuert die Anzeige im Ergebnis und entscheidet, welchen Result-Screen der Nutzer sieht."],
                ["Jedes Ergebnis hat einen eigenen CTA,", "der mit dem passenden Cal.eu-Eventtyp verlinkt ist."],
              ]} />
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Cal.eu-Buchung</h4>
              <MKL items={[
                ["Die Buchung läuft über Cal.eu, die EU-gehostete Instanz von Cal.com.", "Die Integration war einfach, leichtgewichtig genug für eine statische Landingpage und hat die Buchungslogik des Projekts ohne zusätzlichen Overhead abgedeckt."],
                ["Kostenlose 15-Minuten-Erstgespräche und bezahlte 60-Minuten-Beratungen nutzen getrennte Eventtypen,", "sodass jede Buchung von Anfang an mit dem richtigen Kontext ankommt."],
                ["Die wichtigsten CTAs führen in wenigen Klicks zu einem freien Termin.", "Die bezahlte Beratung wird außerdem auf das Kombi-Paket angerechnet."],
              ]} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Learnings ── */}
      <section className="cs-section">
        <div className="cs-prose">
          <div className="cs-head" style={{ justifyContent: "center" }}><h3 className="cs-h">Learnings</h3></div>
          <p className="cs-p" style={{ textAlign: "center" }}>
            Ein paar Dinge, die ich im nächsten Sprint wieder so machen würde:
          </p>
          <ul className="cs-steps cs-mt-m">
            {[
              ["Mit einer klaren Empfehlung ins Kundengespräch gehen.", "Die fünf vorbereiteten Funnel-Richtungen haben den ersten Call deutlich einfacher gemacht. Wir mussten nicht bei abstrakten Fragen anfangen, sondern konnten konkrete Optionen vergleichen, über Trade-offs sprechen und schnell entscheiden, welche Richtung am meisten Sinn ergibt."],
              ["Klar sagen, wenn der Service nicht passt.", "Der Test versucht nicht, jeden Besucher im Funnel zu halten. Wenn jemand eher ein Gewerbe-Visum braucht oder die grundlegende Einkommensgrenze nicht erreicht, sagt die Seite das offen und zeigt einen sinnvolleren nächsten Schritt. Das macht den Service hilfreicher und erspart beiden Seiten einen unnötigen Call."],
              ["Mobile Details früh mitdenken.", "Das mobile Layout war schon im ersten Design-Durchlauf Teil der Arbeit. Deshalb blieben die Fixes nach dem Launch überschaubar: ein Button-Label, ein paar Abstände, hier und da ein Breakpoint. Die Seite musste nach dem Test auf echten Smartphones nicht neu gedacht werden."],
              ["Den Zeitrahmen als Filter nutzen.", "Bei 36 Stunden vom Briefing bis zum Launch musste jeder Abschnitt seinen Platz rechtfertigen. Die Seite ging mit den Bausteinen live, die der Service wirklich brauchte: Angebot, Passung, Test, Pakete, Buchung und FAQ. Der enge Zeitrahmen hat geholfen, die Landingpage fokussiert zu halten."],
            ].map(([b, t], i) => <li className="cs-li" key={i}><strong>{b}</strong> {t}</li>)}
          </ul>
        </div>
      </section>

    </div>
  );
}

Object.assign(window, { MigroCase });
