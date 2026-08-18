/* axiomlens-content.jsx – the AxiomLens flagship article (structure preserved
   from the original, refreshed in the new design language with clickable
   lightbox images, an animated stat band, a carousel, and reveal motion).
   Exports <AxiomCase/>. Depends on core.jsx + casestudy-shared.jsx (ZoomImg). */

const AIMG = "assets/";

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
        <img className="ax-avatar" src={avatar} alt={name + " avatar"} loading="lazy" />
        <div className="ax-persona-id">
          <span className="ax-persona-name">{name}</span>
          <span className="ax-persona-role mono-sm">{role}</span>
        </div>
      </div>
      <p className="cs-p ax-persona-blurb">{blurb}</p>
      <div className="ax-pcard-block">
        <div className="ax-sub5">Needs at a glance</div>
        <PlainList items={needs} />
      </div>
      <div className="ax-pcard-block">
        <div className="ax-sub5">Pain points</div>
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
        <span className="ax-car-hint mono-sm">Drag or use →</span>
        <div className="ax-car-btns">
          <button className="ax-car-btn" onClick={() => move(-1)} disabled={atStart} data-hot aria-label="Previous">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button className="ax-car-btn" onClick={() => move(1)} disabled={atEnd} data-hot aria-label="Next">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>
    </div>);

}

const SCREENS = [
{
  n: "01", k: "Main Dashboard", img: "Axiom_Main.png",
  cap: <><strong>Main Dashboard.</strong> High-level cashflow overview with key metrics, trends, and AI insights in a single, focused view.</>,
  h: "Everyday check-in screen – meet the product",
  desc: [
  "The Main Dashboard is the screen Frank, Jing, and most users see most often. It combines topline numbers, trends, AI insights, and the latest invoices into one working view – a quick glance is enough to decide whether anything needs attention today.",
  "As the first screen anyone sees, it had to balance information density, visual calm, and clear next steps. It also set the visual language for the whole product, so it went through the most iterations."],

  dec: [
  ["Metric cards", "for income, expenses, net profit, and tax due give a quick snapshot, plus trend notes vs. last month."],
  ["AI Insights panel", "surfaces risks and opportunities in plain language, with direct links to relevant views."],
  ["Recent invoices table", "grounds the high-level picture in specific clients and amounts, with status badges and one-click actions."],
  ["Dark, calm UI", "with a tight grid and restrained color keeps dense data readable – without feeling like a trading terminal."]]

},
{
  n: "02", k: "Cashflow Overview", img: "Cashflow_Overview.png",
  cap: <><strong>Cashflow Overview.</strong> Detailed inflow vs. outflow chart with filters and insight cards that explain what changed and why.</>,
  h: "Read the trends without losing the story",
  desc: [
  "Here a user zooms out from the dashboard to see how money actually moves over a chosen period – by account, year, and quarter. Instead of a static balance, they see how inflow and outflow stack up week by week."],

  dec: [
  ["Focused chart", "compares inflow vs. outflow on a shared scale and subtle grid, so trends and gaps are easy to spot."],
  ["Period & account filters", "answer questions like “How did Q4 go on the main account?” without switching screens."],
  ["Key drivers & insight cards", "translate patterns into plain language: seasonal spikes, savings, or invoices skewing the quarter."],
  ["Minimal chrome", "keeps attention on the data, with secondary actions like “Export report” tucked away but available."]]

},
{
  n: "03", k: "Invoices", img: "Invoices_Overivew.png",
  cap: <><strong>Invoices List.</strong> Dense but scannable table with status badges, quick actions, and insight cards for long billing histories.</>,
  h: "Day-to-day billing workhorse",
  desc: [
  "This is where Frank and Jing actually manage the money coming in. The screen pairs high-level invoicing metrics with a dense but readable table, so they move from “How much is stuck in invoices?” to “Which ones first?” in a few seconds."],

  dec: [
  ["Summary cards", "give a quick health check: total invoiced, paid, overdue, plus average payment delay."],
  ["Status / account / year filters", "let users slice the list down fast without leaving the page."],
  ["Clean invoice table", "supports scanning and sorting over long histories."],
  ["Inline actions", "keep common tasks one click away instead of hiding them in menus."]]

},
{
  n: "04", k: "Invoice Details", img: "invoice_details.png",
  cap: <><strong>Invoice Details.</strong> Focused overlay with client info, line-item breakdown, totals, and a visual payment timeline.</>,
  h: "All the invoice context, without breaking your flow",
  desc: [
  "Opening an invoice should feel smooth and native. The detail view appears as an overlay on top of the list, so users can check details, send a reminder, review history, or download a PDF – then close it and stay exactly where they were."],

  dec: [
  ["Overlay pattern", "keeps users anchored in the invoices view."],
  ["Client block", "(contact data + billing address) is grouped at the top for quick verification."],
  ["Money block", "separates subtotal, VAT, and total clearly to avoid misreading amounts."],
  ["History timeline", "shows created, sent, seen, and paid states – settling “we never got that invoice” disputes."]]

}];


