/* axiomlens-content.de.jsx – German edition of the AxiomLens flagship article.
   Same structure & components as axiomlens-content.jsx, German copy sourced from
   the live de/case-study-axiomlens.html. Exports <AxiomCase/>.
   Depends on core.jsx + casestudy-shared.jsx (ZoomImg). */

const AIMG = "https://alexmedved.com/assets/images/";

/* ---- animated count-up (scroll-triggered, with non-painting fallback) ---- */
function useCountUp(target, run, dur = 1300) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {setVal(target);return;}
    let raf = 0,start = 0,done = false;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);else done = true;
    };
    raf = requestAnimationFrame(tick);
    const fb = setTimeout(() => {if (!done) setVal(target);}, dur + 500);
    return () => {cancelAnimationFrame(raf);clearTimeout(fb);};
  }, [run, target, dur]);
  return val;
}

function Stat({ to, pre = "", suf = "", text, label }) {
  const ref = useRef(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < (window.innerHeight || 800) * 0.85 && r.bottom > 0;
    };
    if (inView()) {setRun(true);return;}
    const onScroll = () => {if (inView()) {setRun(true);cleanup();}};
    const t = setTimeout(() => {setRun(true);cleanup();}, 2500);
    function cleanup() {window.removeEventListener("scroll", onScroll);clearTimeout(t);}
    window.addEventListener("scroll", onScroll, { passive: true });
    return cleanup;
  }, []);
  const n = useCountUp(to == null ? 0 : to, run);
  return (
    <div className="gm-stat" ref={ref}>
      <div className="gm-stat-n">{text ? text : <span className="accent">{pre}{n}{suf}</span>}</div>
      <div className="gm-stat-k">{label}</div>
    </div>);

}

/* ---- list helpers ---- */
function KL({ items }) {
  return <ul className="cs-steps">{items.map(([b, t], i) => <li className="cs-li" key={i}><strong>{b}</strong> {t}</li>)}</ul>;
}
function PlainList({ items }) {
  return <ul className="cs-steps">{items.map((t, i) => <li className="cs-li" key={i}>{t}</li>)}</ul>;
}

function Persona({ avatar, name, role, tag, blurb, needs, pains }) {
  return (
    <Reveal className="ax-pcard">
      <span className="tag tag-accent ax-persona-tag">{tag}</span>
      <div className="ax-persona-head">
        <img className="ax-avatar" src={avatar} alt={name + " Avatar"} loading="lazy" />
        <div className="ax-persona-id">
          <span className="ax-persona-name">{name}</span>
          <span className="ax-persona-role mono-sm">{role}</span>
        </div>
      </div>
      <p className="cs-p ax-persona-blurb">{blurb}</p>
      <div className="ax-pcard-block">
        <div className="ax-sub5">Auf einen Blick</div>
        <PlainList items={needs} />
      </div>
      <div className="ax-pcard-block">
        <div className="ax-sub5">Frustpunkte</div>
        <PlainList items={pains} />
      </div>
    </Reveal>);

}

/* ---- horizontal, scroll-snap carousel of clickable iteration frames ---- */
function Carousel({ items }) {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const update = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    setAtStart(t.scrollLeft <= 2);
    setAtEnd(t.scrollLeft + t.clientWidth >= t.scrollWidth - 2);
  }, []);
  useEffect(() => {update();}, [update]);
  const move = (dir) => {
    const t = trackRef.current;
    if (!t) return;
    const card = t.querySelector(".ax-car-slide");
    const w = card ? card.getBoundingClientRect().width + 16 : t.clientWidth * 0.8;
    t.scrollBy({ left: dir * w, behavior: "smooth" });
  };
  return (
    <div className="ax-car">
      <div className="ax-car-track" ref={trackRef} onScroll={update}>
        {items.map(([img, cap], i) =>
        <div className="ax-car-slide" key={i}>
            <span className="ax-car-tag">{String(i + 1).padStart(2, "0")}</span>
            <ZoomImg src={AIMG + img} alt={typeof cap === "string" ? cap : "Iteration"} caption={cap} />
          </div>
        )}
      </div>
      <div className="ax-car-nav">
        <span className="ax-car-hint mono-sm">Ziehen oder → nutzen</span>
        <div className="ax-car-btns">
          <button className="ax-car-btn" onClick={() => move(-1)} disabled={atStart} data-hot aria-label="Zurück">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button className="ax-car-btn" onClick={() => move(1)} disabled={atEnd} data-hot aria-label="Weiter">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>
    </div>);

}

