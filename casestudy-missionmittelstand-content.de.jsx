/* casestudy-missionmittelstand-content.de.jsx — Mission Mittelstand, deutsche Ausgabe.
   Gleiche Struktur & Komponenten wie casestudy-missionmittelstand-content.jsx,
   deutsche Copy. Exportiert <MMCase/>, <MMDisclaimer/>, <MMPrototypeModal/>.
   Wird aus prod/de/ geladen — daher die "../"-Pfade. */

const MMI = "../mm/";
const PROTOTYPE_FILE = "../mm/prototype-mobile.html";

/* ---- Browser-Chrome-Screenshot (Desktop); URL ist statischer Text, nie ein Link ---- */
function MMShot({ src, caption, alt = "Mission Mittelstand Landingpage", url = "mission-mittelstand.de", badge, badgeKind, placeholder }) {
  const open = useLightbox();
  return (
    <figure className="mm-shot">
      <div className="mm-shell">
        <div className="mm-chrome">
          <span className="mm-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span className="mm-url">{url}</span>
          {badge && <span className={"mm-badge" + (badgeKind ? " is-" + badgeKind : "")}>{badge}</span>}
        </div>
        {src ? (
          <button type="button" className="mm-shot-img" data-hot onClick={() => open({ src, alt, caption })} aria-label={"Bild vergrößern: " + alt}>
            <img src={src} alt={alt} loading="eager" />
            <span className="mm-zoom" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
            </span>
          </button>
        ) : <Placeholder label={placeholder} />}
      </div>
      {caption && <figcaption className="cs-cap">{caption}</figcaption>}
    </figure>
  );
}

/* ---- Phone-Rahmen (Mobile) ---- */
function MMPhone({ src, caption, alt = "Mission Mittelstand mobil", placeholder, tag, tagKind }) {
  const open = useLightbox();
  return (
    <figure className="mm-phone">
      <div className="mm-phone-frame">
        {tag && <span className={"mm-phone-tag" + (tagKind ? " is-" + tagKind : "")}>{tag}</span>}
        {src ? (
          <button type="button" className="mm-phone-shot" data-hot onClick={() => open({ src, alt, caption })} aria-label={"Bild vergrößern: " + alt}>
            <img src={src} alt={alt} loading="eager" />
          </button>
        ) : <Placeholder label={placeholder} />}
      </div>
      {caption && <figcaption className="cs-cap">{caption}</figcaption>}
    </figure>
  );
}

function Placeholder({ label }) {
  return (
    <div className="mm-ph">
      <span className="mm-ph-ico" aria-hidden="true">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 15l5-5 4 4 3-3 6 6" /><circle cx="8.5" cy="8.5" r="1.5" />
        </svg>
      </span>
      <span className="mm-ph-t">{label || "Screen"}</span>
      <span className="mm-ph-s">Prototyp-Export kommt hierhin</span>
    </div>
  );
}