const LOGOS = [
["Axiom_White_Square.png", "01", "A camera-style aperture combined with circuit lines – an early attempt to merge the lens metaphor with a “smart system” feel."],
["Axiom_White_Horizontal.png", "02", "The same symbol paired with a horizontal wordmark. This read better in headers and on white backgrounds."],
["Axiom_Square_Old_Font.png", "03", "A chart-based icon on a dark background. The financial metaphor became clear, but felt a bit aggressive."],
["Axiom_Logo_Horizontal.png", "04", "Final direction – an Electrolize wordmark keeps a slightly technical character, with a calmer, less aggressive palette."]];


const THUMBS = [
["Wireframe.png", <><strong>01 · Wireframe flow.</strong> All main areas mapped into one flow – the backbone for the first lo-fi dashboard.</>],
["Main_dashboard.png", <><strong>02 · Lo-fi dashboard.</strong> A rough layout to stress-test density and what earns a place above the fold.</>],
["Early_Design_1.png", <><strong>03 · First hi-fi.</strong> Early high-fidelity pass on hierarchy and the quick-overview area.</>],
["Early_Design_2.png", <><strong>04 · Gradient experiment.</strong> Leaning into depth and gradients before pulling back.</>],
["Early_Design_3.png", <><strong>05 · Colour exploration.</strong> Testing status colours and a calmer, more editorial palette.</>],
["Axiom_Main.png", <><strong>06 · Final dashboard.</strong> The strongest parts of each pass, on a tighter rhythm.</>]];


const COMPONENTS = [
["Cards1.png", <><strong>Metric cards.</strong> One pattern – label, value, a small trend/delta, and an icon – for income, expenses, net profit, tax, and invoicing KPIs.</>],
["Pills1.png", <><strong>Status pills.</strong> A shared palette across tables and cards, so users quickly learn which colours mean good news, warnings, or neutral info.</>],
["AI_Cards_Alpha.png", <><strong>AI Insights cards.</strong> Icon, short title, explanation, and a clear action – analysis turned into small, focused suggestions instead of another chart.</>],
["Icons_New1.png", <><strong>Icon set.</strong> For navigation, KPIs, and actions; line weight and radius match the UI, so icons support hierarchy without competing with the numbers.</>]];