const SCREENS = [
{
  n: "01", k: "Haupt-Dashboard", img: "Axiom_Main.png",
  cap: <><strong>Haupt-Dashboard.</strong> Überblick über den Cashflow auf hoher Ebene: Kennzahlen, Trends und KI-Insights in einer fokussierten Ansicht.</>,
  h: "Täglicher Check-in-Screen – der Einstieg ins Produkt",
  desc: [
  "Das Haupt-Dashboard ist der Screen, den Frank, Jing und die meisten User am häufigsten sehen. Es bündelt Kennzahlen, Trends, KI-Insights und die neuesten Rechnungen in einer Arbeitsansicht – ein kurzer Blick reicht, um zu erkennen, ob heute etwas Aufmerksamkeit braucht.",
  "Als erster Screen, den alle zuerst sehen, musste er eine sorgfältige Balance aus Informationsdichte, visueller Ruhe und klaren nächsten Schritten schaffen. Er definiert außerdem die visuelle Sprache des gesamten Produkts und war deshalb der am stärksten iterierte Screen."],

  dec: [
  ["Kennzahlen-Karten", "für Einnahmen, Ausgaben, Gewinn und fällige Steuern geben einen schnellen Status – plus kurze Trendhinweise zum Vormonat."],
  ["Das KI-Insights-Panel", "hebt Risiken und Chancen in Klartext hervor und verlinkt direkt zu den passenden Ansichten."],
  ["Die Tabelle mit aktuellen Rechnungen", "erdet den Überblick in konkreten Kunden und Beträgen – mit Status-Badges und Aktionen mit einem Klick."],
  ["Ein dunkles, ruhiges UI", "mit enger Grid-Struktur und zurückhaltenden Farben hält dichte Daten gut lesbar, ohne wie ein Trading-Terminal zu wirken."]]

},
{
  n: "02", k: "Cashflow-Übersicht", img: "Cashflow_Overview.png",
  cap: <><strong>Cashflow-Übersicht.</strong> Diagramm zu Ein- und Ausgängen mit Filtern und kurzen Insight-Karten, die zeigen, was sich geändert hat und wodurch.</>,
  h: "Trends sehen, ohne die Geschichte dahinter zu verlieren",
  desc: [
  "Hier geht es eine Ebene höher: Wie sich Geld über den gewählten Zeitraum bewegt – nach Konto, Jahr und Quartal. Statt nur eines Kontostands zeigt der Screen, wie Ein- und Ausgänge Woche für Woche zusammenlaufen."],

  dec: [
  ["Das Diagramm", "legt Ein- und Auszahlungen auf dieselbe Skala mit feinem Raster, sodass Trends und Lücken sofort ins Auge fallen."],
  ["Filter für Konto, Jahr und Quartal", "beantworten Fragen wie „Wie lief Q4 auf dem Hauptkonto?“ – ohne den Screen zu wechseln."],
  ["Die Insight-Karten unter dem Diagramm", "übersetzen Muster in Klartext: saisonale Spitzen, Sparpotenzial oder Rechnungen, die das Quartal aus dem Gleichgewicht bringen."],
  ["Die UI rund ums Diagramm", "bleibt bewusst zurückhaltend; Aktionen wie „Bericht exportieren“ sind da, aber nicht im Weg."]]

},
{
  n: "03", k: "Rechnungen", img: "Invoices_Overivew.png",
  cap: <><strong>Rechnungsliste.</strong> Dichte, aber klare Tabelle mit Status-Badges, Schnellaktionen und Insight-Karten, um lange Abrechnungsverläufe zügig durchzugehen.</>,
  h: "Das Arbeitstier für den Rechnungsalltag",
  desc: [
  "Hier steuern Frank und Jing ihr reinkommendes Geld. Der Screen verbindet zentrale Kennzahlen zu Rechnungen mit einer dichten, aber gut lesbaren Tabelle – so wird aus „Wie viel steckt noch in Rechnungen?“ in wenigen Sekunden „Welche gehe ich zuerst an?“."],

  dec: [
  ["Die Karten oben", "geben einen schnellen Überblick: insgesamt gestellt, bezahlt, überfällig und die durchschnittliche Zahlungszeit."],
  ["Filter für Status, Konto und Jahr", "grenzen die Liste schnell ein, ohne die Seite zu verlassen."],
  ["Eine aufgeräumte Rechnungstabelle", "lässt sich auch über lange Zeiträume gut überfliegen und sortieren."],
  ["Aktionen direkt in der Tabelle", "halten Standardaufgaben mit einem Klick erreichbar, statt sie in Menüs zu verstecken."]]

},
{
  n: "04", k: "Rechnungsdetails", img: "invoice_details.png",
  cap: <><strong>Rechnungsdetails.</strong> Fokussiertes Overlay mit Kundendaten, Postenübersicht, Summen und einem visuellen Zahlungsverlauf.</>,
  h: "Alle Infos zur Rechnung, ohne den Flow zu unterbrechen",
  desc: [
  "Das Öffnen einer Rechnung soll sich leicht und selbstverständlich anfühlen. Die Detailansicht liegt als Overlay über der Liste: Man kann Daten prüfen, eine Erinnerung schicken, die Historie ansehen oder das PDF herunterladen – dann schließen und genau an der gleichen Stelle weitermachen."],

  dec: [
  ["Das Overlay", "hält Nutzer in der Rechnungsansicht, statt sie auf eine neue Seite zu schicken."],
  ["Der Kundenblock", "mit Kontaktdaten und Rechnungsadresse sitzt oben und lässt sich so schnell prüfen."],
  ["Der Betragsbereich", "trennt Zwischensumme, MwSt. und Gesamt klar, damit Beträge nicht falsch gelesen werden."],
  ["Die Verlaufslinie", "zeigt erstellt, gesendet, gesehen und bezahlt – und entkräftet Diskussionen à la „Die Rechnung ist nie angekommen“."]]

}];


