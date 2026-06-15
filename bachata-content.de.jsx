/* bachata-content.de.jsx – German edition of the Bachata School case study.
   Same structure & components as bachata-content.jsx, German copy sourced from the
   live de/case-study-bachata.html. Exports <BachataCase/>.
   Depends on core.jsx + casestudy-shared.jsx. The page shell lives in casestudy-bachata.jsx. */

const BIMG = "https://alexmedved.com/assets/images/";

/* render **bold** markers inside a string */
function mb(text) {
  return String(text).split(/\*\*(.+?)\*\*/g).map((p, i) =>
    i % 2 ? <strong key={i}>{p}</strong> : p
  );
}

/* ---- animated count-up, triggered when scrolled into view (branded stat band) ---- */
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

/* interaktiver Vorher/Nachher-Vergleich – segmentierter Umschalter morpht dieselbe
   Bühne zwischen Original und überarbeitetem Screen, die Notizen wechseln synchron.
   Bilder sind klickbar und öffnen sich in der gemeinsamen Lightbox. */
function BAToggle({ index, title, before, after }) {
  const [view, setView] = useState("before");
  const open = useLightbox();
  const isAfter = view === "after";
  const active = isAfter ? after : before;
  const cardRef = useRef(null);
  useEffect(() => {
    if (cardRef.current) cardRef.current.classList.toggle("is-after", isAfter);
  }, [isAfter]);
  return (
    <div className="reveal ba2-card" ref={cardRef}>
      <div className="ba2-top">
        <h4 className="ba2-title">
          <span className="ba2-idx">{String(index).padStart(2, "0")}</span>{title}
        </h4>
        <div className="ba2-seg" role="tablist" aria-label={title + " Vorher und Nachher"}>
          <button type="button" role="tab" aria-selected={!isAfter} data-hot
            className={"ba2-seg-btn" + (!isAfter ? " on" : "")} onClick={() => setView("before")}>Vorher</button>
          <button type="button" role="tab" aria-selected={isAfter} data-hot
            className={"ba2-seg-btn" + (isAfter ? " on" : "")} onClick={() => setView("after")}>Nachher</button>
        </div>
      </div>
      <div className="ba2-body">
        <div className="ba2-stage">
          <button type="button" className="ba2-figbtn" data-hot
            onClick={() => open({ src: active.img, alt: active.alt })}
            aria-label={(isAfter ? "Nachher" : "Vorher") + "-Screen vergrößern: " + active.alt}>
            <span className={"cs-ba-tag" + (isAfter ? " is-after" : "")}>{isAfter ? "Nachher" : "Vorher"}</span>
            <img className={"ba2-img" + (!isAfter ? " show" : "")} src={before.img} alt={before.alt} loading="lazy" />
            <img className={"ba2-img" + (isAfter ? " show" : "")} src={after.img} alt={after.alt} loading="lazy" />
            <span className="zoomfig-ico" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </span>
          </button>
        </div>
        <div className="ba2-notes" key={view}>
          <div className="ba2-notes-k">{isAfter ? "Was sich geändert hat" : "Erkannte Probleme"}</div>
          <ul className="cs-steps ba2-list">
            {active.points.map((p, i) => <li className={"cs-li" + (isAfter ? " ba-li-after" : "")} key={i}>{mb(p)}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

const BA_PAIRS = [
  {
    title: "Haupt-Flow",
    before: {
      img: BIMG + "Screenshot-Bachata-Doc33.jpg",
      alt: "Vorher – Hero und Haupt-Flow",
      points: [
        "Keine klare **„Book Now“-Schaltfläche**",
        "Schwerfällige, wenig einladende Sprache",
        "Unterschiedliche Kartengrößen, uneinheitliches Layout",
        "Schlechte Erfassbarkeit für schnelle Entscheidungen",
      ],
    },
    after: {
      img: BIMG + "Screenshot-Bachata-Doc44.png",
      alt: "Nachher – Hero mit Book Now und verbessertem Microcopy",
      points: [
        "Klare **„Book Now“-Schaltfläche** hinzugefügt",
        "„Package“ durch **„Pass“** ersetzt – spielerisch und vertraut",
        "Einheitliche Kartengrößen für mehr Konsistenz",
        "Sprache und Struktur überarbeitet und Bullet Points eingeführt",
      ],
    },
  },
  {
    title: "Infoblock",
    before: {
      img: BIMG + "Screenshot-Bachata-Doc55.jpg",
      alt: "Vorher – dichter Infoblock",
      points: [
        "Große, einheitliche Textblöcke",
        "Keine visuelle Hervorhebung, schwer zu überfliegen",
        "Wichtige Infos in langen Absätzen versteckt",
      ],
    },
    after: {
      img: BIMG + "Screenshot-Bachata-Doc66.png",
      alt: "Nachher – erfassbare Infos mit Hervorhebung",
      points: [
        "Passende **Emojis** zur leichteren Orientierung ergänzt",
        "Texte für bessere Lesbarkeit gekürzt",
        "Wichtige Details in **Fettschrift** hervorgehoben, schnell erfassbar",
      ],
    },
  },
  {
    title: "Kernpunkte / Vorteile",
    before: {
      img: BIMG + "Screenshot-Bachata-Doc11.jpg",
      alt: "Vorher – Abschnitt Kernpunkte / Vorteile",
      points: [
        "Schwache oder fehlende Überschriften",
        "Lange Zeilen ohne Rhythmus",
        "Text wirkte nicht nativ und schwer verständlich",
      ],
    },
    after: {
      img: BIMG + "Screenshot-Bachata-Doc22.png",
      alt: "Nachher – klarere Vorteile mit starken Überschriften",
      points: [
        "Starke, gut sichtbare Überschriften hinzugefügt",
        "Neu formuliert für **Klarheit und Tonalität**",
        "Einfache, natürliche Sprache – deutlich verständlicher",
      ],
    },
  },
];

function BachataCase() {
  return (
    <div className="cs-view">
      {/* Hero */}
      <section className="cs-section cs-hero">
        <div className="cs-wrap">
          <div className="cs-grid2" style={{ alignItems: "center" }}>
            <div>
              <div className="cs-kicker">
                <Reveal><MonoLabel>Fallstudie · 04 – Bachata-Schule</MonoLabel></Reveal>
                <Reveal as="span" className="mono-sm" style={{ color: "var(--ink-faint)" }}>2024 · ein Abend</Reveal>
              </div>
              <Reveal as="h1" className="cs-title">Klarere Worte,<br /><span className="accent">besseres UX.</span></Reveal>
              <Reveal as="p" className="cs-sub">Von überladenen Texten zu einer klaren, conversion-starken Seite an einem Abend</Reveal>
              <Reveal as="p" className="cs-lead">
                Ein intensiver UX-Writing- und Content-Sprint: Ich überprüfte die gesamte Seite, fand die
                Pain Points und formulierte die wichtigsten Bereiche neu. So konnten neue Nutzer das Angebot
                sofort erfassen, Preise auf einen Blick sehen und die Trainer ohne Hürden erreichen – eine
                nutzerfreundlichere Seite, die sich leichter erfassen und bedienen lässt.
              </Reveal>
            </div>
            <Reveal>
              <ZoomImg src={BIMG + "Screenshot-Bachta.png"} alt="Hero-Bereich der Bachata-Website"
                caption="Hero-Bereich der Bachata-Website. Obwohl der Kunde einige UI-Elemente nach eigenem Geschmack beibehielt, verbesserten die Änderungen die Usability und die Gesamtwirkung deutlich." />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Animated stat band */}
      <section className="cs-section">
        <div className="cs-wrap">
          <Reveal className="cs-head">
            <h2 className="cs-h">In Zahlen</h2>

          </Reveal>
          <div className="gm-statband">
            <Stat to={1} label="Abend · Review → ausgeliefert" />
            <Stat to={5} label="Kernbereiche neu formuliert" />
            <Stat to={11} suf="-seitig" label="Dokument mit Änderungen" />
            <Stat to={2} pre="×" label="Anfragen binnen einer Woche" />
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
              <div className="cs-meta-v">UX-Writing &amp; Review, IA-Optimierung, Microcopy- &amp; CTA-Design, Verfeinerung der EN-Lokalisierung</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Zeitrahmen</div>
              <div className="cs-meta-v">Ein Abend – Review → Vorschlag → zweite QA-Runde</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Tools</div>
              <div className="cs-meta-v">Google Docs (Spezifikation + Begründung), Tilda (Website-Plattform), Figma (schnelle Mockups)</div>
            </div>
          </Reveal>

          <Reveal className="cs-chips cs-mt-m" style={{ justifyContent: "center" }}>
            {["Audit", "UX-Writing", "IA / Struktur", "CTAs & Formulare", "Lokalisierung (EN)"].map((c) => (
              <span className="tag" key={c}>{c}</span>
            ))}
          </Reveal>

          <div className="cs-grid2 cs-mt-l">
            <Reveal>
              <h3 className="cs-h" style={{ fontSize: "1.25rem", marginBottom: ".8rem" }}>Herausforderung</h3>
              <p className="cs-p">
                Kein Zugang zum Tilda-Konto des Kunden, daher musste jede Änderung in einem klaren,
                nachvollziehbaren Spec mit Begründungen und Beispielen dokumentiert werden. Nach der Umsetzung
                durch den Kunden führte ich ein Second-Pass-QA durch, um Lücken zu schließen und sicherzustellen,
                dass keine wichtigen Punkte fehlten.
              </p>
            </Reveal>
            <Reveal>
              <h3 className="cs-h" style={{ fontSize: "1.25rem", marginBottom: ".8rem" }}>Ziel</h3>
              <p className="cs-p">
                Die Seite so gestalten, dass sie in einem Durchgang leicht erfassbar und nutzbar ist:
                Informationsarchitektur straffen, Angebote klar darstellen, Preise und Stundenpläne vereinfachen,
                Buchungsabläufe optimieren und zugängliche, aber professionelle englische Texte verfassen.
              </p>
            </Reveal>
          </div>

          <div className="cs-grid2 cs-mt-l" style={{ alignItems: "stretch" }}>
            <Reveal className="cs-panel">
              <h4>Highlights</h4>
              <ul className="cs-steps">
                {["Pain Points analysiert und Hero, Value Prop, Preise, FAQs und CTAs neu formuliert",
                  "Verstreute Infos gebündelt und die kognitive Belastung auf Kernseiten reduziert",
                  "CTA-Hierarchie überarbeitet und Kontakt- / Buchungswege klarer gemacht",
                  "Playbook in Google Docs mit Vorher/Nachher-Texten, Begründungen und Notizen erstellt",
                  "Nach der Umsetzung einen QA-Check durchgeführt, um die Korrekturen zu prüfen"].map((t) => (
                  <li className="cs-li" key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Ergebnis</h4>
              <ul className="cs-steps">
                {["Reibungsloseres Onboarding – Besucher finden Infos und Preise schneller, mit weniger Klicks",
                  "Stärkerer erster Eindruck – poliertes englisches Microcopy steigert die wahrgenommene Professionalität",
                  "Klarere Handlungspfade führten zu mehr Anfragen und neuen Anmeldungen",
                  "Die Seite liest sich nun wie eine freundliche Einladung statt wie ein Rätsel"].map((t) => (
                  <li className="cs-li" key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Changes made transparent */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Transparenter Korrekturprozess</h3></div>
          <p className="cs-p">
            Alle Empfehlungen lebten in einem strukturierten Google Doc: ein markierter Screenshot, der
            Originaltext und direkt darunter die vorgeschlagene Version. Wo eine strategische Entscheidung nötig
            war, bot ich 2–3 fokussierte Varianten an; ansonsten genügte eine klare Option, um den Prozess im
            Fluss zu halten und Entscheidungsparalyse zu vermeiden. Der Kunde konnte prüfen, entscheiden und
            sofort umsetzen.
          </p>
          <div className="cs-grid3 cs-mt-l">
            <Reveal>
              <ZoomImg src={BIMG + "Screenshot-Bachata-Doc.png"} alt="Spec-Doc: markierter Screenshot, aktueller Text, vorgeschlagene Version"
                caption="Probleme markiert, Lösungen vorgeschlagen, Notizen ergänzt – strukturiertes Feedback, das uns im Zeitplan hielt."
                capAccent="Spec →" />
            </Reveal>
            <Reveal>
              <ZoomImg src={BIMG + "Screenshot-Bachata-Doc2.png"} alt="Spec-Doc: Headline- und CTA-Alternativen mit Begründung"
                caption="Abschnitt für Abschnitt gearbeitet und Kernabläufe wie Probestunden und Venue-Infos priorisiert." />
            </Reveal>
            <Reveal>
              <ZoomImg src={BIMG + "Screenshot-Bachata-Doc3.png"} alt="Spec-Doc: finaler Textvorschlag mit Umsetzungsnotizen"
                caption="Der Effekt zeigte sich sofort nach den ersten Anpassungen – die Landingpage wirkte umgehend klarer und einladender." />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Before → After */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head">
            <h3 className="cs-h">Vorher → Nachher Highlights</h3>

          </div>
          <p className="cs-p">
            Um die Wirkung der Überarbeitung zu zeigen, hier drei zentrale Bereiche der Seite. Jedes Paar
            verwandelt einen vagen, uneinheitlichen oder schwer erfassbaren Abschnitt in ein klares,
            benutzerfreundliches Erlebnis, das Besucher:innen zu sicherem Handeln befähigt.
          </p>
          <div className="ba2-stack cs-mt-l">
            {BA_PAIRS.map((p, i) => <BAToggle key={p.title} index={i + 1} {...p} />)}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Ergebnisse</h3></div>
          <p className="cs-p">
            Innerhalb eines Abends wurde die Seite klarer, einladender und handlungsorientierter. Die
            Überarbeitung beseitigte Hindernisse, machte wichtige Informationen leichter auffindbar und verlieh
            der Schule einen professionelleren Online-Auftritt. Am wichtigsten: Die Änderungen führten zu mehr
            Anfragen und Anmeldungen – Kontaktaufnahme und Buchung einer Stunde wurden einfach und selbsterklärend.
          </p>
          <div className="cs-grid2 cs-mt-m">
            <ul className="cs-steps">
              {[["Usability.", "Klarere CTAs, konsistente Layouts, bessere Erfassbarkeit in allen Bereichen."],
                ["Klarheit.", "Vereinfachte Sprache, weniger Mehrdeutigkeit, klar strukturierter Content-Flow."],
                ["Konsistenz.", "Einheitliche Kartengrößen, Headline-Muster und CTA-Stile für einen professionellen Auftritt."]].map(([b, t]) => (
                <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
              ))}
            </ul>
            <ul className="cs-steps">
              {[["Handlungsfähigkeit.", "„Book Now“-Wege sichtbar gemacht und durchgehend hervorgehoben."],
                ["Barrierefreiheit.", "Einsteigerfreundliche Formulierungen mit reduziertem Jargon."],
                ["Business Impact.", "Ein einfacherer Buchungsprozess führte zu mehr Anmeldungen (laut Kunde)."]].map(([b, t]) => (
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
            Dieses Projekt hat mir wieder gezeigt, dass präzises UX-Writing ein Produkt in wenigen Stunden statt
            in Wochen verändern kann. Mit klarerer Struktur, leichter erfassbaren Abschnitten und bewusst
            gestalteten CTAs wurde die Seite von überladen zu klar und handlungsorientiert.
          </p>
          <ul className="cs-steps cs-mt-m">
            {[["Struktur & Lesbarkeit.", "Abschnitte müssen auf einen Blick erfassbar sein."],
              ["Gezielte CTAs.", "Buttons wie „Book Now“ nehmen Hürden und leiten durch den Hauptpfad."],
              ["Kleine, präzise Eingriffe.", "Anpassungen an Überschriften, Kartengrößen und Microcopy können große Wirkung zeigen."],
              ["Dokumentierter Workflow.", "Klare Vorher/Nachher-Dokumente beschleunigen die Umsetzung auch ohne CMS-Zugang."]].map(([b, t]) => (
              <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { BachataCase });