function AxiomCase() {
  return (
    <div className="cs-view">
      {/* Hero */}
      <section className="cs-section cs-hero">
        <div className="cs-wrap">
          <div className="cs-kicker">
            <Reveal><MonoLabel>Case Study · AxiomLens</MonoLabel></Reveal>
            <Reveal as="span" className="mono-sm" style={{ color: "var(--ink-faint)" }}>· 2025 · ~2 weeks · Concept</Reveal>
          </div>
          <div className="ax-hero-grid">
            <Reveal className="ax-hero-text">
              <h1 className="cs-title">AxiomLens – <span className="accent">Cashflow Analytics for Small Businesses</span></h1>
              <p className="cs-sub">Turning scattered numbers into an actionable overview</p>
              <p className="cs-lead">
                This self-initiated concept shows how a SaaS dashboard might help small and medium-sized businesses
                and freelancers get a clear view of their cash flow and leverage AI-powered predictions to act before
                problems arise. I focused on structuring data-heavy UI, making key metrics glanceable, and designing
                flows that feel calm and reliable at all times.
              </p>
              <div className="ax-skip-wrap">
                <a href="#visuals-start" className="btn btn-accent ax-skip-btn" data-hot>
                  Skip to the visuals
                  <span className="btn-arrow btn-arrow--down"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg></span>
                </a>
              </div>
            </Reveal>
            <Reveal className="ax-hero-media">
              <ZoomImg src={AIMG + "Axiom_Main.png"} alt="AxiomLens cashflow dashboard – main overview screen"
                caption="The main AxiomLens dashboard brings together core cashflow metrics, trends, and insights." />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stat band (enhancement) */}
      <section className="cs-section gm-stats-sec">
        <div className="cs-wrap">
          <div className="gm-statband">
            <Stat to={4} label="Hi-fi screens shipped" />
            <Stat to={10} label="Moderated usability sessions" />
            <Stat pre="~" to={2} suf=" wk" label="From sketches to hi-fi" />
            <Stat text={<><span className="accent">1–2</span></>} label="Clicks to any detail" />
          </div>
        </div>
      </section>

      {/* Nutshell */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h2 className="cs-h">Project in a Nutshell</h2></div>
          <Reveal className="cs-meta">
            <div className="cs-meta-cell">
              <div className="cs-meta-k">My role</div>
              <div className="cs-meta-v">Product concept, UX/UI design, UX research, interaction patterns, dashboard IA, microcopy, visual system basics</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Timeline</div>
              <div className="cs-meta-v">~2 weeks of evening work – first sketches to polished hi-fi screens</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Tools</div>
              <div className="cs-meta-v">Figma, Google Sheets &amp; Docs, Notion, ChatGPT, UX Pilot</div>
            </div>
          </Reveal>
          <Reveal className="cs-chips cs-mt-m" style={{ justifyContent: "center" }}>
            {["Dashboard UX", "Data-heavy UI", "Research", "Branding", "Financial SaaS", "Design System Foundations", "Microcopy (EN)"].map((c) =>
            <span className="tag" key={c}>{c}</span>
            )}
          </Reveal>
          <div className="cs-grid2 cs-mt-l">
            <Reveal>
              <h3 className="cs-h" style={{ fontSize: "1.25rem", marginBottom: ".8rem" }}>Challenge</h3>
              <p className="cs-p">
                Freelancers and small business owners rely on a patchwork of banking apps, invoicing tools, and
                spreadsheets. They see numbers, but rarely get a clear, at-a-glance view of how money moves over
                time, when a cashflow gap is coming, or which clients are slowing payments down. Existing
                dashboards either overwhelm with noisy charts or stay too high-level – and AI helpers are rarely
                implemented in a trustworthy way.
              </p>
            </Reveal>
            <Reveal>
              <h3 className="cs-h" style={{ fontSize: "1.25rem", marginBottom: ".8rem" }}>Objective</h3>
              <p className="cs-p">
                Design a graphical concept of cashflow analytics – <strong>AxiomLens</strong> – an all-in-one
                service that unites income, expenses, and invoices with readable AI insights on top. Keep
                data-heavy UI glanceable, with clear flows between overview, invoice management, and detailed
                history, so users get a single, reliable view of their financial health.
              </p>
            </Reveal>
          </div>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel">
              <h4>Highlights</h4>
              <PlainList items={[
              "Dark, calm dashboard UI with clear hierarchy for key metrics and trends",
              "Reusable cards for income, expenses, taxes, and AI insights",
              "Invoice table and detail views optimized for status, due dates, and actions",
              "A consistent component system for payment states and more",
              "Copy and labels written with localization in mind from day one"]
              } />
            </Reveal>
            <Reveal className="cs-panel cs-panel-accent">
              <h4>Outcome</h4>
              <PlainList items={[
              "A coherent set of 4 hi-fi screens ready for hand-off or prototyping",
              "Information architecture that links cashflow, invoices, and AI insights",
              "A solid design-system baseline – type, layout, cards, badges, styles",
              "A case study on problem framing, design decisions, and business value"]
              } />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Problem & Context */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Problem &amp; Context</h3></div>
          <div className="cs-grid2 ax-equal">
            <Reveal>
              <h4 className="gm-subh" style={{ marginTop: 0 }}>The Starting Point</h4>
              <p className="cs-p">
                Rather than designing yet another finance app, I focused on one scenario: a founder or freelancer
                opening a dashboard for a quick check-in before work – no time for deep analysis, just
                “does anything need attention today?”
              </p>
              <p className="cs-p">
                Their data lives in different places and on different timelines – daily bank movements, monthly
                subscriptions, irregular invoices, taxes due across quarters. AxiomLens brings those timelines
                into one view: what happened, what's scheduled, and what might become a problem.
              </p>
              <div className="ax-success ax-success-compact cs-mt-m">
                <div className="ax-sub5" style={{ marginBottom: ".7rem" }}>Success criteria · the main screen answers</div>
                <div className="ax-questions ax-questions-tight">
                  <p className="ax-q">“How are we doing <span className="accent">right now?</span>”</p>
                  <p className="ax-q">“What needs attention <span className="accent">today or this week?</span>”</p>
                  <p className="ax-q">“Is anything <span className="accent">risky</span> coming up soon?”</p>
                </div>
                <p className="ax-success-note">
                  Risks – cash dips, overdue invoices, upcoming large expenses – live in clearly defined areas,
                  not behind filters. Dense tables and charts stay scannable through consistent layout,
                  restrained color, and predictable patterns.
                </p>
              </div>
            </Reveal>
            <Reveal className="cs-panel ax-wire-panel">
              <h4>Early Wireframe Logic</h4>
              <p className="cs-p">
                Before any visual exploration, I mapped a complete screen-level flow – the core modules,
                navigation logic, and functional scope, including areas beyond the four final hi-fi screens.
              </p>
              <ZoomImg src={AIMG + "Wireframe.png"} alt="First-iteration logic wireframe showing planned modules and flows"
              caption="First-iteration wireframe map, later used to build the initial lo-fi prototype." className="ax-wire-fig" />
            </Reveal>
          </div>

          <div className="cs-grid2 cs-mt-l ax-equal">
            <Reveal className="cs-panel">
              <h4>Key Challenges</h4>
              <PlainList items={[
              "Aligning information that lives on different time scales (per invoice, per month, per quarter).",
              "Showing overdue and “almost overdue” items so they feel urgent but not alarmist.",
              "Translating AI insights into short, readable comments instead of opaque “predictions”.",
              "Keeping the UI approachable for non-accountants while exposing enough detail for real decisions."]
              } />
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Concept Constraints</h4>
              <KL items={[
              ["Single-owner view only", "in the MVP – no multi-user roles or collaboration tools this iteration."],
              ["Cashflow & invoices", "in scope – not full accounting or tax preparation."],
              ["Import assumed to exist", "– the focus is display and decision support, not integration flows."]]
              } />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Users & Goals */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Users &amp; Goals</h3></div>
          <p className="cs-p">
            I designed AxiomLens to track finances and improve the overall situation, using AI
            analytics to highlight patterns and events a human eye might miss, helping you steer your financial
            flow with a smarter, more attentive system.
          </p>

          <div className="ax-ug cs-mt-l">
            <div className="ax-ug-personas">
              <Persona avatar={AIMG + "guy_1.jfif"} name="Frank, 33" role="Owner of a small creative studio" tag="Busy owner"
              blurb="Runs a small business with a couple of employees and contractors. Between client calls, chats, and production work, he has only a few minutes to check finances and make quick decisions."
              needs={[
              "Whether the next 2–4 weeks are covered (rent, payroll, core expenses).",
              "Which invoices are late, by how much, and how that impacts this month.",
              "A single “now + next” view without rebuilding spreadsheets every week."]
              }
              pains={[
              "Data scattered across banking apps, Excel, and invoicing tools.",
              "Evenings spent reconciling numbers instead of running the business."]
              } />
              <Persona avatar={AIMG + "girl_1.jfif"} name="Jing, 29" role="Consultant with multiple retainers" tag="Freelance consultant"
              blurb="Works with several clients on retainers and project-based contracts. Payment terms differ wildly, so her income is irregular and easy to misjudge."
              needs={[
              "Track recurring invoices; spot gaps in future income.",
              "A client/project breakdown to see who really drives revenue.",
              "Gentle prompts to send invoices before delays become awkward."]
              }
              pains={[
              "No single place to see all upcoming payments and manage cashflow.",
              "Surprised by slow months – issues only show once the balance is already low.",
              "Late-night “did I send that invoice?” checks that create low-grade anxiety."]
              } />
            </div>

            <div className="ax-ug-goals">
              <Reveal className="cs-panel">
                <h4>What Success Looks Like</h4>
                <KL items={[
                ["Fast reality check.", "Open the dashboard, skim once, and know if the next few weeks look safe or shaky."],
                ["Predictable runway.", "Upcoming dips, big expenses, and thin months are visible early enough to react."],
                ["Actionable alerts.", "Each warning comes with 1–2 obvious next steps."],
                ["Low cognitive load.", "Plenty of detail for real decisions, grouped and labeled so the screen stays quiet."]]
                } />
              </Reveal>
              <Reveal className="cs-panel">
                <h4>Dashboard &amp; Design Goals</h4>
                <div className="ax-ug-2col">
                  <div>
                    <div className="ax-sub5">User goals</div>
                    <PlainList items={[
                    "See today's cash position and the coming 30–45 days in one place.",
                    "Spot late or risky invoices without hunting through emails.",
                    "Understand what's driving the trend – clients, months, invoices.",
                    "Decide quickly whether to invest, save, postpone, or chase.",
                    "Share a simple, exportable overview with an accountant or partner."]
                    } />
                  </div>
                  <div>
                    <div className="ax-sub5">Product &amp; UX principles</div>
                    <PlainList items={[
                    "Turn scattered financial data into one trustworthy view, not a wall of charts.",
                    "Highlight risk with clean, readable visuals.",
                    "Keep navigation shallow: dashboard to details in 1–2 clicks.",
                    "Design patterns that stretch to taxes, subscriptions, and deeper AI later."]
                    } />
                  </div>
                </div>
              </Reveal>
              <Reveal className="cs-panel">
                <h4>Constraints &amp; Non-Goals</h4>
                <div className="ax-twocol">
                  <KL items={[
                  ["Out of scope:", "a full accounting suite and multi-role permissions."],
                  ["Integrations:", "assume bank & invoicing sync exist; the concept focuses on UI/UX."],
                  ["Data freshness:", "show sync status and last-updated stamps; avoid false precision."]]
                  } />
                  <KL items={[
                  ["Overload guardrails:", "prefer narrative summaries over raw chart dumps."],
                  ["Iteration focus:", "a single-user dashboard for the MVP."]]
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
          <div className="cs-head"><h3 className="cs-h">Key Screens</h3></div>
          <p className="cs-p" style={{ marginBottom: "2.4rem" }}>
            A closer look at the core flow: from the main dashboard, through a deeper cashflow overview, into
            invoice management. Together they show how dense financial data becomes a simple loop – understand
            the situation, spot an issue, open the details, take action.
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
                  <div className="ax-sub5 ax-dec-label">Key decisions</div>
                  <KL items={s.dec} />
                </Reveal>
                <Reveal className="ax-screen-media">
                  <ZoomImg src={AIMG + s.img} alt={s.k + " screen"} caption={s.cap} />
                </Reveal>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Logo & Branding */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Logo &amp; Branding</h3></div>
          <p className="cs-p">
            For a finance product, trust often starts with the logo. I needed something analytical and modern
            that hinted at “smart” AI help but read first as a financial tool. The name pointed the way:
            <strong> Axiom</strong> as a reliable truth, <strong>Lens</strong> as a way to inspect data. The
            explorations below move from a generic “AI + aperture” mark to a grounded, chart-based symbol.
          </p>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel">
              <h4>What the Brand Stands For</h4>
              <KL items={[
              ["Financial clarity only.", "Serious enough to handle money, without looking like a trading or crypto app."],
              ["Smart, but not sci-fi.", "A subtle nod to AI and automation, not a tech-gadget icon."],
              ["Stable and grounded.", "Clear geometry and an underlying grid suggest structure and long-term use."]]
              } />
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Naming Logic</h4>
              <KL items={[
              ["Axiom", "– a core truth: the stable, reliable foundation for decisions."],
              ["Lens", "– focus and clarity: a metaphor for understanding what's ahead."],
              ["AxiomLens", "– together, “reliable numbers, seen clearly.”"]]
              } />
            </Reveal>
          </div>
          <Reveal className="cs-mt-l"><h4 className="gm-subh" style={{ marginTop: 0 }}>Logo Evolution</h4></Reveal>
          <div className="ax-logos">
            {LOGOS.map(([img, n, desc]) =>
            <Reveal className="ax-logo-card" key={img}>
                <ZoomImg src={AIMG + img} alt={"AxiomLens logo, iteration " + n} className="ax-logo-fig" />
                <p className="ax-logo-desc"><span className="ax-logo-n">{n}</span>{desc}</p>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* Design Process & Iterations */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Design Process &amp; Iterations</h3></div>
          <p className="cs-p">
            I approached AxiomLens like a real product: start with flows and information architecture, move from
            lo-fi exploration to focused hi-fi iterations, validate with usability tests, and only then lock the
            visual system. Prove the logic first – what screens exist, what each must show, how easily people
            move through them – then refine the data-to-UI ratio, hierarchy, and colour.
          </p>
          <ol className="ax-steps cs-mt-l">
            {[
            ["Flow map & wireframe logic.", "Mapped the key areas – cashflow, invoices, clients, expenses, taxes, insights, settings, mobile – into one wireframe flow: which screens exist, how they connect, and what each answers."],
            ["Lo-fi, AI-assisted layout.", "Used the flow as a brief to generate a rough lo-fi dashboard and stress-test density – which metrics earn a place above the fold, and how much fits without feeling cramped."],
            ["Hi-fi iterations on hierarchy.", "Several hi-fi passes explored the quick overview, invoice area, and graph treatments – some leaning into gradients and depth, others flatter and editorial to stay calm and premium."],
            ["Usability testing & feedback.", "Ran 10 remotely-moderated sessions with German freelancers on an interactive prototype. Feedback reshaped AI-insight placement, status-state contrast, and a softer palette."],
            ["Converging on the final layout.", "The final dashboard combines the strongest parts of each pass: clearer invoice visuals, a more informative summary strip, consistent colour roles, and a tighter rhythm between cards, charts, and tables."]].
            map(([b, t], i) =>
            <li className="ax-step" key={i}>
                <span className="ax-step-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="ax-step-t"><strong>{b}</strong> {t}</span>
              </li>
            )}
          </ol>
          <Reveal className="cs-mt-l"><h4 className="gm-subh" style={{ marginTop: 0 }}>From Flow Map to Final Dashboard</h4></Reveal>
          <Carousel items={THUMBS} />
        </div>
      </section>

      {/* Design System Foundations */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Design System Foundations</h3></div>
          <p className="cs-p">
            I set up a small design system early so the dashboard could stay dense and readable as it evolved –
            type that holds up next to numbers, a calm dark theme, and simple patterns that are easy to reuse.
          </p>
          <div className="ax-dsys cs-mt-l">
            <Reveal className="cs-panel">
              <h4>Typography</h4>
              <KL items={[
              ["Readable under pressure.", "Sizes chosen to stay legible next to busy tables and charts."],
              ["Two-level hierarchy.", "Headlines guide scanning; labels and helper text stay quiet."],
              ["Monospace accents.", "Used sparingly for aligned financial values and code-like details."]]
              } />
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Colors &amp; Surface</h4>
              <KL items={[
              ["Dark canvas.", "Comfortable for long sessions and makes chart lines stand out – a light theme is planned too."],
              ["Soft blues.", "Accents that feel analytical and calm, not “growth-hack” hype."],
              ["Borders over shadows.", "Minimal elevation keeps focus on data."]]
              } />
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Spacing &amp; Rhythm</h4>
              <KL items={[
              ["Consistent scale.", "A unified system across sections and components for a cohesive feel."],
              ["Card-first structure.", "Dense data broken into clear, breathable modules."],
              ["Edge discipline.", "Strong outer margins prevent clutter and keep layouts intentional."]]
              } />
            </Reveal>
          </div>
          <Reveal className="cs-mt-l"><h4 className="gm-subh" style={{ marginTop: 0 }}>Core Components</h4></Reveal>
          <p className="cs-p" style={{ marginBottom: "1.6rem" }}>
            These four families do most of the heavy lifting – reusing them keeps the product consistent without
            a huge system.
          </p>
          <div className="ax-comp">
            {COMPONENTS.map(([img, cap], i) =>
            <Reveal className="ax-comp-card" key={i}>
                <ZoomImg src={AIMG + img} alt={typeof cap === "string" ? cap : "Component"} caption={cap} className="ax-comp-fig" />
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Next Steps</h3></div>
          <p className="cs-p">
            AxiomLens is a concept project – turning it real would take engineers, data and AI specialists,
            security and compliance experts, tax lawyers, and proper support. Still, thinking about “what next?”
            sharpens the direction. If I evolved it further, I'd focus on:
          </p>
          <Reveal className="ax-next cs-mt-l">
            {[
            ["Light & dark themes.", "Dark stays default, plus a light theme and system-theme auto switching that holds up in both modes."],
            ["Multi-currency & VAT.", "One view that normalizes currencies, VAT rates, and tax rules for cross-border freelancers and studios."],
            ["Team mode.", "Roles and permissions for founders, assistants, or external accountants sharing one workspace."],
            ["Deeper integrations.", "From in-house import toward direct links with major EU providers (Stripe, PayPal, SEPA, local banks)."],
            ["Account types.", "A “business owner” view for entrepreneurs and a lighter “client” view for checking and paying invoices."],
            ["Tax hub.", "Tracks which taxes apply, estimates rates from available data, and surfaces deadlines per country or region."]].
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
          <div className="cs-head" style={{ justifyContent: "center" }}><h3 className="cs-h">Learnings</h3></div>
          <p className="cs-p" style={{ textAlign: "center" }}>
            AxiomLens was less about drawing a fancy dashboard and more about what it takes to make financial
            tools feel usable and trustworthy. A few things that stuck with me:
          </p>
          <ul className="cs-steps cs-mt-m">
            {[
            ["Questions first, screens second.", "Asking “what do people want to know in the first 30 seconds?” made a lot of UI fall away – and clarified what deserved the top row."],
            ["AI is only useful where it lands.", "Insights needed a dedicated place in a data-heavy product; usability sessions found a layout people noticed without finding distracting."],
            ["Density costs more than you think.", "Every extra block made real numbers harder to read. I cut several ideas and preferred fewer, stronger components."],
            ["Brand and product must agree.", "The “aperture + circuits” logo read as a generic AI tool; a more financial symbol instantly aligned expectations."],
            ["Concept work still reveals real complexity.", "Sketching next steps – tax logic, multi-currency, integrations, roles – was a healthy dose of humility about the depth behind “simple” finance products."]].
            map(([b, t], i) => <li className="cs-li" key={i}><strong>{b}</strong> {t}</li>)}
          </ul>
        </div>
      </section>
    </div>);

}

Object.assign(window, { AxiomCase });