const LOGOS = [
["Axiom_White_Square.png", "01", "Kamera-Blende mit Schaltlinien – ein früher Versuch, das Linsenmotiv mit einem smarten System-Feeling zu verbinden."],
["Axiom_White_Horizontal.png", "02", "Gleiches Symbol mit horizontalem Schriftzug. Das funktionierte besser in Titeln und auf weißem Grund."],
["Axiom_Square_Old_Font.png", "03", "Diagramm-Icon auf dunklem Grund. Der Finanzbezug wird klar, wirkt aber etwas aggressiv."],
["Axiom_Logo_Horizontal.png", "04", "Finale Richtung – eine Electrolize-Wortmarke behält einen leicht technischen Charakter, mit einer ruhigeren Farbpalette."]];


const THUMBS = [
["Wireframe.png", <><strong>01 · Wireframe-Flow.</strong> Alle wichtigen Bereiche in einem Flow – das Rückgrat für das erste Lo-Fi-Dashboard.</>],
["Main_dashboard.png", <><strong>02 · Lo-Fi-Dashboard.</strong> Ein grobes Layout, um Dichte zu testen und zu prüfen, was nach oben gehört.</>],
["Early_Design_1.png", <><strong>03 · Erster Hi-Fi.</strong> Früher High-Fidelity-Durchgang zu Hierarchie und Schnellüberblick.</>],
["Early_Design_2.png", <><strong>04 · Verlaufs-Experiment.</strong> Mehr Tiefe und Verläufe – bevor ich wieder zurückgerudert bin.</>],
["Early_Design_3.png", <><strong>05 · Farbexploration.</strong> Test von Statusfarben und einer ruhigeren, eher editorialen Palette.</>],
["Axiom_Main.png", <><strong>06 · Finales Dashboard.</strong> Die stärksten Teile jedes Durchgangs, auf einem strafferen Rhythmus.</>]];


const COMPONENTS = [
["Cards1.png", <><strong>Kennzahlen-Karten.</strong> Ein Muster – Label, Wert, kleine Trendlinie/Delta und Icon – für Einnahmen, Ausgaben, Gewinn, Steuern und Rechnungs-KPIs.</>],
["Pills1.png", <><strong>Status-Badges.</strong> Eine gemeinsame Palette über Tabellen und Karten, damit Nutzer schnell lernen, welche Farben gute Nachrichten, Warnungen oder Neutrales bedeuten.</>],
["AI_Cards_Alpha.png", <><strong>AI-Insights-Karten.</strong> Icon, kurzer Titel, Erklärung und klare Aktion – Analyse wird zu kleinen, fokussierten Empfehlungen statt zu noch einem Chart.</>],
["Icons_New1.png", <><strong>Icon-Set.</strong> Für Navigation, KPIs und Aktionen; Strichstärke und Radius passen zum UI, sodass Icons die Hierarchie stützen, statt mit den Zahlen zu konkurrieren.</>]];