/* ---- animierte Kennzahl ---- */
function MMStat({ to, pre = "", suf = "", text, label }) {
  const ref = useRef(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const inView = () => { const r = el.getBoundingClientRect(); return r.top < (window.innerHeight || 800) * 0.85 && r.bottom > 0; };
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
    let raf = 0, start = 0, done = false; const target = to == null ? 0 : to; const dur = 1300;
    const tick = (t) => { if (!start) start = t; const p = Math.min((t - start) / dur, 1); setVal(Math.round((1 - Math.pow(1 - p, 3)) * target)); if (p < 1) raf = requestAnimationFrame(tick); else done = true; };
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

function MPlain({ items }) {
  return <ul className="cs-steps">{items.map((t, i) => <li className="cs-li" key={i}>{t}</li>)}</ul>;
}
function KL({ items }) {
  return <ul className="cs-steps">{items.map(([b, t], i) => <li className="cs-li" key={i}><strong>{b}</strong> {t}</li>)}</ul>;
}

/* die fünf Schwachstellen */
const GAPS = [
  ["01 · Nutzen", "Mehr Bühne für die Firma als für die Vorlage", "Die Seite räumt Mission Mittelstand mehr Raum ein als der Vorlage selbst. Ihr konkreter Nutzen \u2014 also was man mit dem Download tatsächlich bekommt \u2014 wird kaum erklärt."],
  ["02 · Momentum", "Zwei CTAs, eine ganze Seite dazwischen", "Es gibt nur zwei CTAs: einen weit oben, einen fast am Ende. Wer den ersten verpasst, bekommt erst deutlich später wieder die Möglichkeit zum Download."],
  ["03 · Erwartung", "Ein \u201EDownload\u201C, der ein Formular öffnet", "Jeder CTA sagt \u201EVorlage herunterladen\u201C, doch der Klick öffnet zunächst ein Modal mit Kontaktdaten. Die PDF kommt erst später per E-Mail. Das entspricht nicht dem, was der CTA verspricht, und erzeugt direkt vor dem Abschluss unnötige Reibung."],
  ["04 · Mobile UX", "Auf dem Smartphone wird's holprig", "Große Abschnitte mit wenig Inhalt, ein Layout, das gegen Ende unruhig wird, und ein überdimensionierter Footer machen die Seite auf Mobile schwerfälliger als nötig \u2014 obwohl Mobile hier die Hauptrolle spielt."],
  ["05 · Social Proof", "Trustpilot, verschenkt", "4,5 Sterne aus 870 Trustpilot-Bewertungen sind starker Social Proof, erscheinen aber nur im Modal. Auf der Landingpage selbst tauchen sie nicht auf und sind auch nicht verlinkt. Ein starkes Vertrauenssignal bleibt damit ungenutzt."],
];

/* Vorher-Belege (ihre Landingpage, im Phone-Rahmen) */
const BEFORE = [
  [MMI + "before-hero.png", "Der Hero verspricht \u201EVorlage herunterladen\u201C \u2013 also einen direkten Download."],
  [MMI + "before-modal.png", "Stattdessen öffnet der Klick ein Formular, und die PDF kommt erst später per E-Mail."],
  [MMI + "before-modal-trustpilot.png", "Die 4,5-Sterne-Bewertung von Trustpilot erscheint erst im Modal, bleibt bis dahin unsichtbar und ist nicht verlinkt."],
  [MMI + "before-wissen.png", "Große Abschnitte enthalten nur wenig Information und machen die Seite auf Mobile unnötig lang."],
  [MMI + "before-footer.png", "Der überdimensionierte Footer verlängert eine ohnehin schon lange mobile Seite zusätzlich."],
];

/* Nachher — der Redesign, Abschnitt für Abschnitt (nutzenorientiert; GIF führt) */
const VISUALS = [
  { n: "01", k: "Sticky-CTA", h: "Der Button, der mitkommt", img: MMI + "sticky-button.gif",
    desc: "Mein liebstes kleines Detail – deshalb kommt es zuerst. Sobald man am Hero-Button vorbeiscrollt, erscheint ein schmaler CTA und bleibt in Daumenreichweite – ein Tipp, und man ist beim Formular. Sobald das Formular selbst im Bild ist, verschwindet er wieder. Er hilft, ohne zu nerven. Die lange Strecke ohne CTA mitten auf der alten Seite? Weg." },
  { n: "02", k: "Nutzen", h: "Was du bekommst – in drei kurzen Punkten", img: MMI + "after-value.png",
    desc: "Direkt unter dem Hero machen drei kurze Punkte den Nutzen der Vorlage klar – ohne Scrollen, ohne Rätselraten. Noch bevor das Formular nach Daten fragt, ist klar, was in der Datei steckt und wofür sie nützlich ist." },
  { n: "03", k: "Vertrauen", h: "Erst harte Zahlen, dann ein echtes Gesicht", img: MMI + "after-stats.png",
    desc: "Die Sektion beginnt mit konkreten Zahlen und stellt danach Matthias vor – Gründer und Geschäftsführer von Mission Mittelstand. So bekommt das Unternehmen ein Gesicht, statt sich nur über Logos zu erklären, und der Vertrauensaufbau wirkt deutlich persönlicher." },
  { n: "04", k: "FAQ", h: "Was dem Original gefehlt hat", img: MMI + "after-faq.png",
    desc: "Auf der Originalseite gab es kein FAQ. Ich habe direkt vor dem Formular eines ergänzt – für genau die Fragen, die an dieser Stelle aufkommen können: Ist die Vorlage wirklich kostenlos? Was bekomme ich genau? Warum braucht ihr meine Telefonnummer? So werden wichtige Details geklärt, die vorher offenblieben." },
  { n: "05", k: "Conversion", h: "Ein CTA, der hält, was er verspricht", img: MMI + "after-form.png",
    desc: "Kein Modal, keine Überraschung. Das Formular steht direkt auf der Seite, der Button sagt \u201EPDF kostenlos erhalten\u201C, und eine Zeile darunter erklärt, warum die einzelnen Angaben gebraucht werden und was als Nächstes passiert. Nichts an diesem Schritt kommt unerwartet." },
  { n: "06", k: "Footer", h: "Ein Footer, der weiß, wann Schluss ist", img: MMI + "after-footer.png",
    desc: "Der alte Footer nahm kein Ende. Ich habe ihn auf die relevanten Links reduziert, das Layout gestrafft und der Seite einen saubereren Abschluss gegeben." },
];

/* ---- Hauptartikel ---- */
function MMCase({ onPrototype }) {
  return (
    <div className="cs-view">

      {/* ── Hero ── */}
      <section className="cs-section cs-hero">
        <div className="cs-wrap">
          <div className="cs-kicker">
            <Reveal><MonoLabel>Fallstudie · Mission Mittelstand</MonoLabel></Reveal>
            <Reveal as="span" className="mono-sm" style={{ color: "var(--ink-faint)" }}>Landingpage · 2026</Reveal>
          </div>
          <div className="ax-hero-grid">
            <Reveal className="ax-hero-text">
              <h1 className="cs-title">Lead-Magnet, <span className="accent">neu aufgebaut</span></h1>
              <p className="cs-sub">Mobile-first-Redesign der Landingpage für Mission Mittelstands kostenlose Vorlage - mit klarerem Funnel und weniger Hürden bis zum Download.</p>
              <p className="cs-lead">
                Mission Mittelstand bietet eine kostenlose Vorlage für Mitarbeitergespräche als Lead-Magnet an. Die Seite hat ein klares Ziel: Downloads. Der Auftrag war ein Mobile-first-Redesign mit genau diesem Fokus. Mobile hatte Priorität, Desktop stand an zweiter Stelle - der Auftritt sollte dabei klar als Mission Mittelstand erkennbar bleiben.
              </p>
              <p className="cs-lead">
                Im Mittelpunkt standen eine klarere Informationsarchitektur und eine neue visuelle Richtung. Der Look sollte weiterhin eindeutig zur Welt von Mission Mittelstand gehören, zugleich aber frischer wirken und der bestehenden Marke mehr Luft geben.
              </p>
              <div className="ax-skip-wrap" style={{ display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
                <a href="#visuals" className="btn btn-accent ax-skip-btn" data-hot>
                  Direkt zu den Visuals
                  <span className="btn-arrow btn-arrow--down"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg></span>
                </a>
                <button type="button" className="btn ax-skip-btn" data-hot onClick={onPrototype}>
                  Prototyp ansehen
                  <span className="btn-arrow btn-arrow--download"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><g className="dl-arrow"><path d="M12 4v8M8 11l4 4 4-4" /></g><path d="M5 19h14" /></svg></span>
                </button>
              </div>
            </Reveal>
            <Reveal className="ax-hero-media">
              <MMPhone src={MMI + "after-hero.png"} alt="Neu gestalteter mobiler Hero von Mission Mittelstand"
                caption={<><strong>Der neue Mobile-Hero.</strong></>} />
            </Reveal>
            <div className="ax-skip-wrap mm-cta-mobile">
              <a href="#visuals" className="btn btn-accent ax-skip-btn" data-hot>
                Direkt zu den Visuals
                <span className="btn-arrow btn-arrow--down"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg></span>
              </a>
              <button type="button" className="btn ax-skip-btn" data-hot onClick={onPrototype}>
                Prototyp ansehen
                <span className="btn-arrow btn-arrow--download"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><g className="dl-arrow"><path d="M12 4v8M8 11l4 4 4-4" /></g><path d="M5 19h14" /></svg></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="cs-section gm-stats-sec">
        <div className="cs-wrap">
          <div className="gm-statband mm-statband">
            <MMStat to={6} label="ABSCHNITTE IM NEUEN FUNNEL ENTWICKELT" />
            <MMStat to={5} label="CONVERSION-SCHWACHSTELLEN GEFUNDEN" />
            <MMStat to={3} label="PROTOTYP-RICHTUNGEN VERGLICHEN" />
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
              <div className="cs-meta-v">Funnel-Strategie, Landingpage-UX, UX-Writing, Mobile-first-UI-Design und ein interaktiver HTML-Prototyp</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Format</div>
              <div className="cs-meta-v">Unternehmensbriefing, Konzeptprojekt - keine Live-Daten verfügbar</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Rahmenbedingungen</div>
              <div className="cs-meta-v">Schrift Barlow · bestehende visuelle Identität von Mission Mittelstand · Mobile Pflicht / Desktop zweitrangig · ohne Komponentenbibliotheken umsetzbar</div>
            </div>
          </Reveal>
          <Reveal className="cs-chips cs-mt-m" style={{ justifyContent: "center" }}>
            {["Funnel-Strategie", "Landingpage-UX", "UX-Writing", "Mobile-First-UI", "Conversion-Architektur", "Trust & Social Proof", "Interaktiver Prototyp"].map((c) => (
              <span className="tag" key={c}>{c}</span>
            ))}
          </Reveal>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel">
              <h4>Was ich umgesetzt habe</h4>
              <MPlain items={[
                "Eine neue Informationsarchitektur für die Landingpage",
                "Ein interaktiver mobiler HTML-Prototyp als zentrales Deliverable",
                "Eine bewusst schlank gehaltene Desktop-Version",
                "Überarbeitete CTA-Texte und ein Sticky-CTA, der beim Scrollen sichtbar bleibt",
                "Ein Inline-Formular statt des ursprünglichen Download-Modals, das den Ablauf von Anfang an klar macht",
              ]} />
            </Reveal>
            <Reveal className="cs-panel cs-panel-accent">
              <h4>Die Hypothese</h4>
              <MPlain items={[
                "Der meiste Traffic kommt aus gezielten Kampagnen. Besucher bringen also bereits Grundinteresse mit",
                "Die Originalseite bremst Besucher durch einen unklaren Nutzen, einen umständlichen Download-Prozess und eine schwache mobile UX aus",
                "Ein strafferer Funnel, der den Nutzen früher vermittelt und Hürden abbaut, sollte mehr Downloads bringen",
                "Ob das stimmt, müssen Live-Daten zeigen",
              ]} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Mögliche Reibungspunkte ── */}
      <section className="cs-section" id="process">
        <span className="ax-anchor" aria-hidden="true"></span>
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Mögliche Reibungspunkte</h3></div>
          <p className="cs-p">
            Die Landingpage ist der letzte Schritt gezielter Kampagnen rund um die Vorlage. Ich habe mir angesehen, was passiert, sobald Besucher auf der Seite landen: wie klar der Nutzen wird, wie leicht der nächste Schritt fällt und wo auf dem Weg zum Download Reibung entsteht. Fünf Punkte stechen heraus.</p>
          <div className="mm-gaps mm-gaps--5 cs-mt-l">
            {GAPS.map(([n, t, d]) => (
              <Reveal className="mm-gap" key={n}>
                <span className="mm-gap-n">{n}</span>
                <span className="mm-gap-t">{t}</span>
                <span className="mm-gap-d">{d}</span>
              </Reveal>
            ))}
          </div>

          <p className="cs-p cs-mt-l">
            Ein genauerer Blick auf die Originalseite:
          </p>
          <div className="mm-carousel cs-mt-s">
            {BEFORE.map(([src, cap]) => (
              <MMPhone key={src} src={src} tag="Vorher" tagKind="before" alt="Originale Mission Mittelstand Landingpage"
                caption={cap} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Wie ich sie neu gebaut habe ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Wie ich sie neu aufgebaut habe</h3></div>
          <p className="cs-p">
            Ausgangspunkt war die bestehende Nutzerführung: die Seite selbst, ihre Zielgruppe und der Weg von der Kampagne bis zum Download. Von dort aus habe ich die Struktur überarbeitet, mehrere Richtungen getestet und die stärkste als funktionierenden Prototyp umgesetzt.
          </p>
          <div className="mm-journey cs-mt-l">
            {[
              ["Die Seite aus Besuchersicht lesen", "Ich bin die Originalseite so durchgegangen, wie ein Besucher es tun würde \u2013 auf dem Smartphone \u2013 und habe Angebot, Zielgruppe und den Weg vom Einstieg bis zum Download erfasst, bevor ich etwas verändert habe."],
              ["Reibung und Potenzial markieren", "Ich habe die wichtigsten Reibungspunkte markiert \u2013 und genauso die Stellen, die deutlich mehr leisten könnten."],
              ["Eine Arbeitshypothese festlegen", "Daraus wurde eine klare Arbeitsrichtung: den Nutzen der Vorlage früh zeigen, den Download-Ablauf klar machen und den CTA immer in Reichweite halten."],
              ["Drei Richtungen skizzieren", "Ich habe drei strukturell unterschiedliche erste Prototypen gebaut und direkt verglichen, bevor ich mich für eine Richtung entschieden habe."],
              ["Die stärkste Richtung wählen", "Ich habe die Variante gewählt, die die Hauptaufgabe am besten unterstützt \u2013 die Vorlage zum Download zu bringen \u2013 und die beiden anderen beiseitegelegt."],
              ["Auf Hi-Fi bringen", "Die gewählte Richtung habe ich zu einem vollständigen High-Fidelity-Design ausgearbeitet \u2013 klar als Mission Mittelstand erkennbar und realistisch umsetzbar."],
              ["Klickbar machen", "Zum Schluss habe ich einen interaktiven, mobile-first HTML-Prototyp gebaut, durch den man sich wie durch eine echte Seite bewegen kann \u2013 statt nur einzelne statische Screens anzusehen."],
            ].map(([b, t], i) => (
              <Reveal className="mm-jstep" key={i}>
                <span className="mm-jnode" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div className="mm-jcard">
                  <h4 className="mm-jt">{b}</h4>
                  <p className="mm-jd">{t}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visuals (Zickzack) ── */}
      <section className="cs-section" id="visuals">
        <span className="ax-anchor" aria-hidden="true"></span>
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Das Redesign, Abschnitt für Abschnitt</h3></div>
          <div className="ax-screens cs-mt-l">
            {VISUALS.map((s, i) => (
              <div className={"ax-screen" + (i % 2 ? " rev" : "")} key={s.n}>
                <Reveal className="ax-screen-text">
                  <div className="ax-index"><span className="ax-index-n">{s.n}</span><span className="ax-index-k">{s.k}</span></div>
                  <h4 className="ax-screen-h">{s.h}</h4>
                  <p className="cs-p">{s.desc}</p>
                </Reveal>
                <Reveal className="ax-screen-media">
                  <MMPhone src={s.img} alt={s.h} />
                </Reveal>
              </div>
            ))}
          </div>
          <Reveal className="mm-proto-cta cs-mt-l">
            <div>
              <h4 className="gm-subh" style={{ marginTop: 0 }}>Probier es selbst aus</h4>
              <p className="cs-p" style={{ margin: 0 }}>Der komplette Flow läuft als eigenständiger HTML-Prototyp – am besten auf dem Smartphone öffnen.</p>
            </div>
            <button type="button" className="btn btn-accent" data-hot onClick={onPrototype}>
              Mobilen Prototyp testen
              <span className="btn-arrow btn-arrow--download"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><g className="dl-arrow"><path d="M12 4v8M8 11l4 4 4-4" /></g><path d="M5 19h14" /></svg></span>
            </button>
          </Reveal>
        </div>
      </section>

      {/* ── Desktop ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Das Desktop-MVP</h3></div>
          <Reveal>
            <p className="cs-p">
              Mobile hatte Priorität, deshalb habe ich die Desktop-Version bewusst schlank gehalten: dieselbe Funnel-Logik und Botschaft, umgesetzt als funktionierender Prototyp, ohne das breitere Layout unnötig auszuarbeiten. Mit mehr Zeit würde ich Skalierung und Abstände weiter verfeinern und den mittleren Sektionen mehr visuelle Tiefe geben. Der Kern steht bereits. Mit mehr Zeit würde ich die Skalierung schärfen und die Abschnitte in der Seitenmitte reichhaltiger gestalten — aber die ganze Geschichte steht bereits hier.
            </p>
          </Reveal>
          <Reveal className="mm-mvp-shot">
            <MMShot src={MMI + "after-desktop.png"} url="Neuer Desktop-Hero" badge="Nachher" badgeKind="after"
              alt="Neu gestaltete Mission Mittelstand Landingpage auf dem Desktop"
              caption={<>Derselbe Funnel, breiteres Format. Die Desktop-Version bleibt bewusst schlank, mit vollständiger Nutzerführung und Botschaft.</>} />
          </Reveal>
        </div>
      </section>

      {/* ── Learnings ── */}
      <section className="cs-section">
        <div className="cs-prose">
          <div className="cs-head" style={{ justifyContent: "center" }}><h3 className="cs-h">Erkenntnisse</h3></div>
          <ul className="cs-steps cs-mt-m">
            {[
              ["Mit einer klaren Hypothese starten.", "Eine klare Arbeitshypothese gibt dem Redesign Richtung und macht einzelne Designentscheidungen leichter nachvollziehbar und bewertbar."],
              ["CTA und Ablauf müssen zusammenpassen.", "Wenn der Button genau das verspricht, was danach passiert, wird der Weg zum Download klarer und vermeidet unnötige Überraschungen an einem entscheidenden Punkt."],
              ["Den Nutzen früh zeigen.", "Bei einer Lead-Magnet-Landingpage sollte der konkrete Nutzen der Vorlage von Anfang an klar sein. Die Unternehmensstory kann weiter unten unterstützen."],
            ].map(([b, t], i) => <li className="cs-li" key={i}><strong>{b}</strong> {t}</li>)}
          </ul>
        </div>
      </section>

    </div>
  );
}

/* ---- Download-Modal für den interaktiven Prototyp ---- */
function MMPrototypeModal({ open, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current && closeRef.current.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="contact-modal" role="dialog" aria-modal="true" aria-label="Mobiler Prototyp"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="contact-modal-card mm-proto-card">
        <button className="legal-x contact-modal-x" onClick={onClose} aria-label="Schließen" data-hot ref={closeRef}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
        <div className="contact-modal-head">
          <MonoLabel>Mobiler Prototyp</MonoLabel>
          <h2 className="contact-modal-title">Sieh ihn dir auf dem Handy an</h2>
          <p className="contact-modal-sub">Das ist eine in sich geschlossene Offline-Seite — sie existiert nur als diese eine Datei. Lade sie herunter und öffne sie dann in einem beliebigen Browser (ein Handy oder die mobile Ansicht deines Browsers funktioniert am besten).</p>
        </div>
        <div className="mm-proto-actions">
          <a className="btn btn-accent" href={PROTOTYPE_FILE} download="mission-mittelstand-prototype.html" data-hot onClick={onClose}>
            Den Prototyp herunterladen
            <span className="btn-arrow btn-arrow--download"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><g className="dl-arrow"><path d="M12 4v8M8 11l4 4 4-4" /></g><path d="M5 19h14" /></svg></span>
          </a>
          <button className="btn" onClick={onClose} data-hot>Vielleicht später</button>
        </div>
      </div>
    </div>
  );
}

/* ---- Marken- / Nutzungshinweis (vom Shell unter dem Abschluss-CTA gerendert) ---- */
function MMDisclaimer() {
  return (
    <section className="cs-section mm-disclaimer-sec">
      <div className="cs-wrap">
        <div className="mm-disclaimer">
          <span className="mm-disclaimer-ico" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>
          </span>
          <div>
            <p>
              <strong style={{ color: "var(--ink-soft)" }}>Marken &amp; Nutzung.</strong> „Mission Mittelstand“, die BVMW-Marke sowie alle zugehörigen Namen, Logos, Bilder und Markenelemente, die hier gezeigt werden, sind Eigentum ihrer jeweiligen Inhaber. Ich besitze daran keine Rechte und erhebe auch keinen Anspruch darauf.
            </p>
            <p>
              Diese Fallstudie entstand zu einem Briefing der Firma, und alle gezeigten Markenmaterialien wurden mir zu diesem Zweck bereitgestellt — hier ausschließlich wiedergegeben, um meine Arbeit zu dokumentieren. Es handelt sich um ein unabhängiges Konzept: nicht mit Mission Mittelstand verbunden, nicht von ihr unterstützt und kein offizielles Produkt, und es wurde nie auf einer Live-Seite eingesetzt.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { MMCase, MMDisclaimer, MMPrototypeModal });
