/* gaming-content.de.jsx – German edition of the B2B mobile gaming platform case study.
   Same structure & components as gaming-content.jsx, German copy sourced from the
   live de/case-study-gaming.html. Exports <GamingCase/>.
   Depends on core.jsx + casestudy-shared.jsx. The page shell lives in casestudy-gaming.jsx. */

const GIMG = "https://alexmedved.com/assets/images/";

function Fig({ src, alt, caption, capAccent }) {
  return (
    <figure className="cs-fig">
      <img src={src} alt={alt} loading="lazy" />
      {caption && (
        <figcaption className="cs-cap">
          {capAccent && <span className="accent">{capAccent} </span>}{caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ---- animated count-up, triggered when scrolled into view ---- */
function useCountUp(target, run, dur = 1300) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setVal(target); return; }
    let raf = 0, start = 0, done = false;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(e * target));
      if (p < 1) raf = requestAnimationFrame(tick);
      else done = true;
    };
    raf = requestAnimationFrame(tick);
    const fb = setTimeout(() => { if (!done) setVal(target); }, dur + 500);
    return () => { cancelAnimationFrame(raf); clearTimeout(fb); };
  }, [run, target, dur]);
  return val;
}

function Stat({ from, to, pre = "", suf = "", text, label }) {
  const ref = useRef(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inView = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      return r.top < vh * 0.85 && r.bottom > 0;
    };
    if (inView()) { setRun(true); return; }
    const onScroll = () => { if (inView()) { setRun(true); cleanup(); } };
    const t = setTimeout(() => { setRun(true); cleanup(); }, 2500);
    function cleanup() { window.removeEventListener("scroll", onScroll); clearTimeout(t); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return cleanup;
  }, []);
  const a = useCountUp(from == null ? 0 : from, run);
  const b = useCountUp(to == null ? 0 : to, run);

  let body;
  if (text) body = text;
  else if (from != null)
    body = <><span className="dim">{pre}{a}</span><span className="arr">→</span><span className="accent">{pre}{b}{suf}</span></>;
  else body = <span className="accent">{pre}{b}{suf}</span>;

  return (
    <div className="gm-stat" ref={ref}>
      <div className="gm-stat-n">{body}</div>
      <div className="gm-stat-k">{label}</div>
    </div>
  );
}

const CYCLE = ["Empathize", "Define", "Ideate", "Prototype", "Test"];
function CycleStrip() {
  return (
    <Reveal className="gm-cycle" role="list" aria-label="Design-Thinking-Zyklus" style={{ justifyContent: "center" }}>
      {CYCLE.map((s, i) => (
        <React.Fragment key={s}>
          <span className="gm-cycle-step" role="listitem">
            <span className="gm-cycle-n">{String(i + 1).padStart(2, "0")}</span>{s}
          </span>
          {i < CYCLE.length - 1 && <span className="gm-cycle-arr" aria-hidden="true">→</span>}
        </React.Fragment>
      ))}
      <span className="gm-cycle-loop" aria-hidden="true" title="Wiederholen, bis gelöst">↻</span>
    </Reveal>
  );
}

