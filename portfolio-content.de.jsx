/* portfolio-content.de.jsx – Deutsche Version der Portfolio-Fallstudie.
   Geladen aus prod/de/. Exportiert OldDesignCase + NewDesignCase + Hilfsfunktionen nach window.
   Die Seiten-Shell liegt in casestudy-portfolio.jsx. */

const PF = "../assets/cs/";
const OLDIMG = "../assets/";
const OLD = {
  heroGif:      OLDIMG + "video_full.gif",
  iter1:        OLDIMG + "Iteration1.png",
  iter2:        OLDIMG + "Iteration2.png",
  localization: OLDIMG + "Localization.png",
};

function CSSwitch({ view, onChange }) {
  return (
    <div className="cs-switch" role="tablist" aria-label="Version der Fallstudie wählen">
      <span className="cs-thumb" aria-hidden="true"></span>
      <button role="tab" aria-selected={view === "old"} className={view === "old" ? "active" : ""} data-hot onClick={() => onChange("old")}>Altes Design</button>
      <button role="tab" aria-selected={view === "new"} className={view === "new" ? "active" : ""} data-hot onClick={() => onChange("new")}>Neues Design</button>
    </div>
  );
}

function PFStat({ from = null, to, pre = "", suf = "", label }) {
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
  const start = from == null ? 0 : from;
  const [val, setVal] = useState(start);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVal(to); return; }
    let raf = 0, t0 = 0, done = false;
    const dur = 1300;
    const tick = (t) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(start + (to - start) * eased));
      if (p < 1) raf = requestAnimationFrame(tick); else done = true;
    };
    raf = requestAnimationFrame(tick);
    const fb = setTimeout(() => { if (!done) setVal(to); }, dur + 500);
    return () => { cancelAnimationFrame(raf); clearTimeout(fb); };
  }, [run, to]);
  return (
    <div className="gm-stat" ref={ref}>
      <div className="gm-stat-n">
        {from != null && <><span className="dim">{from}</span><span className="arr">→</span></>}
        <span className="accent">{pre}{val}{suf}</span>
      </div>
      <div className="gm-stat-k">{label}</div>
    </div>
  );
}

function PFStatBand({ stats }) {
  return (
    <section className="cs-section gm-stats-sec">
      <div className="cs-wrap">
        <div className="gm-statband">
          {stats.map((s, i) => <PFStat key={i} {...s} />)}
        </div>
      </div>
    </section>
  );
}