function AxiomCase() {
  return (
    <div className="cs-view">
      {/* Hero */}
      <section className="cs-section cs-hero">
        <div className="cs-wrap">
          <div className="cs-kicker">
            <Reveal><MonoLabel>Fallstudie · 01 – AxiomLens</MonoLabel></Reveal>
            <Reveal as="span" className="mono-sm" style={{ color: "var(--ink-faint)" }}>2025 · ~2 Wochen · Konzept</Reveal>
          </div>
          <div className="ax-hero-grid">
            <Reveal className="ax-hero-text">
              <h1 className="cs-title">Cashflow-Analyse,<br /><span className="accent">klar im Blick.</span></h1>
              <p className="cs-sub">Zerstreute Daten zum umsetzbaren Überblick formen</p>
              <p className="cs-lead">
                Ein selbst initiiertes Konzept dafür, wie ein SaaS-Dashboard kleinen Unternehmen und Freelancern einen klaren
                Blick auf ihren Cashflow verschaffen kann – und mit KI-gestützten Prognosen ermöglicht, rechtzeitig zu handeln,
                bevor Probleme entstehen. Ich habe die datenintensive UI klar strukturiert, Kennzahlen auf einen Blick gemacht
                und Flows so gestaltet, dass sie jederzeit ruhig und verlässlich wirken.
              </p>
              <div className="ax-skip-wrap">
                <a href="#visuals-start" className="btn btn-accent ax-skip-btn" data-hot>
                  Direkt zu den Visuals
                  <span className="btn-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg></span>
                </a>
              </div>
            </Reveal>
            <Reveal className="ax-hero-media">
              <ZoomImg src={AIMG + "Axiom_Main.png"} alt="AxiomLens Cashflow-Dashboard – Hauptübersicht"
                caption="Das Haupt-Dashboard von AxiomLens bündelt zentrale Cashflow-Kennzahlen, Trends und Erkenntnisse." capAccent="Hero →" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stat band */}
      <section className="cs-section gm-stats-sec">
        <div className="cs-wrap">
          <div className="gm-statband">
            <Stat to={4} label="Hi-Fi-Screens geliefert" />
            <Stat to={10} label="Moderierte Usability-Sessions" />
            <Stat pre="~" to={2} suf=" Wo." label="Von Skizze bis Hi-Fi" />
            <Stat text={<><span className="accent">1–2</span></>} label="Klicks bis zu jedem Detail" />
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
              <div className="cs-meta-v">Produktkonzept, UX/UI-Design, UX-Research, Interaktionsmuster, Dashboard-IA, Microcopy, Grundlagen des Visual-Design-Systems</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Zeitrahmen</div>
              <div className="cs-meta-v">~2 Wochen Abendarbeit – von den ersten Skizzen bis zu ausgereiften Hi-Fi-Screens</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Tools</div>
              <div className="cs-meta-v">Figma, Google Sheets &amp; Docs, Notion, ChatGPT, UX Pilot</div>
            </div>
          </Reveal>
          <Reveal className="cs-chips cs-mt-m" style={{ justifyContent: "center" }}>
            {["UX des Dashboards", "Datenintensive UI", "Research", "Branding", "Finanz-SaaS", "Designsystem-Grundlagen", "Microcopy (EN)"].map((c) =>
            <span className="tag" key={c}>{c}</span>
            )}
          </Reveal>
          <div className="cs-grid2 cs-mt-l">
            <Reveal>
              <h3 className="cs-h" style={{ fontSize: "1.25rem", marginBottom: ".8rem" }}>Herausforderung</h3>
              <p className="cs-p">
                Freelancer:innen und kleine Unternehmen stützen sich auf einen Flickenteppich aus Banking-Apps,
                Rechnungstools und Tabellen. Zahlen gibt es viele, aber nur selten einen klaren Blick darauf, wie sich
                Geld über die Zeit bewegt, wann eine Liquiditätslücke droht oder welche Kund:innen Zahlungen ausbremsen.
                Viele Dashboards überfordern mit visueller Lautstärke oder bleiben zu oberflächlich – und KI-Hilfen werden
                selten so umgesetzt, dass sie wirklich transparent und vertrauenswürdig sind.
              </p>
            </Reveal>
            <Reveal>
              <h3 className="cs-h" style={{ fontSize: "1.25rem", marginBottom: ".8rem" }}>Ziel</h3>
              <p className="cs-p">
                Ein grafisches Konzept für <strong>AxiomLens</strong> – eine zentrale Plattform, die Einnahmen, Ausgaben
                und Rechnungen zusammenführt und um gut verständliche KI-Insights ergänzt. Die datenreiche UI bleibt in
                Sekundenschnelle erfassbar, mit klaren Übergängen zwischen Gesamtüberblick, Rechnungsverwaltung und
                detaillierter Historie – damit Nutzer:innen ihre finanzielle Lage in einem einzigen, verlässlichen Interface behalten.
              </p>
            </Reveal>
          </div>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel">
              <h4>Meine Highlights</h4>
              <PlainList items={[
              "Dunkles, ruhiges Dashboard mit klarer Hierarchie für Kennzahlen und Trends",
              "Wiederverwendbare Karten für Einnahmen, Ausgaben, Steuern und KI-Insights",
              "Rechnungstabelle und Detailansicht, optimiert für Status, Fälligkeiten und Aktionen",
              "Ein konsistentes Komponenten-System für Zahlungsstatus und mehr",
              "Texte und Labels von Anfang an lokalisierungsfreundlich geschrieben"]
              } />
            </Reveal>
            <Reveal className="cs-panel cs-panel-accent">
              <h4>Ergebnis</h4>
              <PlainList items={[
              "Ein kohärentes Set aus 4 Hi-Fi-Screens, bereit für Handover oder Prototyping",
              "Eine Informationsarchitektur, die Cashflow, Rechnungen und KI-Insights verknüpft",
              "Eine stabile Designsystem-Basis – Typografie, Layout, Karten, Badges, Styles",
              "Eine Case Study zu Problemdefinition, Designentscheidungen und geschäftlichem Mehrwert"]
              } />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Problem & Context */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Problem &amp; Kontext</h3></div>
          <div className="cs-grid2 ax-equal">
            <Reveal>
              <h4 className="gm-subh" style={{ marginTop: 0 }}>Ausgangspunkt</h4>
              <p className="cs-p">
                Statt noch eine generische Finanz-App zu entwerfen, habe ich mich auf ein konkretes Szenario konzentriert:
                Gründer:innen oder Freelancer:innen öffnen das Dashboard für einen kurzen Check-in, bevor sie mit der Arbeit
                starten – keine Zeit für tiefe Analysen, nur die Frage „gibt es heute irgendwo Handlungsbedarf?“
              </p>
              <p className="cs-p">
                Ihre Daten liegen an verschiedenen Orten und auf unterschiedlichen Zeitachsen – tägliche Kontobewegungen,
                monatliche Abos, unregelmäßige Rechnungen, quartalsweise Steuern. AxiomLens bündelt diese Zeitachsen in einer
                Ansicht: was passiert ist, was eingeplant ist und was zum Problem werden könnte.
              </p>
              <div className="ax-success ax-success-compact cs-mt-m">
                <div className="ax-sub5" style={{ marginBottom: ".7rem" }}>Erfolgskriterien · die Hauptansicht beantwortet</div>
                <div className="ax-questions ax-questions-tight">
                  <p className="ax-q">„Wie stehen wir <span className="accent">im Moment</span> da?“</p>
                  <p className="ax-q">„Worum müssen wir uns <span className="accent">heute oder diese Woche</span> kümmern?“</p>
                  <p className="ax-q">„Kommt demnächst etwas <span className="accent">Risikoreiches</span> auf uns zu?“</p>
                </div>
                <p className="ax-success-note">
                  Risiken – Liquiditätslücken, überfällige Rechnungen, bevorstehende größere Ausgaben – sind in klar
                  abgegrenzten Bereichen gebündelt, nicht hinter Filtern versteckt. Dichte Tabellen und Charts bleiben dank
                  konsistentem Layout, zurückhaltender Farbgebung und wiederkehrender Muster schnell erfassbar.
                </p>
              </div>
            </Reveal>
            <Reveal className="cs-panel ax-wire-panel">
              <h4>Frühe Wireframe-Logik</h4>
              <p className="cs-p">
                Bevor ich mit Lo-Fi-Skizzen oder Visual Design begonnen habe, habe ich den kompletten Screen-Flow durchgeplant –
                die zentralen Module, die Navigationslogik und den Funktionsumfang, auch über die vier finalen Hi-Fi-Screens hinaus.
              </p>
              <ZoomImg src={AIMG + "Wireframe.png"} alt="Wireframe der ersten Iteration mit geplanten Modulen und Flows"
              caption="Wireframe-Map der ersten Iteration, die später als Basis für den ersten Lo-Fi-Prototyp diente." className="ax-wire-fig" />
            </Reveal>
          </div>

          <div className="cs-grid2 cs-mt-l ax-equal">
            <Reveal className="cs-panel">
              <h4>Zentrale Herausforderungen</h4>
              <PlainList items={[
              "Daten zusammenbringen, die auf verschiedenen Zeitebenen laufen: einzelne Rechnungen, Monatswerte, Quartalszahlen.",
              "Visuelle Signale für überfällige Posten entwickeln, die Dringlichkeit erzeugen, ohne Panik zu machen.",
              "KI-Erkenntnisse in kurze, gut lesbare Hinweise übersetzen, statt sie als undurchsichtige „Prognosen“ stehenzulassen.",
              "Die Oberfläche auch für Menschen ohne Buchhaltungs-Background verständlich halten, ohne bei der Detailtiefe Abstriche zu machen."]
              } />
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Konzeptgrenzen</h4>
              <KL items={[
              ["Nur Ein-Benutzer-Ansicht", "im MVP – keine Rollenmodelle für mehrere Nutzer und keine Kollaborationstools in dieser Iteration."],
              ["Cashflow & Rechnungen", "im Fokus – keine vollständige Buchhaltungs- oder Steuersoftware."],
              ["Import wird vorausgesetzt", "– der Fokus liegt auf Darstellung und Entscheidungsunterstützung, nicht auf den Integrationsflows."]]
              } />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Users & Goals */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Nutzende &amp; Ziele</h3></div>
          <p className="cs-p">
            Ich habe AxiomLens nicht nur als zentrales Cockpit für alle Zahlen konzipiert, sondern auch als Weg, die eigene
            finanzielle Lage aktiv zu verbessern. Mit KI-Analysen und verständlichen Insights macht das Tool Muster und
            Ereignisse sichtbar, die man leicht übersieht – und hilft, den Cashflow mit einem aufmerksameren System zu steuern.
          </p>

          <div className="ax-ug cs-mt-l">
            <div className="ax-ug-personas">
              <Persona avatar={AIMG + "guy_1.jfif"} name="Frank, 33" role="Inhaber eines kleinen Kreativstudios" tag="Vielbeschäftigter Inhaber"
              blurb="Führt ein kleines Unternehmen mit ein paar Mitarbeitenden und Freelancern. Zwischen Kundenkontakt und Produktion hat er nur kurz Zeit für schnelle Finanzchecks und Entscheidungen."
              needs={[
              "Ob die nächsten 2–4 Wochen abgedeckt sind (Miete, Löhne, Fixkosten).",
              "Welche Rechnungen überfällig sind, in welcher Höhe und wie sich das auf den Monat auswirkt.",
              "Eine einzige „Jetzt + Nächstes“-Ansicht, ohne jede Woche Tabellen neu aufzusetzen."]
              }
              pains={[
              "Daten liegen verstreut in Banking-Apps, Excel und Rechnungstools.",
              "Abende gehen fürs Zahlenabgleichen drauf, statt das Geschäft voranzubringen."]
              } />
              <Persona avatar={AIMG + "girl_1.jfif"} name="Jing, 29" role="Beraterin mit mehreren laufenden Mandaten" tag="Freiberufliche Beraterin"
              blurb="Arbeitet mit mehreren Kunden auf Retainer- und Projektbasis. Zahlungsziele variieren stark, ihr Einkommen ist unregelmäßig und schwer einzuschätzen."
              needs={[
              "Wiederkehrende Rechnungen verfolgen und künftige Einkommenslücken erkennen.",
              "Umsatz nach Kunden/Projekten – um zu sehen, wer ihn wirklich treibt.",
              "Sanfte Reminder, Rechnungen zu schicken, bevor Verzögerungen peinlich werden."]
              }
              pains={[
              "Kein zentraler Ort, um alle anstehenden Zahlungen zu sehen und den Cashflow zu steuern.",
              "Langsame Monate kommen überraschend – Probleme fallen erst auf, wenn das Konto schon niedrig ist.",
              "Regelmäßige „Hab ich diese Rechnung geschickt?“-Momente spät nachts, die leichtes Unbehagen auslösen."]
              } />
            </div>

            <div className="ax-ug-goals">
              <Reveal className="cs-panel">
                <h4>So sieht Erfolg aus</h4>
                <KL items={[
                ["Schneller Check.", "Dashboard öffnen, einmal überfliegen und wissen, ob die nächsten Wochen stabil oder heikel sind."],
                ["Planbare Runway.", "Kommende Dellen, große Ausgaben und dünne Monate werden früh genug sichtbar, um zu reagieren."],
                ["Handfeste Hinweise.", "Jede Warnung kommt mit 1–2 naheliegenden nächsten Schritten."],
                ["Geringe mentale Last.", "Genug Details für echte Entscheidungen, gruppiert und beschriftet, damit der Screen ruhig bleibt."]]
                } />
              </Reveal>
              <Reveal className="cs-panel">
                <h4>Dashboard- &amp; Designziele</h4>
                <div className="ax-ug-2col">
                  <div>
                    <div className="ax-sub5">User-Ziele</div>
                    <PlainList items={[
                    "Heutige Liquidität und die nächsten 30–45 Tage an einem Ort sehen.",
                    "Überfällige oder riskante Rechnungen sehen, ohne Mails zu durchsuchen.",
                    "Verstehen, was den Trend treibt – Kunden, Monate, Rechnungen.",
                    "Schnell entscheiden: investieren, sparen, verschieben oder nachfassen.",
                    "Eine einfache, exportierbare Übersicht mit Steuerberater oder Partner teilen."]
                    } />
                  </div>
                  <div>
                    <div className="ax-sub5">Produkt- &amp; UX-Prinzipien</div>
                    <PlainList items={[
                    "Verstreute Finanzdaten in eine verlässliche Ansicht verwandeln, keine Chart-Wand.",
                    "Risiken mit klaren, gut lesbaren Visuals hervorheben.",
                    "Navigation flach halten: vom Dashboard zu Details in 1–2 Klicks.",
                    "Muster entwerfen, die später auf Steuern, Abos und tiefere KI erweiterbar sind."]
                    } />
                  </div>
                </div>
              </Reveal>
              <Reveal className="cs-panel">
                <h4>Einschränkungen &amp; Nicht-Ziele</h4>
                <div className="ax-twocol">
                  <KL items={[
                  ["Nicht abgedeckt:", "vollständige Buchhaltung und Mehrrollen-Rechte."],
                  ["Integrationen:", "Bank- und Rechnungssync wird angenommen; Fokus liegt auf UI/UX."],
                  ["Datenaktualität:", "Sync-Status und Zeitstempel anzeigen, Scheinpräzision vermeiden."]]
                  } />
                  <KL items={[
                  ["Schutz vor Überladung:", "lieber kurze Text-Highlights statt Diagrammflut."],
                  ["Iterationsfokus:", "ein Single-User-Dashboard fürs MVP."]]
                  } />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Key Screens */}
      <section className="cs-section" id="visuals-start">
        <span className="ax-anchor" aria-hidden="true"></span>
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Zentrale Screens</h3></div>
          <p className="cs-p" style={{ marginBottom: "2.4rem" }}>
            Ein näherer Blick auf den Kernflow: vom Haupt-Dashboard über eine detailliertere Cashflow-Ansicht hin zur
            Rechnungsübersicht. Zusammen zeigen sie, wie dichte Finanzdaten zu einem einfachen Loop werden – Lage verstehen,
            Problem erkennen, Details öffnen, handeln.
          </p>
          <div className="ax-screens">
            {SCREENS.map((s, i) =>
            <div className={"ax-screen" + (i % 2 ? " rev" : "")} key={s.n}>
                <Reveal className="ax-screen-text">
                  <div className="ax-index">
                    <span className="ax-index-n">{s.n}</span>
                    <span className="ax-index-k">{s.k}</span>
                  </div>
                  <h4 className="ax-screen-h">{s.h}</h4>
                  {s.desc.map((p, j) => <p className="cs-p" key={j}>{p}</p>)}
                  <div className="ax-sub5 ax-dec-label">Zentrale Designentscheidungen</div>
                  <KL items={s.dec} />
                </Reveal>
                <Reveal className="ax-screen-media">
                  <ZoomImg src={AIMG + s.img} alt={s.k + " Screen"} caption={s.cap} />
                </Reveal>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Logo & Branding */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Logo &amp; Markenauftritt</h3></div>
          <p className="cs-p">
            Bei einem Finanzprodukt beginnt Vertrauen oft beim Logo. Ich brauchte etwas Analytisches und Modernes, das auf
            „smarte“ KI-Unterstützung anspielt, aber zuerst als Finanztool gelesen wird. Der Name gibt die Richtung vor:
            <strong> Axiom</strong> als verlässliche Grundlage, <strong>Lens</strong> als Linse auf die Daten. Die Entwürfe
            unten zeigen den Weg von einer generischen „AI + Blende“-Marke hin zu einem bodenständigen, diagrammbasierten Symbol.
          </p>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel">
              <h4>Wofür die Marke steht</h4>
              <KL items={[
              ["Reine finanzielle Klarheit.", "Seriös genug für echtes Geld, ohne wie eine Trading- oder Krypto-App zu wirken."],
              ["Smart, aber nicht Sci-Fi.", "Ein dezenter Hinweis auf KI und Automatisierung, kein Tech-Gadget-Icon."],
              ["Stabil und geerdet.", "Klare Geometrie und ein zugrunde liegendes Grid vermitteln Struktur und langfristige Nutzung."]]
              } />
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Namenslogik</h4>
              <KL items={[
              ["Axiom", "– eine verlässliche Grundlage, auf der Entscheidungen sicher stehen."],
              ["Lens", "– Fokus und Klarheit: eine Metapher für den Blick nach vorn."],
              ["AxiomLens", "– zusammen „verlässliche Zahlen, klar im Blick“."]]
              } />
            </Reveal>
          </div>
          <Reveal className="cs-mt-l"><h4 className="gm-subh" style={{ marginTop: 0 }}>Logo-Entwicklung</h4></Reveal>
          <div className="ax-logos">
            {LOGOS.map(([img, n, desc]) =>
            <Reveal className="ax-logo-card" key={img}>
                <ZoomImg src={AIMG + img} alt={"AxiomLens Logo, Iteration " + n} className="ax-logo-fig" />
                <p className="ax-logo-desc"><span className="ax-logo-n">{n}</span>{desc}</p>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* Design Process & Iterations */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Designprozess &amp; Iterationen</h3></div>
          <p className="cs-p">
            Bei AxiomLens bin ich vorgegangen wie bei einem echten Produkt: erst Flows und Informationsstruktur, dann eine
            Phase mit groben Lo-Fi-Skizzen, danach gezieltere Hi-Fi-Iterationen, validiert mit Usability-Tests – und erst
            ganz zum Schluss das visuelle System. Zuerst prüfen, ob die Logik trägt: welche Screens es gibt, was sie zeigen
            müssen, wie leicht Leute durchkommen – dann das Feintuning bei Datenmenge, Hierarchie und Farben.
          </p>
          <ol className="ax-steps cs-mt-l">
            {[
            ["Flow-Map & Wireframe-Logik.", "Die zentralen Bereiche – Cashflow, Rechnungen, Kunden, Ausgaben, Steuern, Insights, Einstellungen, Mobile – in einem Wireframe-Flow angeordnet: welche Screens es gibt, wie sie zusammenhängen und was jeder beantwortet."],
            ["Lo-Fi-Layout mit KI-Unterstützung.", "Aus dem Flow als Briefing eine grobe Lo-Fi-Version des Dashboards gebaut und die Informationsdichte getestet – welche Kennzahlen nach oben gehören und wie viel ohne Gequetsche passt."],
            ["Hi-Fi-Iterationen zur Hierarchie.", "Mehrere Hi-Fi-Durchgänge zu Schnellüberblick, Rechnungsbereich und Diagrammen – manche mit Verläufen und Tiefe, andere flacher und editorial, damit es ruhig und hochwertig wirkt."],
            ["Usability-Tests & Feedback.", "Zehn moderierte Remote-Sessions mit deutschen Freelancern auf einem interaktiven Prototyp. Das Feedback veränderte die Platzierung der KI-Insights, den Kontrast der Statusanzeigen und führte zu einer weicheren Palette."],
            ["Annäherung ans finale Layout.", "Das endgültige Dashboard kombiniert die stärksten Teile jeder Iteration: klarere Rechnungen, eine aussagekräftigere Zusammenfassungsleiste, konsistente Farbrollen und einen strafferen Rhythmus."]].
            map(([b, t], i) =>
            <li className="ax-step" key={i}>
                <span className="ax-step-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="ax-step-t"><strong>{b}</strong> {t}</span>
              </li>
            )}
          </ol>
          <Reveal className="cs-mt-l"><h4 className="gm-subh" style={{ marginTop: 0 }}>Von der Flow-Map zum fertigen Dashboard</h4></Reveal>
          <Carousel items={THUMBS} />
        </div>
      </section>

      {/* Design System Foundations */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Grundlagen des Designsystems</h3></div>
          <p className="cs-p">
            Relativ früh habe ich ein kleines Designsystem aufgesetzt, damit das Dashboard auch bei mehr Inhalt gut lesbar
            bleibt – eine Typografie, die neben Zahlen trägt, ein ruhiges Dark Theme und einfache, leicht wiederverwendbare Muster.
          </p>
          <div className="ax-dsys cs-mt-l">
            <Reveal className="cs-panel">
              <h4>Typografie</h4>
              <KL items={[
              ["Lesbar auch unter Druck.", "Schriftgrößen bleiben klar neben dichten Tabellen und Charts."],
              ["Zweistufige Hierarchie.", "Überschriften führen, Labels und Hilfstexte halten sich zurück."],
              ["Monospace als Akzent.", "Sparsam für ausgerichtete Beträge und codeartige Details."]]
              } />
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Farben &amp; Flächen</h4>
              <KL items={[
              ["Dunkler Hintergrund.", "Angenehm für längere Sessions und lässt Diagrammlinien hervortreten – ein Light Theme ist geplant."],
              ["Weiche Blautöne.", "Akzente, die analytisch und ruhig wirken, nicht nach Growth-Hacking-Hype."],
              ["Rahmen statt Schatten.", "Kaum Ebenen, damit der Fokus auf den Daten bleibt."]]
              } />
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Abstände &amp; Rhythmus</h4>
              <KL items={[
              ["Einheitliche Skala.", "Ein System über Bereiche und Komponenten hinweg für ein Gefühl wie aus einem Guss."],
              ["Card-first-Struktur.", "Dichte Daten in klaren, gut lesbaren Modulen organisiert."],
              ["Saubere Ränder.", "Deutliche Außenabstände verhindern Clutter und lassen das Layout bewusst gesetzt wirken."]]
              } />
            </Reveal>
          </div>
          <Reveal className="cs-mt-l"><h4 className="gm-subh" style={{ marginTop: 0 }}>Kernkomponenten</h4></Reveal>
          <p className="cs-p" style={{ marginBottom: "1.6rem" }}>
            Vier Komponentenfamilien leisten den Großteil der Arbeit – ihre Wiederverwendung hält das Produkt konsistent,
            auch ohne aufgeblähtes System.
          </p>
          <div className="ax-comp">
            {COMPONENTS.map(([img, cap], i) =>
            <Reveal className="ax-comp-card" key={i}>
                <ZoomImg src={AIMG + img} alt={typeof cap === "string" ? cap : "Komponente"} caption={cap} className="ax-comp-fig" />
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Nächste Schritte</h3></div>
          <p className="cs-p">
            AxiomLens ist ein Konzeptprojekt – es real zu machen, bräuchte Engineering, Data- und KI-Spezialist:innen,
            Security- und Compliance-Expert:innen, Steuerrecht und echten Support. Trotzdem schärft die Frage „Was kommt als
            Nächstes?“ die Richtung. Würde ich AxiomLens weiterentwickeln, würde ich mich vor allem auf Folgendes konzentrieren:
          </p>
          <Reveal className="ax-next cs-mt-l">
            {[
            ["Light- & Dark-Theme.", "Dark bleibt Standard, dazu ein Light Theme und automatisches Umschalten nach Systemvorgabe, das in beiden Modi trägt."],
            ["Mehrere Währungen & USt.", "Eine Ansicht, die Währungen, MwSt.-Sätze und Steuerregeln für grenzüberschreitende Freelancer und Studios auf einen Nenner bringt."],
            ["Team-Modus.", "Rollen und Berechtigungen für Gründer, Assistenz oder externe Buchhaltung im selben Workspace."],
            ["Tiefere Integrationen.", "Vom Upload im Tool hin zu direkten Anbindungen an wichtige EU-Anbieter (Stripe, PayPal, SEPA, lokale Banken)."],
            ["Verschiedene Kontotypen.", "Eine „Business-Owner“-Ansicht für Unternehmer:innen und eine schlankere „Client“-Ansicht zum Prüfen und Bezahlen."],
            ["Steuerbereich.", "Zeigt, welche Steuern gelten, schätzt Sätze aus vorhandenen Daten und bündelt Fristen pro Land oder Region."]].
            map(([h, t], i) =>
            <div className="ax-next-cell" key={i}>
                <div className="ax-next-h">{h}</div>
                <div className="ax-next-p">{t}</div>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* Learnings */}
      <section className="cs-section">
        <div className="cs-prose">
          <div className="cs-head" style={{ justifyContent: "center" }}><h3 className="cs-h">Erkenntnisse</h3></div>
          <p className="cs-p" style={{ textAlign: "center" }}>
            An AxiomLens zu arbeiten, bedeutete weniger, ein schickes Dashboard zu bauen, und mehr zu verstehen, was
            Finanz-Tools wirklich nutzbar und vertrauenswürdig macht. Ein paar Dinge, die ich mitnehme:
          </p>
          <ul className="cs-steps cs-mt-m">
            {[
            ["Fragen zuerst, Screens danach.", "Die Frage „Was will jemand in den ersten 30 Sekunden wissen?“ ließ viel UI wegfallen – und machte klar, was ganz nach oben gehört."],
            ["KI hilft nur, wenn sie am richtigen Ort landet.", "Insights brauchten in einem datenlastigen Produkt einen eigenen Platz; die Usability-Sessions fanden ein Layout, das wahrgenommen, aber nicht als störend empfunden wird."],
            ["Hohe Dichte ist teurer als man denkt.", "Jedes zusätzliche Element erschwerte den Blick auf die echten Zahlen. Ich habe Ideen gestrichen und lieber wenige, starke Komponenten genutzt."],
            ["Marke und Produkt müssen zusammenpassen.", "Das „Blende + Schaltlinien“-Logo wurde als generisches KI-Tool gelesen; ein klar finanzbezogenes Symbol justierte die Erwartungen sofort."],
            ["Auch Konzeptarbeit zeigt echte Komplexität.", "Die „nächsten Schritte“ – Steuerlogik, mehrere Währungen, Integrationen, Rollen – waren eine gesunde Portion Demut vor der Tiefe „einfacher“ Finanzprodukte."]].
            map(([b, t], i) => <li className="cs-li" key={i}><strong>{b}</strong> {t}</li>)}
          </ul>
        </div>
      </section>
    </div>);

}

Object.assign(window, { AxiomCase });
