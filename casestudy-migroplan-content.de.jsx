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
    title: "Test zuerst",
    pin: "Haupt-Hook = erst Chancen prüfen, dann kaufen",
    layout: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 10px 8px" }}>
        <WireBar w="65%" h={8} accent />
        <WireBar w="80%" h={5} />
        <WireBar w="55%" h={5} />
        <WireBox style={{ padding: "7px 8px", marginTop: 4, border: "1px solid color-mix(in oklab, var(--accent) 50%, var(--line-2))" }}>
          <WireLabel>[ TEST STARTEN – 2 MIN ]</WireLabel>
          <WireBar w="90%" h={14} accent style={{ marginTop: 5, borderRadius: 2 }} />
          <WireBar w="55%" h={8} style={{ marginTop: 3 }} />
        </WireBox>
        <WireBar w="35%" h={7} style={{ marginTop: 3 }} />
        <WireBar w="100%" h={1} style={{ marginTop: 6, marginBottom: 6 }} />
        <WireLabel>→ So funktioniert's → Preise</WireLabel>
      </div>
    ),
  },
  {
    id: "B",
    title: "Shop zuerst",
    pin: "Konfigurator als Hero – Kauf schon auf Screen 1",
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
    title: "3 Karten",
    pin: "Klassische Preis-Karten – mittlere hervorgehoben",
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
    pin: "Vertrauen zuerst – Produkt erst nach dem Warm-up",
    layout: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 10px 8px" }}>
        <WireBar w="95%" h={7} accent />
        <WireBar w="85%" h={7} />
        <WireBar w="60%" h={7} />
        <WireBar w="100%" h={40} style={{ marginTop: 4, borderRadius: 3, background: "var(--line)" }} />
        <WireLabel style={{ marginTop: 4 }}>EXPERTEN-PORTRÄT + BIO</WireLabel>
        <WireBar w="100%" h={1} style={{ marginTop: 5, marginBottom: 4 }} />
        <WireLabel>→ So funktioniert's → Stimmen → Preise (spät)</WireLabel>
      </div>
    ),
  },
  {
    id: "E",
    title: "Sticky-Warenkorb",
    pin: "Inhalt links scrollt, Konfigurator rechts bleibt sticky",
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
    <Reveal className={"mg-fdir" + (chosen ? " mg-fdir--chosen" : "")}>
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
            <Reveal><MonoLabel>Fallstudie · 02 – MigroPlan</MonoLabel></Reveal>
            <Reveal as="span" className="mono-sm" style={{ color: "var(--ink-faint)" }}>2025 · 1,5 Tage · Kundenprojekt</Reveal>
          </div>
          <div className="ax-hero-grid">
            <Reveal className="ax-hero-text">
              <h1 className="cs-title">Visa-Hilfe für Freelancer.<br /><span className="accent">Live in 36 Stunden.</span></h1>
              <p className="cs-sub">Funnel-Architektur, ein Express-Visa-Test und Cal.eu-Buchung für MigroPlan – mobile-first gebaut und in eineinhalb Tagen ausgeliefert</p>
              <p className="cs-lead">
                MigroPlan hilft Freelancern, eine starke Bewerbung für das deutsche Visum zur selbstständigen Tätigkeit vorzubereiten.
                Der Service existierte bereits und lief über Telegram – er brauchte schnell eine Web-Präsenz.
                Ich kam mit einem Design-Konzept herein, nutzte Claude, um fünf Funnel-Richtungen zu erkunden,
                stimmte die Prioritäten mit dem Kunden ab und schliff die Seite Schritt für Schritt aus.
                Die Seite ging in unter 36 Stunden live.
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
                  <span className="btn-arrow">
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
                caption={<><strong>Die Produktionsseite, englischer Build.</strong> Zum Vergrößern klicken oder migroplan.com öffnen, um sie live zu sehen.</>}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="cs-section gm-stats-sec">
        <div className="cs-wrap">
          <div className="gm-statband mg-statband">
            <MigroStat pre="<" to={36} suf=" Std." label="Vom Brief bis live" />
            <MigroStat to={5} label="Funnel-Richtungen erkundet" />
            <MigroStat to={3} label="Ergebnispfade im Test" />
            <MigroStat to={2} label="Sprachen beim Launch (RU / EN)" />
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
              <div className="cs-meta-v">UX-Konzept, Funnel-Architektur, UI-Design, RU/EN-Microcopy und technische Integrationen – end-to-end</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Zeitrahmen</div>
              <div className="cs-meta-v">1,5 Tage vom ersten Wireframe bis zum Produktions-Deploy</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Stack &amp; Tools</div>
              <div className="cs-meta-v">Vanilla HTML / CSS / JS, mobile-first, Cal.eu-Buchung, eigene Test-Engine, RU/EN-i18n, Claude für die Ideenfindung</div>
            </div>
          </Reveal>
          <Reveal className="cs-chips cs-mt-m" style={{ justifyContent: "center" }}>
            {["Funnel-Design", "Landingpage-UX", "Zweisprachiges UI (RU/EN)", "Conversion-Architektur", "Cal.eu-Integration", "Interaktiver Test", "AI-gestützter Sprint"].map((c) => (
              <span className="tag" key={c}>{c}</span>
            ))}
          </Reveal>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel">
              <h4>Was ich ausgeliefert habe</h4>
              <MPlain items={[
                "Komplette Funnel-Landingpage – Russisch und Englisch in einem Build",
                "Natives Mobile-Layout, im selben Durchgang wie Desktop gezeichnet",
                "Express-Test der Visa-Chancen – 4 Fragen, sofortiges Ergebnis, passende CTA",
                "Cal.eu-Buchung für kostenlose und kostenpflichtige Beratungen",
                "Preise mit Paketvergleich, dazu FAQ und SEO-Artikel in beiden Sprachen",
              ]} />
            </Reveal>
            <Reveal className="cs-panel cs-panel-accent">
              <h4>Ergebnis</h4>
              <MPlain items={[
                "Live in unter 36 Stunden ab dem ersten Wireframe",
                "RU / EN-Umschaltung ohne Reload und ohne Layout-Sprünge",
                "Unpassende Leads vom Test umgeleitet, noch vor dem Kalender",
                "Buchung in 2 Klicks: CTA → Cal.eu-Embed",
                "Prioritäten und Positionierung vor jeder Zeile Code mit dem Kunden bestätigt",
              ]} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Context & Brief ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Kontext &amp; Briefing</h3></div>
          <div className="cs-grid2 ax-equal">
            <Reveal>
              <h4 className="gm-subh" style={{ marginTop: 0 }}>Der Service</h4>
              <p className="cs-p">
                Das deutsche Freiberufler-Visum ist einer der realistischsten Wege für IT-Fachleute, Designer,
                Lehrkräfte und Übersetzer aus Drittstaaten, um legal in Deutschland zu leben und zu arbeiten. Der Antrag
                steht und fällt mit den Unterlagen – einem Businessplan, einer Finanzprognose und einem Dokumentenpaket
                in genau der Form, die die Behörden erwarten. Genau diese Vorbereitung verkauft der Kunde.
              </p>
              <p className="cs-p">
                Der Service funktionierte bereits – echte Kunden, echte Zusagen –, lief aber komplett über Telegram und
                Mundpropaganda, ohne irgendetwas, das man einem neuen Lead zeigen konnte, der sich erst einmal informieren
                wollte. Das Briefing: eine Landingpage, die das Angebot erklärt, genug Vertrauen für einen Termin aufbaut
                und Menschen, zu denen das Visum nicht passt, ehrlich abweist – und das ohne Raum für einen wochenlangen Prozess.
              </p>
            </Reveal>
            <Reveal className="ax-hero-media mg-ctx-media">
              <LiveShot
                src={MS + "funnel-entry.png"}
                pos="top center"
                alt="MigroPlan – für wen das Visum ist und der 4-Schritte-Prozess"
                caption={<><strong>Die Zielgruppe, direkt auf der Seite benannt.</strong> „Für wen" listet die Berufe auf, zu denen das Visum passt, dann legt „So funktioniert's" den vierstufigen Weg dar – das Rückgrat, dem das ganze Briefing dienen musste.</>}
              />
            </Reveal>
          </div>

          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="ax-success ax-success-compact" style={{ margin: 0 }}>
              <div className="ax-sub5" style={{ marginBottom: ".7rem" }}>Was der Kunde priorisieren wollte</div>
              <div className="ax-questions ax-questions-tight">
                <p className="ax-q">„Beratungsbuchung – <span className="accent">bring sie ans Telefon.</span>"</p>
                <p className="ax-q">„Zeig das <span className="accent">Kombi-Paket</span> als Standardoption."</p>
                <p className="ax-q">„Filter früh die Leute heraus, die <span className="accent">nicht passen.</span>"</p>
              </div>
              <p className="ax-success-note">
                Diese Prioritäten gingen wir in einem Call durch, bevor ich das Layout anrührte. Dieses Gespräch
                wählte die Funnel-Richtung und sparte mindestens eine ganze Iteration.
              </p>
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Arbeitstitel → finaler Name</h4>
              <p className="cs-p">
                Das Projekt startete als <strong>Freiberufler·Weg</strong> – ein korrektes deutsches Label und ein
                Zungenbrecher, an dem die halbe Zielgruppe hängen bleiben würde. <strong>MigroPlan</strong> gewann,
                weil es die Checks besteht, die hier zählen:
              </p>
              <div className="cs-mt-m">
                <MKL items={[
                  ["Liest sich auf Russisch und Englisch gleich", "– keine Transliterations-Stolpersteine in beide Richtungen."],
                  ["Sagt, was es tut", "– Migration plus ein Plan, ohne Erklärung verständlich."],
                  ["Kurz genug", "für ein Logo, eine Domain und einen Telegram-Handle."],
                ]} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Funnel Architecture ── */}
      <section className="cs-section" id="funnel">
        <span className="ax-anchor" aria-hidden="true"></span>
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Funnel-Architektur: Fünf Richtungen</h3></div>
          <p className="cs-p">
            Vor jeder Zeile Produktionscode skizzierte ich fünf strukturell unterschiedliche Funnels – jeder eine
            andere Wette darauf, wo die Aufmerksamkeit des Besuchers zuerst landen soll und wie früh er einen Preis
            sieht. Jede Richtung bekam ein Lo-Fi-Wireframe und eine einzeilige Hypothese.
          </p>
          <p className="cs-p" style={{ marginTop: ".9rem" }}>
            Dieser Durchgang kostete einen Abend mit Claude statt der üblichen mehreren Tage – und genau hier half
            die KI am meisten. Als ich in den Call mit dem Kunden ging, hatte ich alle fünf kartiert, einen klaren
            Favoriten und die Begründung parat.
          </p>

          <div className="mg-fdirs cs-mt-l">
            {FUNNEL_DIRS.map((d) => (
              <FunnelDirCard key={d.id} dir={d} chosen={d.id === "A"} />
            ))}
          </div>

          <Reveal className="cs-panel cs-panel-accent cs-mt-l">
            <h4>Warum Richtung A gewann</h4>
            <p className="cs-p" style={{ marginTop: ".6rem" }}>
              Die oberste Priorität des Kunden war es, Leads zu filtern, bevor sie auf den Kalender treffen – und
              Richtung A stellt genau diesen Filter in den Mittelpunkt: Der Test ist der Hero, das Produkt sitzt
              eine Entscheidung tiefer. Besucher, zu denen das Visum nicht passt, bekommen eine ehrliche Antwort und
              einen anderen nächsten Schritt, bevor sie überhaupt die Preise sehen. Wer passt, kommt bei der Buchung
              an und kennt seine Chancen bereits – die Calls starten wärmer und laufen kürzer.
            </p>
            <p className="cs-p" style={{ marginTop: ".8rem" }}>
              B und E würden zu einem Shop mit Wiederholungskäufen passen; C ist der sichere Standard für ein
              Dienstleistungsgeschäft; D braucht einen Experten mit etablierter Personenmarke. Für einen neuen Namen
              in einem Feld, in dem die Zielgruppe erst Aufklärung braucht, bevor sie sich bindet, war A die richtige Wahl.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Funnel in production ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Den Funnel hinunter, in Produktion</h3></div>
          <p className="cs-p">
            Richtung A auf einer echten Seite. Das Wireframe versprach einen Funnel, der qualifiziert, bevor er
            verkauft – hier ist, wie jede Stufe im ausgelieferten Build aussieht und was jede leise mit dem Besucher
            macht, während er sie hinuntergeht.
          </p>

          <div className="mg-stageflow cs-mt-l">
            <div className="mg-stage">
              <span className="mg-stage-n">01 · Ankommen</span>
              <span className="mg-stage-t">Ein Versprechen</span>
              <span className="mg-stage-d">Der Hero macht ein einziges Angebot: eine starke Freelance-Visa-Bewerbung für Deutschland.</span>
            </div>
            <div className="mg-stage">
              <span className="mg-stage-n">02 · Zielen</span>
              <span className="mg-stage-t">Für wen</span>
              <span className="mg-stage-d">Benennt die passenden Berufe. Alle anderen selektieren sich selbst heraus.</span>
            </div>
            <div className="mg-stage mg-stage--gate">
              <span className="mg-stage-n">03 · Qualifizieren</span>
              <span className="mg-stage-t">Express-Test</span>
              <span className="mg-stage-d">Vier Fragen sortieren starke, Grenz- und unpassende Fälle vor dem Kalender.</span>
            </div>
            <div className="mg-stage">
              <span className="mg-stage-n">04 · Konvertieren</span>
              <span className="mg-stage-t">Preise</span>
              <span className="mg-stage-d">Kombi-Paket als Standard; Einzeldokumente à la carte drum herum.</span>
            </div>
            <div className="mg-stage">
              <span className="mg-stage-n">05 · Buchen</span>
              <span className="mg-stage-t">Beratung</span>
              <span className="mg-stage-d">Zwei Call-Typen, beide zwei Klicks von einem Cal.eu-Slot entfernt.</span>
            </div>
          </div>

          <div className="cs-grid2 ax-equal cs-mt-l" style={{ alignItems: "center" }}>
            <Reveal className="cs-order-2">
              <h4 className="gm-subh" style={{ marginTop: 0 }}>Konvertieren zu den Bedingungen des Kunden</h4>
              <p className="cs-p">
                Der Kunde wollte vor allem eines: das Kombi-Paket zur offensichtlichen Wahl machen. Es trägt als
                Einziges den „Bestes Angebot"-Sticker und den einzigen roten Button; die drei Einzeldokumente à la
                carte drum herum rahmen das Kombi als die vollständige, durchdachte Option – nicht als die teure.
              </p>
              <p className="cs-p" style={{ marginTop: ".8rem" }}>
                Der leise <strong>„Ich bin mir nicht sicher, was ich brauche"</strong>-Button darunter fängt alle ab,
                die noch zögern, und leitet sie zurück in eine Beratung, statt sie abspringen zu lassen.
              </p>
            </Reveal>
            <Reveal className="cs-order-1">
              <LiveShot
                src={MS + "funnel-pricing.png"}
                alt="MigroPlan – Preispakete"
                caption={<><strong>Stufe 04 – Konvertieren.</strong> Das Kombi-Paket trägt als Einziges den Akzent-Button; die anderen setzen seinen Wert.</>}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Express Test ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Der Express-Test</h3></div>
          <p className="cs-p">
            Der Test der Visa-Chancen ist die erste CTA auf der Seite und der zentrale Qualifizierungsschritt des
            Funnels. Er musste sich wie ein schneller Selbstcheck anfühlen, etwas, das man aus Neugier macht:
            vier Fragen, keine Anmeldung, ein Ergebnis mit einer konkreten Empfehlung in unter zwei Minuten.
          </p>

          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal>
              <h4 className="gm-subh" style={{ marginTop: 0 }}>Design-Entscheidungen</h4>
              <MKL items={[
                ["Nur 4 Fragen.", "Alter, Art der Tätigkeit, Einkommensniveau, deutsche Kunden – das Minimum, um jemanden auf einen von drei Ausgängen zu lenken. Jede zusätzliche Frage kostet Abschlüsse."],
                ["Drei Ergebnispfade.", "Starkes Profil → kostenlose 15-Minuten-Beratung. Nicht-Standard-Fall → kostenpflichtige Tiefenanalyse. Falscher Visum-Typ oder Einkommen unter der Grenze → eine ehrliche Umleitung mit einem anderen nächsten Schritt. Niemand landet in einer Sackgasse."],
                ["Keine Registrierung.", "Kontaktdaten kommen später, nachdem der Besucher bereits etwas Nützliches bekommen hat."],
                ["Ein Modal, keine eigene Seite.", "Der Test öffnet sich über der Landingpage und schließt wieder in dieselbe Scroll-Position, sodass niemand seinen Platz verliert."],
              ]} />
            </Reveal>
            <Reveal>
              <h4 className="gm-subh" style={{ marginTop: 0 }}>Ergebnis-Routing</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: ".7rem", marginTop: ".3rem" }}>
                <div className="cs-panel" style={{ padding: "1rem 1.2rem" }}>
                  <div className="ax-sub5" style={{ marginBottom: ".4rem", color: "var(--accent)" }}>Ausgezeichnete Chancen</div>
                  <p className="cs-p" style={{ fontSize: ".94rem" }}>
                    Freelance-Beruf + Einkommen ≥ 1.500 € + deutscher Kunde. CTA: kostenlose 15-Min-Beratung → Cal.eu.
                  </p>
                </div>
                <div className="cs-panel" style={{ padding: "1rem 1.2rem" }}>
                  <div className="ax-sub5" style={{ marginBottom: ".4rem" }}>Moderate Chancen</div>
                  <p className="cs-p" style={{ fontSize: ".94rem" }}>
                    Gutes Profil, Nicht-Standard-Fall – noch kein deutscher Kunde oder Grenz-Einkommen. CTA: kostenpflichtige 60-Min-Tiefenanalyse → Cal.eu.
                  </p>
                </div>
                <div className="cs-panel" style={{ padding: "1rem 1.2rem" }}>
                  <div className="ax-sub5" style={{ marginBottom: ".4rem" }}>Anderes Visum / zu früh</div>
                  <p className="cs-p" style={{ fontSize: ".94rem" }}>
                    Kleinunternehmen statt Freelance oder Einkommen unter der Schwelle. Eine ehrliche Umleitung, die beiden Seiten einen Call spart.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal className="cs-mt-l">
            <h4 className="gm-subh" style={{ marginTop: 0 }}>Storyboard des Test-Flows</h4>
          </Reveal>
          <div className="mg-qboard cs-mt-m">
            {QUIZ_STEPS.map((s, i) => <QuizFrame key={i} step={s} />)}
          </div>

          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal>
              <LiveShot
                src={MS + "quiz-q1.png"}
                alt="MigroPlan Eignungstest – erste Frage"
                caption={<><strong>Frage 1 von 4.</strong> Der Test öffnet sich als Modal über der Landingpage – ein Fortschrittsbalken, eine Frage nach der anderen, keine Anmeldung. Schließt wieder in dieselbe Scroll-Position.</>}
              />
            </Reveal>
            <Reveal>
              <LiveShot
                src={MS + "quiz-result.png"}
                alt="MigroPlan Eignungstest – Ergebnisbildschirm"
                caption={<><strong>Das Ergebnis.</strong> Ein bewertetes Profil treibt die Anzeige und die CTA – hier führt ein starkes 8/8 direkt zu einer kostenlosen 15-Minuten-Beratung.</>}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Booking / Cal.eu ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Von der CTA zum gebuchten Slot</h3></div>
          <p className="cs-p">
            Jede CTA auf der Seite – das Test-Ergebnis, die Preis-Karten, der Beratungsblock – führt an denselben
            Ort: einen Cal.eu-Slot. Zwei Einstiegspunkte auf der Seite, ein Buchungs-Sheet dahinter.
          </p>

          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal>
              <LiveShot
                fit
                src={MS + "consultation.png"}
                alt="MigroPlan – Beratungsoptionen"
                caption={<><strong>Auf der Seite.</strong> Eine kostenlose 15-Minuten-Express-Einschätzung und eine kostenpflichtige 60-Minuten-Fallprüfung – zwei getrennte Angebote.</>}
              />
            </Reveal>
            <Reveal>
              <LiveShot
                fit
                src={MS + "cal-eu.png"}
                alt="MigroPlan – Cal.eu-Buchungs-Sheet"
                href="https://migroplan.com/"
                caption={<><strong>Was sich öffnet.</strong> Das Cal.eu-Sheet, gebrandet als MigroPlan, mit Live-Verfügbarkeit in der Zeitzone Europe/Berlin.</>}
              />
            </Reveal>
          </div>
          <p className="mg-paircap">↑ Jeder Einstiegspunkt auf der Seite führt zu seinem eigenen Cal.eu-Event-Typ, sodass Buchungen vorab beschriftet eintreffen</p>

          <Reveal className="cs-panel cs-mt-l">
            <h4>Warum Cal.eu</h4>
            <div className="cs-mt-m">
              <MKL items={[
                ["EU-gehostet mit Absicht.", "Die Buchung läuft über Cal.eu – die EU-gehostete Instanz von Cal.com –, damit die Termindaten für einen Service rund um den Umzug nach Deutschland in der EU bleiben. Ein kleines Detail, das zur Zielgruppe passt."],
                ["Zwei Event-Typen, vorab beschriftet.", "Ein kostenloses 15-Minuten-Intro und eine kostenpflichtige 60-Minuten-Prüfung liegen hinter getrennten Links, sodass jede Buchung getaggt ankommt, welcher Call es ist."],
                ["Zwei Klicks zu einem Slot.", "Von jeder CTA auf der Seite – und das FAQ sagt in klaren Worten, dass der kostenpflichtige Call auf das Kombi-Paket angerechnet wird."],
              ]} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Mobile-first ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Fürs Smartphone zuerst gebaut</h3></div>
          <p className="cs-p">
            Die meisten Menschen, die sich über ein Visum informieren, tun das am Smartphone, in freien Minuten
            zwischendurch – deshalb war das Mobile-Layout nie ein nachträglicher Gedanke. Desktop und Mobile wurden
            im selben Durchgang gezeichnet, und die ganze UI wurde so gebaut, dass sie <strong>dynamisch umfließt</strong>,
            statt auf eine Handvoll fester Breiten zu springen.
          </p>

          <div className="mg-phones cs-mt-l">
            <MobileShot
              src={MS + "mobile-hero.png"}
              alt="MigroPlan Mobile – Hero"
              caption={<><strong>Hero, gestapelt.</strong> Der Hinweis mit der Deutschland-Flagge rückt über die Headline; die CTA wird volle Breite und daumengerecht.</>}
            />
            <MobileShot
              src={MS + "mobile-steps.png"}
              alt="MigroPlan Mobile – So funktioniert's"
              caption={<><strong>„So funktioniert's", vertikal.</strong> Die vierstufige Leiste dreht sich in eine einzelne Spalte mit dem Verbinder, der links entlangläuft.</>}
            />
          </div>

          <Reveal className="cs-panel cs-panel-accent cs-mt-l">
            <h4>Im laufenden Betrieb behoben</h4>
            <p className="cs-p" style={{ marginTop: ".6rem" }}>
              Nach dem Launch machte ich einen eigenen Bugfix-Durchgang auf echten Geräten, nicht im Simulator. Ein Fund:
              Der vollständige <span className="mg-tgchip">Telegram</span>-Button lief unter einer bestimmten Breite
              aus dem Header heraus und brach das Layout.
            </p>
            <p className="cs-p" style={{ marginTop: ".8rem" }}>
              Die Lösung war, das Label auf Mobile wegzulassen und nur das Papierflieger-Icon zu behalten – auf einem
              Smartphone mehr als genug, wo das Telegram-Glyph sofort lesbar ist –, sodass der Header bis zu den
              kleinsten Bildschirmen zusammenhält. Den Icon-only-Button kann man in den Shots oben erkennen.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── AI-Assisted Sprint ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Wie der AI-gestützte Sprint wirklich aussah</h3></div>
          <p className="cs-p">
            Dieses Projekt war zugleich ein Praxistest für Claude in einer echten Kundenauslieferung – mit einer
            harten Deadline, einem meinungsstarken Kunden und Geld im Spiel. Ungefähr Stunde für Stunde:
          </p>
          <ol className="ax-steps cs-mt-l">
            {[
              ["Funnel-Ideenfindung · Stunden 0–4.", "Ich beschrieb Claude den Service, die Zielgruppe und mein Design-Konzept und arbeitete strukturell unterschiedliche Funnel-Optionen durch. Am Ende waren es fünf, jede mit ihrer eigenen Hypothese, was der Besucher zuerst sieht. Am Ende des Abends hatte ich einen Favoriten."],
              ["Kunden-Sync · Stunde 5.", "Eine halbe Stunde am Telefon. Wir legten fest, welche Services gepusht werden, setzten das Kombi-Paket als Standardangebot und einigten uns darauf, dass der Test Leads vor dem Kalender filtern soll. Mit fünf kartierten Richtungen anzukommen machte dieses Gespräch kurz und konkret."],
              ["Texte · Stunden 6–18.", "Alle Abschnittstexte entworfen und überarbeitet, mit fixierter Positionierung. Russisch und Englisch wurden als zwei getrennte Durchgänge geschrieben – die englische Version ist keine Übersetzung, sie hat ihren eigenen Rhythmus und etwas andere Schwerpunkte."],
              ["Build & Politur · Stunden 18–30.", "Layout, das Routing des Tests, die i18n-Schicht, Mobile-Breakpoints. Jede Runde meines Feedbacks ging direkt in den nächsten Durchgang – genau daher kommt der komprimierte Zeitrahmen, kein Warten zwischen den Iterationen."],
              ["Auslieferung · Stunden 30–36.", "Domain, Deploy, ein letzter Text-Durchgang in beiden Sprachen, Cal.eu-Event-Typen verbunden. Live am zweiten Abend."],
            ].map(([b, t], i) => (
              <li className="ax-step" key={i}>
                <span className="ax-step-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="ax-step-t"><strong>{b}</strong> {t}</span>
              </li>
            ))}
          </ol>

          <Reveal className="cs-panel cs-panel-accent cs-mt-l">
            <h4>Zur Arbeit mit Claude</h4>
            <p className="cs-p" style={{ marginTop: ".6rem" }}>
              Für mich war der Gewinn das Tempo. Mehr Richtungen in den ersten Stunden auf dem Tisch, Text-Durchgänge,
              die in Minuten laufen, Layout-Experimente, die ich am Bildschirm beurteilen konnte, statt sie mir
              vorzustellen. Ich traf weiterhin jede finale Entscheidung und warf einen guten Teil des Zurückgekommenen
              weg – aber der Abstand zwischen einer Idee und etwas, das ich bewerten konnte, fiel in sich zusammen,
              und das ist es, was 36 Stunden ausreichen ließ.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Tech stack ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Technische Highlights</h3></div>
          <div className="ax-dsys">
            <Reveal className="cs-panel">
              <h4>Zwei Sprachen, ein Build</h4>
              <MKL items={[
                ["Eine HTML-Datei", "trägt beide vollständigen Sprachversionen, clientseitig über eine i18n-Key-Map umgeschaltet."],
                ["Rich-Strings liegen separat,", "sodass die inline gesetzten roten Schlüsselwort-Akzente die Sprachumschaltung unbeschadet überstehen."],
                ["Kein Deutsch mit Absicht.", "Wer bereits in Deutschland lebt, braucht kein Freiberufler-Visum. Russisch deckt die GUS-Zielgruppe ab, Englisch den Rest der Welt."],
              ]} />
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Test-Engine</h4>
              <MKL items={[
                ["Eigenes Vanilla-JS,", "keine Abhängigkeiten – vier Fragen, drei Ergebnispfade, ein Modal."],
                ["Verzweigungslogik", "routet nach Art der Tätigkeit, Einkommen und Vorhandensein eines deutschen Kunden; ein bewertetes Profil treibt die finale Anzeige."],
                ["Ergebnis-CTAs", "verlinken auf Cal.eu-Event-Typen, die zum Ausgang passen."],
              ]} />
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Cal.eu-Buchung</h4>
              <MKL items={[
                ["EU-gehostet (Cal.eu)", "– die europäische Instanz von Cal.com, sodass Buchungsdaten einer Deutschland-Zielgruppe in der EU bleiben."],
                ["Getrennte Event-Typen", "für die kostenlose 15-Minuten- und kostenpflichtige 60-Minuten-Beratung – Buchungen treffen vorab beschriftet ein."],
                ["Zwei Klicks zu einem Slot", "von jeder CTA, und der kostenpflichtige Call wird auf das Kombi-Paket angerechnet."],
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
            Ein paar Dinge aus diesem Sprint, die ich für den nächsten behalte:
          </p>
          <ul className="cs-steps cs-mt-m">
            {[
              ["Komm mit einer Empfehlung in den Kunden-Call.", "Fünf kartierte Richtungen und ein Favorit machten aus einer möglichen zweistündigen Discovery-Session dreißig entschlossene Minuten. Erst eine Hypothese zu bilden und sie gemeinsam zu validieren schlägt es, im Raum mit einem leeren Blatt zu starten."],
              ["Ein ehrliches „Nein“ baut mehr Vertrauen auf als ein weiches „Vielleicht“.", "Der Test sagt einem Kleinunternehmer geradeheraus, dass dieses Visum für ihn nicht funktioniert, und verweist woanders hin. Diese Antwort kostet einen Lead und verdient einen Ruf."],
              ["Teste den Namen in jeder Sprache, bevor du dich festlegst.", "Freiberufler·Weg starb in dem Moment, in dem ich mir einen russischsprachigen Menschen vorstellte, der ihn in eine Suchleiste tippt. Ein Name, der nur in einer Sprache funktioniert, begrenzt leise alles, was darauf aufbaut."],
              ["Eine Key-Map schlägt ein Framework in dieser Größe.", "Für eine einzelne zweisprachige Landingpage erledigten ein paar Zeilen Vanilla-JS, wofür man sonst eine i18n-Bibliothek nähme – ohne Build-Step und ohne etwas, das man bei der Übergabe erklären müsste."],
              ["Gestalte das Phone-Layout im selben Durchgang, nicht danach.", "Weil Mobile und Desktop gemeinsam gezeichnet wurden, waren die Korrekturen nach dem Launch klein – ein Button-Label hier, ein Breakpoint da – und kein zweites Redesign, sobald echte Smartphones es in die Hand bekamen."],
              ["Eine harte Deadline ist ein guter Lektor.", "Jeder Abschnitt musste sich innerhalb von 36 Stunden rechtfertigen, also ging die Seite ohne ein einziges „Nice to have“ live. Der Zwang machte das Produkt straffer, und die Qualität rückte nicht ab."],
            ].map(([b, t], i) => <li className="cs-li" key={i}><strong>{b}</strong> {t}</li>)}
          </ul>
        </div>
      </section>

    </div>
  );
}

Object.assign(window, { MigroCase });