function BrowserShot({ src, alt, caption, url = "alexmedved.com", tag, isNew = false }) {
  const open = useLightbox();
  return (
    <figure className="pf-browser">
      <div className="pf-shell">
        <div className="pf-chrome">
          <span className="pf-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span className="pf-url">{url}</span>
          {tag && (
            <span className={"pf-tag" + (isNew ? " is-new" : "")}>
              {isNew && <span className="pf-pulse" aria-hidden="true"></span>}{tag}
            </span>
          )}
        </div>
        <button type="button" className="pf-shot" data-hot
          onClick={() => open({ src, alt, caption })} aria-label={"Bild öffnen: " + alt}>
          <img src={src} alt={alt} loading="lazy" />
          <span className="pf-zoom" aria-hidden="true">
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

function SkillMarquee({ items }) {
  const row = (key) => (
    <div className="pf-marq-item" key={key} aria-hidden={key === "b" ? "true" : undefined}>
      {items.map((w, i) => (
        <React.Fragment key={i}>
          <span className="pf-marq-word">{w}</span>
          <span className="pf-marq-sep">//</span>
        </React.Fragment>
      ))}
    </div>
  );
  return (
    <div className="pf-marquee">
      <div className="pf-marquee-track">{row("a")}{row("b")}</div>
    </div>
  );
}

/* ============================================================
   ALTES DESIGN
   ============================================================ */
function OldDesignCase() {
  return (
    <div className="cs-view">
      <section className="cs-section cs-hero">
        <div className="cs-wrap">
          <div className="cs-kicker">
            <Reveal><MonoLabel>Fallstudie · Portfolio v1</MonoLabel></Reveal>
          </div>
          <div className="ax-hero-grid">
            <Reveal className="ax-hero-text">
              <h1 className="cs-title">Dieses Portfolio,<br /><span className="accent">von Grund auf erstellt.</span></h1>
              <p className="cs-sub">Warum ich auf Vorlagen verzichtete und eine eigene, mehrsprachige Seite entwickelte</p>
              <p className="cs-lead">
                UXfolio war mir zu starr, und Behance ist zwar nett, aber nicht mein Format. Ich wollte eine Seite,
                die mit mir wächst, meine Identität widerspiegelt und echtes Product Thinking zusammen mit meinen
                Fähigkeiten zeigt – also habe ich sie selbst entworfen, getextet und programmiert.
              </p>
            </Reveal>
            <Reveal>
              <BrowserShot src={OLD.heroGif} url="alexmedved.com" tag="v1 · 2024"
                alt="Das originale alexmedved.com-Portfolio – animierte Hero-Vorschau"
                caption="Mein erstes Design war das Logo, und es war nach ein paar Stunden fertig." />
            </Reveal>
          </div>
        </div>
      </section>

      <PFStatBand stats={[
        { pre: "~", to: 1, suf: " Mo.", label: "Von null bis Launch, nach der Arbeit" },
        { to: 4, label: "Seiten beim Launch" },
        { to: 3, label: "Sprachen – EN / DE / RU" },
        { to: 0, label: "Vorlagen oder Page-Builder" },
      ]} />

      <SkillMarquee items={["Identität & Branding", "UX / UI", "Content & ToV", "Frontend", "Lokalisierung"]} />

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h2 className="cs-h">Projekt auf einen Blick</h2></div>
          <Reveal className="cs-meta">
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Meine Rolle</div>
              <div className="cs-meta-v">UX/UI-Design, UX-Writing, Brand &amp; Logo, Frontend, Lokalisierung (EN → DE/RU), Veröffentlichung</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Zeitrahmen</div>
              <div className="cs-meta-v">Etwa 1 Monat unregelmäßige Abende nach der Arbeit</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Tools</div>
              <div className="cs-meta-v">Figma, VS Code, Tailwind, GitHub Pages, HTML/CSS/JS, ChatGPT, Google Docs, CodePen</div>
            </div>
          </Reveal>
          <Reveal className="cs-chips cs-mt-m" style={{ justifyContent: "center" }}>
            {["Identität & Branding", "UX / UI", "Content & ToV", "Frontend", "Lokalisierung (EN / DE / RU)"].map((c) => (
              <span className="tag" key={c}>{c}</span>
            ))}
          </Reveal>
          <div className="cs-grid2 cs-mt-l">
            <Reveal>
              <h3 className="cs-h" style={{ fontSize: "1.25rem", marginBottom: ".8rem" }}>Herausforderungen</h3>
              <p className="cs-p">
                Ein professionelles Profil entwickeln, ein Logo gestalten und ein responsives Portfolio von Grund
                auf bauen – ohne Vorlagen und ohne selbst hauptberuflich Entwickler zu sein. Die Seite sollte
                schnell live gehen und leicht zu pflegen sein.
              </p>
            </Reveal>
            <Reveal>
              <h3 className="cs-h" style={{ fontSize: "1.25rem", marginBottom: ".8rem" }}>Ziel</h3>
              <p className="cs-p">
                Ein responsives, markentaugliches und mehrsprachiges Portfolio aufbauen, das meine Geschichte
                klar erzählt, Fallstudien einheitlich präsentiert und mir die volle Kontrolle über Inhalte,
                Code und Weiterentwicklung gibt.
              </p>
            </Reveal>
          </div>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel pf-lift">
              <h4>Meine Highlights</h4>
              <ul className="cs-steps">
                {["Eigene Identität & Logo im Einklang mit Stil und Arbeit",
                  "Wiederverwendbares Fallstudien-Layout für klare Stories",
                  "Mehrsprachige Struktur (EN → DE/RU) von Anfang an bedacht",
                  "Schneller Static-Stack mit Tailwind auf GitHub Pages",
                  "Zugängliche Typografie & Abstände für einfaches Scannen"].map((t) => (
                  <li className="cs-li" key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="cs-panel pf-lift">
              <h4>Ergebnis</h4>
              <ul className="cs-steps">
                {["Eine Website, die persönlich wirkt, Vertrauen schafft und wachsen kann",
                  "Eine klarere Story über Fähigkeiten, Prozess und echten Impact",
                  "Volle Kontrolle über Hosting, Geschwindigkeit und SEO-Basics",
                  "Kein Vendor-Lock-in – alles läuft aus meinem Repo",
                  "Eine responsive Seite, die ich bis ins letzte Pixel besitze"].map((t) => (
                  <li className="cs-li" key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Prozess</h3></div>
          <p className="cs-p" style={{ maxWidth: "70ch" }}>
            Ich habe diese Seite wie ein kleines Produkt angegangen: in auslieferbaren Teilen, mit echten
            Rahmenbedingungen und schnellem Lernen. Das Ziel war nicht einfach „eine Website", sondern
            ein klares, wachsendes System, das mit meiner Arbeit wächst.
          </p>
          <ol className="ax-steps cs-mt-l">
            {[
              ["Die Stimme finden.", "Richtungen skizziert, visuelle Referenzen gesammelt und einen Ton definiert, der schlicht, selbstbewusst und einladend wirkt."],
              ["Die Identität formen.", "In wenigen Stunden wurde das Logo entworfen und geprüft, wie gut es mich widerspiegelt und in Mockups wirkt."],
              ["Die Arbeit strukturieren.", "In Figma die ersten Seiten entworfen – Startseite, Über mich, Fallstudien, Kontakt – mit Desktop-First-Ansatz."],
              ["Rhythmus prüfen.", "Interaktive Mocks erstellt, um Flow, Abstände und Lesetempo zu testen, bevor überhaupt Code geschrieben wurde."],
              ["Das Wesentliche verfeinern.", "Mehrere Iterationen des finalen Designs entwickelt und die stärkste Richtung ausgewählt."],
              ["Bauen wie Bausteine.", "Mit HTML/Tailwind/JS gearbeitet, Abschnitte komponentenbasiert gebaut und mit ChatGPT die Routine beschleunigt."],
              ["Mehrsprachig gehen.", "Zuerst auf Englisch geschrieben, dann ins DE/RU lokalisiert – mit beibehaltener Tonalität und Klarheit."],
              ["Ausliefern, prüfen, iterieren.", "Auf GitHub Pages veröffentlicht, auf Geräten getestet und dokumentiert, damit künftige Anpassungen leichter fallen."],
            ].map(([b, t], i) => (
              <li className="ax-step" key={b}>
                <span className="ax-step-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="ax-step-t"><strong>{b}</strong> {t}</span>
              </li>
            ))}
          </ol>
          <Reveal className="cs-mt-l">
            <ZoomImg src={OLD.iter1} alt="Frühes Konzeptboard in Figma – Seitenplan für Desktop und Mobil"
              capAccent="Figma →"
              caption="Frühes Konzeptboard in Figma: erste Seiten für den Launch im Desktop-First-Plan. Später wurde das Fallstudien-System angepasst – Abstände, Proportionen und Ränder – für flüssigeres Lesen." />
          </Reveal>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Wichtige Entscheidungen &amp; Designprinzipien</h3></div>
          <p className="cs-p" style={{ maxWidth: "70ch" }}>
            Anstatt ein künstliches „Vorher–Nachher" zu erzwingen, zeige ich die Entscheidungen, die diese
            Seite geprägt haben, und die Prinzipien, die sie zusammenhalten – damit das Design klar,
            flexibel und authentisch zu meiner Arbeit bleibt.
          </p>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel cs-panel-accent pf-lift">
              <h4>Meine Entscheidungen</h4>
              <ul className="cs-steps">
                {[["Von Grund auf, ohne Kompromisse:", "Volle kreative Kontrolle, bessere Performance und ein Auftritt, der wirklich zu mir passt. Dazu eine bewusste Lerninvestition."],
                  ["Eigenes Logo statt nur Wortmarke:", "Ein Zeichen mit Charakter, das in Favicon, Social Media und Print funktioniert – modern und nahbar statt austauschbar."],
                  ["Desktop first, dann Mobile:", "Da Fallstudien meist am Desktop gelesen werden, habe ich dort zuerst gestaltet – mobile Anpassungen wurden einfacher und schneller."],
                  ["Manuelle Lokalisierung:", "Tonalität, Begriffe und Kontext sind entscheidend. Manuelle Übersetzungen schaffen mehr Vertrauen, bessere UX und stärkeres SEO."]].map(([b, t]) => (
                  <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="cs-panel pf-lift">
              <h4>Was das Design zusammenhält</h4>
              <ul className="cs-steps">
                {[["Klarheit:", "Eine klare Hierarchie in den Fallstudien, damit Rolle, Ergebnis und Wirkung sofort erkennbar sind."],
                  ["Konsistenz:", "Abstands- und Typografie-Raster halten die Seiten zusammen; wiederverwendbare Blöcke sorgen für einheitlichen Text- und Designfluss."],
                  ["Identität:", "Logo, Tonalität und Farbwahl vermitteln eine ruhige, zugängliche Marke – durchgängig vom Hero bis zum Footer."],
                  ["Flexibilität:", "Als System gebaut (Tailwind + modulare Inhalte), sodass sich neue Fallstudien schnell hinzufügen lassen."]].map(([b, t]) => (
                  <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Ergebnisse</h3></div>
          <p className="cs-p" style={{ maxWidth: "72ch" }}>
            Dieses Projekt hat meinen Umgang mit Design und Projekten insgesamt stark verändert. Ich habe
            neue Fähigkeiten gewonnen, bestehende geschärft und die volle Kraft kreativer Freiheit erlebt –
            ohne Paywalls oder die Einschränkungen einer Plattform.
          </p>
          <div className="cs-grid2 cs-mt-m">
            <ul className="cs-steps">
              {[["Lesbarkeit.", "Klare Struktur macht auch lange Seiten leicht überschaubar."],
                ["Handwerk.", "Logo und Tonalität geben dem Portfolio eine eigene, menschliche Stimme."],
                ["Eigentum.", "Inhalte und Code im Repo – keine Abhängigkeiten, kein Plugin-Roulette."]].map(([b, t]) => (
                <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
              ))}
            </ul>
            <ul className="cs-steps">
              {[["Lokalisierung.", "Manuelle Übersetzungen bewahren Nuancen und Glaubwürdigkeit."],
                ["Performance.", "Ein schlanker Static-Build hält die Seiten schnell und stabil."],
                ["Dev-Empathie.", "Der Bau der Seite ließ mich Entwickler besser verstehen."]].map(([b, t]) => (
                <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
              ))}
            </ul>
          </div>
          <div className="cs-grid2 ax-equal pf-oldpair cs-mt-l">
            <Reveal>
              <ZoomImg className="pf-oldfig" src={OLD.iter2} alt="Iteration 2 – überarbeitetes Fallstudien-Layout"
                caption="Iteration 2, das vorletzte Layout – Fallstudien neu geordnet, Abstände verfeinert und alles sorgfältig ausgearbeitet, bevor es in den Code ging." />
            </Reveal>
            <Reveal>
              <ZoomImg className="pf-oldfig" src={OLD.localization} alt="Komponenten-Frame mit ausgerichteten Blöcken und Übersetzungen"
                caption="Alle Blöcke wurden als Komponenten entwickelt; die Texte wurden parallel in drei Sprachen in einer übersichtlichen Tabelle gepflegt und übersetzt." />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-prose">
          <div className="cs-head" style={{ justifyContent: "center" }}><h3 className="cs-h">Erkenntnisse</h3></div>
          <p className="cs-p" style={{ textAlign: "center" }}>
            Dieses Projekt war weit mehr als Design – eine komplette Produktaufgabe von Anfang bis Ende.
            Ich lernte, Identität, Struktur und Code zu verbinden, ohne dabei Klarheit und Nutzbarkeit aus dem Blick zu verlieren.
          </p>
          <ul className="cs-steps cs-mt-m">
            {[["Systemdenken.", "Ein klares Abstands- und Rastersystem sparte Stunden, sobald es ans Coden ging."],
              ["Design → Code-Flow.", "Saubere Figma-Komponenten flossen direkt in klares HTML/CSS."],
              ["Lokalisierungsbewusstsein.", "Die frühe Planung für EN, DE und RU bewahrte Layouts vor Brüchen."],
              ["Schritt statt Perfektion.", "Der wirksamste Grundsatz: erst bauen, später verfeinern."]].map(([b, t]) => (
              <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   NEUES DESIGN
   ============================================================ */
function NewDesignCase() {
  return (
    <div className="cs-view">
      <section className="cs-section cs-hero">
        <div className="cs-wrap">
          <div className="cs-kicker">
            <Reveal><MonoLabel>Fallstudie · Portfolio v2</MonoLabel></Reveal>
          </div>
          <Reveal as="h1" className="cs-title">Dasselbe Portfolio,<br /><span className="accent">neu gebaut mit KI.</span></Reveal>
          <Reveal as="p" className="cs-lead">
            Ein Jahr nach dem Launch von v1 stand der Inhalt gut da – die Optik aber vermittelte kein
            „datengetriebenes Produktdesign" mehr. Also habe ich das gesamte Frontend neu gebaut: Claude
            als Designpartner, ich als Art Director für jeden Screen. Eine Woche Abendarbeit, dieselbe
            Story – ein klareres Signal.
          </Reveal>
          <Reveal className="cs-meta cs-mt-l">
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Meine Rolle</div>
              <div className="cs-meta-v">Art Direction, Designsystem, Prompting &amp; Review, Frontend-QA</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">KI im Prozess</div>
              <div className="cs-meta-v">Claude als primärer Design-/Code-Partner, dazu verschiedene LLMs für Texte und Review</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Was blieb / was sich veränderte</div>
              <div className="cs-meta-v">Gleicher Inhalt &amp; Story · neue Bildsprache, Architektur und Interaktionen</div>
            </div>
          </Reveal>
        </div>
      </section>

      <PFStatBand stats={[
        { pre: "~", to: 1, suf: " Wo.", label: "Für Neuaufbau des Systems und Migration" },
        { from: 33, to: 16, label: "Seiten nach dem Neuaufbau" },
        { from: 15, to: 2, label: "Zertifikate & Recht – jetzt Modals" },
        { to: 3, label: "Sprachen, ohne Layout-Verschiebungen" },
      ]} />

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h2 className="cs-h">Vorher / Nachher</h2></div>
          <Reveal className="pf-ba">
            <BrowserShot src={PF + "pf-old-hero.png"} url="alexmedved.com" tag="v1 · 2024"
              alt="Altes Portfolio – helles, generisches Layout"
              caption={<><strong>Vorher.</strong> Ein sauberes, aber generisches helles Layout – Foto, Berufsbezeichnung, ein Satz.</>} />
            <BrowserShot src={PF + "pf-new-hero.png"} url="alexmedved.com" tag="v2 · 2026" isNew
              alt="Neues Portfolio – markante redaktionelle Typografie auf dunklem Hintergrund"
              caption={<><strong>Nachher.</strong> Eine klare Aussage in großer Typografie, eine bewusste Palette und ein strukturelles Datengitter-Motiv.</>} />
          </Reveal>
          <p className="cs-cap pf-fig-note">
            Die Überschrift wurde von einer Berufsbezeichnung zu einem Statement. Die Typografie markanter,
            die Palette entschiedener – und das Raster dahinter verweist auf die Dashboards, die ich tatsächlich gestalte.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-grid2 ax-equal" style={{ alignItems: "center" }}>
            <div>
              <div className="cs-head"><h3 className="cs-h">Das System hinter dem Neuaufbau</h3></div>
              <p className="cs-p">
                Bevor wir Screens anpackten, haben Claude und ich einen kleinen Satz Regeln festgelegt,
                damit jede Seite mit Absicht zusammenhält.
              </p>
              <ul className="cs-steps cs-mt-m">
                {[["Typografie.", "Archivo für selbstbewusste Headlines, Space Mono für Labels und Metadaten – das Gefühl eines Produkt-Lab-Notizbuchs."],
                  ["Palette.", "Warmes Fast-Schwarz als Hintergrund mit einem einzigen entschiedenen Akzent. Hell und dunkel sind beide vollwertig."],
                  ["Motiv.", "Ein feines 12-spaltiges Datengitter im Hintergrund – eine Anspielung auf Dashboards und Struktur."],
                  ["Rhythmus.", "Eine Abstands-Skala und eine Reveal-on-Scroll-Kadenz – wiederverwendet von Hero über Karten bis zu den Fallstudien."]].map(([b, t]) => (
                  <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
                ))}
              </ul>
            </div>
            <Reveal>
              <BrowserShot src={PF + "pf-new-case.png"} url="alexmedved.com/case-study" tag="Fallstudie" isNew
                alt="Neue Fallstudien-Seite mit Mono-Labels, Stats und Live-Screenshots"
                caption={<><span className="accent">System → </span>Ein Satz Tokens steuert jede Fallstudie: Mono-Index-Labels, ein Akzentsystem, animierte Stat-Bänder und ein flagship Hero.</>} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Weniger Seiten, bessere UX</h3></div>
          <p className="cs-p" style={{ maxWidth: "74ch" }}>
            Die alte Seite wuchs sich aus: Zertifikate, Impressum und Datenschutz waren 15 einzelne Seiten
            in drei Sprachen. In v2 werden sie zu Hover-Previews und Modals auf einer einzigen Seite
            zusammengefasst – mit Hash-URLs (<code>/#impressum</code>), damit rechtliche Seiten direkt
            verlinkbar bleiben. Weniger zu übersetzen, weniger Versatz.
          </p>
          <Reveal className="pf-twin cs-mt-l">
            <BrowserShot src={PF + "pf-new-anim.png"} url="alexmedved.com/#certificates" tag="Hover für Vorschau" isNew
              alt="Neue Zertifikatsliste mit Hover-Vorschau-Karte"
              caption={<><strong>Zertifikate als Liste.</strong> Hover hebt eine Live-Vorschau des Scans an; die cursor-tracking Karte und der Akzentring sind pure Interaktion – keine zusätzlichen Seiten.</>} />
            <BrowserShot src={PF + "pf-smoother-ux.png"} url="alexmedved.com/#certificates" tag="Klick für Details" isNew
              alt="Zertifikat-Detail-Modal mit strukturierten Metadaten"
              caption={<><strong>Klick für den vollständigen Eintrag.</strong> Ein einziges Modal enthält Datum, Skills und einen Verifikationslink – was früher 15 Seiten waren, steckt jetzt in einer einheitlichen Komponente.</>} />
          </Reveal>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Bewusste Kompromisse</h3></div>
          <div className="cs-grid2">
            <Reveal className="cs-panel pf-lift">
              <div className="cs-stat">
                <div className="cs-stat-n">33 <span className="arrow">→</span> <span className="accent">16</span></div>
                <div className="cs-stat-k">Seiten zusammengefasst</div>
              </div>
              <p className="cs-p cs-mt-m">
                Die Hälfte der Seite war dreifach dupliziertes Chrome in drei Sprachen. Modals und ein
                Live-Sprachwechsler halbierten die Seitenanzahl – und die Übersetzungsfläche gleich mit.
              </p>
            </Reveal>
            <Reveal className="cs-panel pf-lift">
              <h4>Bewusste Entscheidungen</h4>
              <ul className="cs-steps">
                {[["Live-Toggles.", "Theme, Akzent, Case-Grid-Layout und Kartenstil sind Live-Toggles – Richtungen werden verglichen, nicht erraten."],
                  ["SPA vs. Static.", "Ein React-Frontend kostet etwas SEO-Einfachheit; kompensiert durch Inhalte in normalem Markup und echten URLs."],
                  ["KI entwirft, ich leite.", "Modelle arbeiten schnell, tendieren aber zur Mittelmäßigkeit. Jeden Screen habe ich manuell über sein erstes 'geht so' hinausgetrieben."]].map(([b, t]) => (
                  <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-prose">
          <div className="cs-head" style={{ justifyContent: "center" }}><h3 className="cs-h">Mit KI als Designpartner arbeiten</h3></div>
          <ul className="cs-steps cs-mt-s">
            {[["Geschmack ist der Flaschenhals.", "Das Modell kann zehn Layouts in einer Minute erzeugen; zu wissen, welches das richtige ist und warum – das bleibt nach wie vor die eigentliche Arbeit."],
              ["Specs schlagen Stimmungen.", "Konkrete Vorgaben (Tokens, Raster, Bewegungsregeln) lieferten weit bessere Ergebnisse als 'mach es moderner'."],
              ["Review wie ein Lead.", "Jeden Durchgang habe ich wie ein Design-Crit behandelt: behalten, streichen, verfeinern. Tempo hoch, Messlatte oben."],
              ["Das Ergebnis gehört mir.", "Es lebt nach wie vor in meinem Repo, in Code, den ich verstehe und bis zum letzten Pixel bearbeiten kann."]].map(([b, t]) => (
              <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
            ))}
          </ul>
          <p className="cs-p cs-mt-m" style={{ textAlign: "center", maxWidth: "52ch", marginInline: "auto" }}>
            Das Ergebnis ist ein Portfolio, das endlich wie die Produkte aussieht, über die es berichtet –
            und ein Workflow, den ich auf jeder Produktoberfläche wieder einsetzen würde.
          </p>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { CSSwitch, PFStat, PFStatBand, BrowserShot, SkillMarquee, OldDesignCase, NewDesignCase });