function GamingCase() {
  return (
    <div className="cs-view">
      {/* Hero */}
      <section className="cs-section cs-hero">
        <div className="cs-wrap">
          <div className="cs-grid2" style={{ alignItems: "center" }}>
            <div>
              <div className="cs-kicker">
                <Reveal><MonoLabel>Fallstudie · 03 – B2B Mobile Gaming</MonoLabel></Reveal>
                <Reveal as="span" className="mono-sm gm-nda" style={{ color: "var(--ink-faint)" }}>2024 · NDA</Reveal>
              </div>
              <Reveal as="h1" className="cs-title">Eine Gaming-Plattform,<br /><span className="accent">von Grund auf gebaut.</span></Reveal>
              <Reveal as="p" className="cs-sub">Ein leeres Blatt heißt: ein frischer Start</Reveal>
              <Reveal as="p" className="cs-lead">
                Am Anfang gab es nur einen Namen, ein Maskottchen und eine grobe Idee – das war der ganze Brief.
                Alles andere, vom Tone of Voice bis zum fertigen Produkt, mussten wir von null an entwickeln.
                NeoGroup vertraute mir und dem Team, die Idee zum Leben zu erwecken – mit klarem UX-Fokus von der ersten Entscheidung an.
              </Reveal>
              <Reveal as="p" className="cs-cap gm-nda-note">
                Aus Gründen der Vertraulichkeit kann ich hier keine echten Arbeitsvisuals zeigen – aber genug,
                um meinen Beitrag, den Prozess und meinen Ansatz bei einer offenen Designaufgabe nachvollziehbar zu machen.
              </Reveal>
            </div>
            <Reveal>
              <Fig src={GIMG + "B2B-Platform-UI.png"} alt="Halb-Lo-Fi-Wireframe der Plattform-UI"
                caption="Ein Halb-Lo-Fi-Wireframe zur Prüfung von Layout, Abständen und Komponentenverhalten vor dem finalen Hi-Fi-Prototyp." />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Animated stat band */}
      <section className="cs-section gm-stats-sec">
        <div className="cs-wrap">
          <Reveal className="cs-head">
            <h2 className="cs-h">In Zahlen</h2>
            <span className="mono-sm" style={{ color: "var(--ink-faint)" }}>Was die Arbeit bewegt hat</span>
          </Reveal>
          <div className="gm-statband">
            <Stat pre="~" to={4} suf=" Mon." label="Bis MVP1 – planmäßig gelauncht" />
            <Stat to={3} label="Launch-Sprachen · EN / DE / RU" />
            <Stat from={20} to={17} label="ToV-Seiten → Quick-Ref-Slides" />
            <Stat text={<><span className="dim">Tage</span><span className="arr">→</span><span className="accent">Std.</span></>}
              label="Lokalisierungs-Durchlaufzeit" />
          </div>
        </div>
      </section>

      {/* Nutshell */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h2 className="cs-h">Projekt auf einen Blick</h2></div>

          <Reveal className="cs-meta">
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Meine Rolle</div>
              <div className="cs-meta-v">UX-Designer &amp; Writer · Verantwortlich für Tone of Voice · Lead Lokalisierung (EN → DE/RU)</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Zeitrahmen</div>
              <div className="cs-meta-v">MVP1 in ~4 Monaten → laufende Feature-Entwicklung</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Märkte</div>
              <div className="cs-meta-v">Fokus auf EU (DE, ES, IT, FR) + GUS</div>
            </div>
          </Reveal>

          <Reveal className="cs-chips cs-mt-m" style={{ justifyContent: "center" }}>
            {["Tone of Voice", "Registrierung & Onboarding", "Zahlungen", "Treue & Cashback", "Empfehlungen",
              "Achievements", "Saisonale Events", "Lokalisierungs-Pipeline"].map((c) => (
              <span className="tag" key={c}>{c}</span>
            ))}
          </Reveal>

          <div className="cs-grid2 cs-mt-l" style={{ alignItems: "stretch" }}>
            <Reveal className="cs-panel" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h4>Team &amp; Zusammenarbeit</h4>
              <p className="cs-p">
                Zusammenarbeit mit dem Head of UX, <span className="accent">2</span> UX-Researchern,{" "}
                <span className="accent">2</span> Designern, einem Plattform-Koordinator und{" "}
                <span className="accent">3</span> Entwicklern.
              </p>
              <p className="cs-p">
                Mitglied des <strong>3-köpfigen UX-Review-Boards</strong>, Betreuung von{" "}
                <strong>4 Junioren</strong> sowie Abstimmung mit Legal/Compliance und Country-Managern.
              </p>
            </Reveal>
            <Reveal className="cs-panel cs-panel-accent">
              <h4>Meine Highlights</h4>
              <ul className="cs-steps">
                {["Eine Tone of Voice definiert, die zum Unternehmensstandard über alle Sprachen wurde",
                  "MVP1 planmäßig in EN/DE/RU gelauncht – mit sauberen, konsistenten Kernflows",
                  "Engagement-Features ausgeliefert – Achievements, Empfehlungen – die die Retention steigerten",
                  "Lokalisierungsdurchlauf von Tagen auf Stunden verkürzt – mit skalierbarem Workflow"].map((t) => (
                  <li className="cs-li" key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal className="gm-tools cs-mt-m">
            <span className="gm-tools-k">Tools</span>
            <span className="gm-tools-v">Figma · Miro · Jira · Notion · Trello · interne Lokalisierungs-Microservices · GPT-4 / 3.5 für Ideation</span>
          </Reveal>
        </div>
      </section>

      {/* Starting point */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-grid2">
            <div>
              <div className="cs-head"><h3 className="cs-h">Ausgangspunkt</h3></div>
              <p className="cs-p">
                In der ersten Phase ging es um Antworten: wofür die Marke stehen soll, welches Erlebnis wir schaffen
                und wie wir die Nutzer:innen glaubwürdig erreichen. Die eigentliche Herausforderung lag nicht im
                Erstellen von Assets, sondern darin, die richtigen Fragen zu stellen, Ansätze auszuprobieren und einen
                klaren Fahrplan zu entwickeln, der Design-, Content- und Produktentscheidungen für die kommenden Monate leiten würde.
              </p>
              <h4 className="gm-subh">Zentrale Schwerpunkte</h4>
              <p className="cs-p">
                Die Rolle der Marke klären, Richtungen ausloten und ein Fundament schaffen, das Authentizität,
                Compliance und Nutzerengagement in Einklang bringt – als Basis für alles, was danach kam.
              </p>
            </div>
            <Reveal className="cs-panel">
              <h4>Kernziele</h4>
              <ul className="cs-steps">
                {[["Registrierungen fördern.", "Den Sign-up zum naheliegenden, reibungsarmen nächsten Schritt machen."],
                  ["Erste Einzahlungen anstoßen.", "Neue Nutzer:innen schnell und sicher zum Mehrwert führen."],
                  ["Compliant bleiben.", "Vorgaben der Zielmärkte erfüllen – Deutschland, Spanien, Italien, Frankreich…"]].map(([b, t]) => (
                  <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Iterative testing */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Iteratives Testen &amp; Optimieren</h3></div>
          <p className="cs-p" >
            In der ersten Testphase habe ich die User Journeys detailliert erfasst und analysiert. Das deckte auf,
            was die UX beeinträchtigte – Unstimmigkeiten in Abläufen, technische Bugs und UI-Entscheidungen, die
            weniger intuitiv waren als gewünscht. Wir haben sie mit einem klaren Design-Thinking-Zyklus aufgearbeitet
            und ihn wiederholt, bis die Probleme gelöst waren und das Produkt an echten Nutzerbedürfnissen ausgerichtet blieb.
          </p>
          <CycleStrip />
          <p className="cs-p cs-mt-m" >
            Dank dieses Prozesses lieferte das Team in Rekordzeit ein <span className="accent">hochwertiges,
            startbereites Produkt</span> – ohne Abstriche bei UX oder Barrierefreiheit.
          </p>
          <Reveal className="cs-mt-l">
            <Fig src={GIMG + "Screenshot-Figma.png"} alt="Nachstellung der frühen Projektphasen in Figma"
              caption="Eine Nachstellung der frühen Phasen: Storyframes, erste Tone-of-Voice-Definition und Lo-Fi-Prototypen mit Text-Entwürfen. Als illustratives Beispiel erstellt, da interne Dateien vertraglich geschützt sind."
              capAccent="Frühe Phasen →" />
          </Reveal>
        </div>
      </section>

      {/* Tone of Voice */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-grid2" style={{ alignItems: "center" }}>
            <Reveal>
              <Fig src={GIMG + "Screenshot-Figma2.png"} alt="Nachstellung der ToV-Define-Phase"
                caption="Nachstellung der ersten Define-Phase, in der wir die Grundlage für die Tone of Voice gelegt haben – der Referenzpunkt für jede spätere Design- und Content-Entscheidung." />
            </Reveal>
            <div>
              <div className="cs-head"><h3 className="cs-h">Sprachstil (Tone of Voice)</h3></div>
              <p className="gm-quote">Klarheit über <span className="accent">stilistischen Spielereien.</span></p>
              <p className="cs-p cs-mt-s">
                Die Stimme der Marke habe ich früh definiert – immer inklusiv, nahbar und nutzerorientiert. Das
                vollständige ToV-Dokument umfasste <span className="accent">über 20 Seiten</span>: Grundlagen, Regeln,
                Beispiele, Zeichensetzung, sogar „Komma bei Aufzählungen mit ‚und‘: ja oder nein?“. Da niemand so etwas
                von vorn bis hinten liest, habe ich es zu einer <span className="accent">17-seitigen</span> Quick Reference
                fürs ganze Unternehmen verdichtet.
              </p>
              <p className="cs-p">
                Unter meiner Betreuung wurde sie mit Country-Managern und Übersetzer:innen pro Markt lokalisiert und
                angepasst – konsistent und kulturell relevant für jede:n Nutzer:in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MVP1 and beyond */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-grid2">
            <div>
              <div className="cs-head"><h3 className="cs-h">MVP1 – und weit darüber hinaus</h3></div>
              <p className="cs-p">
                Für MVP1 verantwortete ich die Kernflows: Registrierung, Onboarding, Zahlungen, erste Promotions und
                die Lokalisierung ins Englische, Deutsche und Russische. Es wurde termingerecht gelauncht und erfüllte
                alle regulatorischen Anforderungen.
              </p>
              <p className="cs-p">
                Nach dem Launch ging die Arbeit weiter. Als eines von drei Mitgliedern des UX-Review-Boards musste jedes
                neue Feature unsere Prüfung bestehen, bevor es in die Entwicklung ging. Parallel verantwortete oder
                begleitete ich zentrale Flows – <strong>Treueprogramm, Referral-Programm, Achievements, Adventskalender</strong>
                {" "}– sowie einige noch nicht angekündigte Features, jeweils durch Research → Prototyping → Testing → Verfeinerung.
              </p>
              <p className="cs-p">
                So entwickelte sich das Produkt auf eine Weise weiter, die sich
                <span className="accent"> natürlich und benutzerfreundlich</span> anfühlt – ein Erlebnis, das
                Spieler:innen konvertiert und bindet und dabei intuitiv bleibt.
              </p>
            </div>
            <Reveal>
              <Fig src={GIMG + "Important-Lo-Fi.png"} alt="Rekonstruierte Lo-Fi-Wireframes – mobile Leaderboards und Web-Flows"
                caption="Rekonstruierte Lo-Fi-Wireframes: experimentelle mobile Leaderboards und Web-Flow-Prototypen zur App-Einführung." />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Ergebnisse</h3></div>
          <p className="cs-p" >
            Das war ein interdisziplinäres Projekt – die Chance, neue Rollen zu übernehmen und Design-, Content- und
            Produktentscheidungen der Plattform zu prägen, und damit sowohl das Spielerlebnis als auch die
            Markenkommunikation zu beeinflussen. Die wichtigsten Ergebnisse:
          </p>
          <div className="cs-grid2 cs-mt-m">
            <ul className="cs-steps">
              {[["Engagement & Bindung gesteigert.", "Features wie Achievements führten zu klaren Anstiegen bei Registrierungen, Ersteinzahlungen und wöchentlicher Retention."],
                ["Die Markenstimme definiert.", "Die ToV wurde zum unternehmensweiten Standard über Produkt, Marketing und Support – mit einer menschlichen, vertrauenswürdigen Persönlichkeit."],
                ["Lokalisierung beschleunigt.", "Eine skalierbare Content-Pipeline verkürzte die Lokalisierung neuer Features von Tagen auf Stunden – ohne Einbußen bei Qualität oder Compliance."]].map(([b, t]) => (
                <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
              ))}
            </ul>
            <ul className="cs-steps">
              {[["Teamübergreifende Abstimmung.", "An der Schnittstelle von UX, Design und Compliance gearbeitet, damit Features Erlebnis-, Geschäfts- und Regulierungs-Checks erfüllten."],
                ["Teamentwicklung.", "4 Junioren geschult und begleitet, Review-Praktiken eingeführt und Content zu einem strategischen Produktbestandteil gemacht."],
                ["Zentrale Flows umgesetzt.", "Entscheidungen zu Loyalität, Empfehlungen und saisonalen Promotions mitgestaltet – Content und UX als integraler Teil der Produktstrategie."]].map(([b, t]) => (
                <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Learnings */}
      <section className="cs-section">
        <div className="cs-prose">
          <div className="cs-head" style={{ justifyContent: "center" }}><h3 className="cs-h">Erkenntnisse</h3></div>
          <p className="cs-p" style={{ textAlign: "center" }}>
            Diese Plattform zu bauen war ein Crashkurs darin, Produkt und Marke von Grund auf auszuliefern. Sie machte
            aus mir – einem UX-Designer – einen strategischen Partner über Design, Compliance und Growth hinweg.
          </p>
          <ul className="cs-steps cs-mt-m">
            {[["Kreativität und Anforderungen vereinen.", "Kommunikation spielerisch gestalten und zugleich strikte Regulierung und Geschäftsanforderungen erfüllen – Lösungen, die für alle funktionieren."],
              ["Eine einheitliche Stimme skalieren.", "ToV-Richtlinien zu schreiben ist das eine; sie über Länder und Sprachen hinweg tragfähig zu halten, ohne ihren Kern zu verlieren, das andere."],
              ["Wie ein Product Owner denken.", "Das Review-Board lehrte mich, als Stratege zu entscheiden – Nutzerbedürfnisse, Geschäftsziele und technische Machbarkeit abzuwägen."],
              ["Mit Content führen.", "Writer zu betreuen und teamübergreifend zu arbeiten zeigte mir: Content-Führung prägt Prozesse, Features und sogar Kultur."]].map(([b, t]) => (
              <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { GamingCase });
