/* portfolio-content.jsx – English edition of the Portfolio case study.
   Helpers + OldDesignCase + NewDesignCase. Exports all to window.
   The page shell lives in casestudy-portfolio.jsx.
   Depends on core.jsx + casestudy-shared.jsx. */

const PF = "assets/cs/";
const OLDIMG = "assets/";
const OLD = {
  heroGif:     OLDIMG + "video_full.gif",
  iter1:       OLDIMG + "Iteration1.png",
  iter2:       OLDIMG + "Iteration2.png",
  localization: OLDIMG + "Localization.png",
};

function CSSwitch({ view, onChange }) {
  return (
    <div className="cs-switch" role="tablist" aria-label="Choose case study">
      <span className="cs-thumb" aria-hidden="true"></span>
      <button role="tab" aria-selected={view === "old"} className={view === "old" ? "active" : ""} data-hot onClick={() => onChange("old")}>Old Design</button>
      <button role="tab" aria-selected={view === "new"} className={view === "new" ? "active" : ""} data-hot onClick={() => onChange("new")}>New Design</button>
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
          onClick={() => open({ src, alt, caption })} aria-label={"Expand image: " + alt}>
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
   OLD DESIGN
   ============================================================ */
function OldDesignCase() {
  return (
    <div className="cs-view">
      <section className="cs-section cs-hero">
        <div className="cs-wrap">
          <div className="cs-kicker">
            <Reveal><MonoLabel>Case Study · Portfolio v1</MonoLabel></Reveal>
          </div>
          <div className="ax-hero-grid">
            <Reveal className="ax-hero-text">
              <h1 className="cs-title">This portfolio,<br /><span className="accent">built from scratch.</span></h1>
              <p className="cs-sub">Why I skipped the templates and coded a custom, multilingual site myself</p>
              <p className="cs-lead">
                UXfolio felt rigid, and Behance is nice but not my format. I wanted a site that could grow
                with me, reflect my identity and show real product thinking with my skills in action – so I
                designed, wrote and coded it myself.
              </p>
            </Reveal>
            <Reveal>
              <BrowserShot src={OLD.heroGif} url="alexmedved.com" tag="v1 · 2024"
                alt="The original alexmedved.com portfolio – animated hero preview"
                caption="The logo was the first thing I designed, and it only took a couple of hours." />
            </Reveal>
          </div>
        </div>
      </section>

      <PFStatBand stats={[
        { pre: "~", to: 1, suf: " mo", label: "From zero to launch, after work" },
        { to: 4, label: "Pages live at launch" },
        { to: 3, label: "Languages – EN / DE / RU" },
        { to: 0, label: "Templates or page builders" },
      ]} />

      <SkillMarquee items={["Identity & Branding", "UX / UI", "Content & ToV", "Frontend", "Localization"]} />

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h2 className="cs-h">Project in a Nutshell</h2></div>
          <Reveal className="cs-meta">
            <div className="cs-meta-cell">
              <div className="cs-meta-k">My role</div>
              <div className="cs-meta-v">UX/UI Design, UX Writing, Brand &amp; Logo, Front-end, Localization (EN → DE/RU), Publishing</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Timeline</div>
              <div className="cs-meta-v">~1 month of irregular after-work evenings</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Tools</div>
              <div className="cs-meta-v">Figma, VS Code, Tailwind, GitHub Pages, HTML/CSS/JS, ChatGPT, Google Docs, CodePen</div>
            </div>
          </Reveal>
          <Reveal className="cs-chips cs-mt-m" style={{ justifyContent: "center" }}>
            {["Identity & Branding", "UX / UI", "Content & ToV", "Frontend", "Localization (EN / DE / RU)"].map((c) => (
              <span className="tag" key={c}>{c}</span>
            ))}
          </Reveal>
          <div className="cs-grid2 cs-mt-l">
            <Reveal>
              <h3 className="cs-h" style={{ fontSize: "1.25rem", marginBottom: ".8rem" }}>Challenge</h3>
              <p className="cs-p">
                Define a professional identity, design a fitting logo, and build a polished, responsive
                portfolio without relying on templates – all while not being a full-time developer. The goal
                was to get everything running quickly and keep it easy to maintain.
              </p>
            </Reveal>
            <Reveal>
              <h3 className="cs-h" style={{ fontSize: "1.25rem", marginBottom: ".8rem" }}>Objective</h3>
              <p className="cs-p">
                Build a responsive, brand-worthy, multilingual site that tells my story clearly, presents
                case studies in a consistent way, and gives me full control over content, code, and growth.
              </p>
            </Reveal>
          </div>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel pf-lift">
              <h4>Highlights</h4>
              <ul className="cs-steps">
                {["Custom identity and logo aligned to my voice and work",
                  "Reusable case-study layout for consistent storytelling",
                  "Multilingual structure (EN → DE/RU) planned from day one",
                  "Fast static stack with Tailwind on GitHub Pages",
                  "Accessible, scannable typography and spacing system"].map((t) => (
                  <li className="cs-li" key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="cs-panel pf-lift">
              <h4>Outcome</h4>
              <ul className="cs-steps">
                {["A site that feels personal, trustworthy, and ready to grow",
                  "A sharper story around skills, process, and real impact",
                  "Full control over hosting, speed, and SEO essentials",
                  "No vendor lock-in – everything runs from my repo",
                  "A responsive website I own to the last character and pixel"].map((t) => (
                  <li className="cs-li" key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Process</h3></div>
          <p className="cs-p" style={{ maxWidth: "70ch" }}>
            I approached this site like a small product: shippable chunks, honest constraints, and fast
            learning. The goal was a clear, evolving system that could grow alongside my work, rather than a one-off website.
          </p>
          <ol className="ax-steps cs-mt-l">
            {[
              ["Find the voice.", "Sketched directions, gathered references, and defined a tone that feels simple, confident and warm."],
              ["Shape the identity.", "In a few hours I created the logo and tested how well it reflected me, and how it held up in mockups."],
              ["Map the work.", "In Figma I drafted the first pages to launch – Home, About, Case Studies, Contact – starting desktop-first."],
              ["Prove the rhythm.", "Built interactive mocks to test flow, spacing and reading pace before writing any code."],
              ["Build like blocks.", "With HTML / Tailwind / JS I set up component-based sections, using ChatGPT to speed up the repetitive work."],
              ["Go multilingual.", "Wrote in English first, then localized into DE/RU while keeping tone and clarity intact."],
              ["Ship, check, iterate.", "Published on GitHub Pages, tested on real devices, and documented choices to keep future edits simple."],
            ].map(([b, t], i) => (
              <li className="ax-step" key={b}>
                <span className="ax-step-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="ax-step-t"><strong>{b}</strong> {t}</span>
              </li>
            ))}
          </ol>
          <Reveal className="cs-mt-l">
            <ZoomImg src={OLD.iter1} alt="Early Figma concept board – page map for desktop and mobile"
              capAccent="Figma →"
              caption="Early concept board in Figma: first pages to launch with a desktop-first plan. Later, I reworked the case-study system – spacing, proportions, and margins – for a smoother reading rhythm." />
          </Reveal>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Key Decisions &amp; Design Principles</h3></div>
          <p className="cs-p" style={{ maxWidth: "70ch" }}>
            Instead of forcing a "before vs. after," I outlined the choices that shaped this site and the
            principles that kept it cohesive – decisions made to keep the design clear, adaptable, and true to my work.
          </p>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel cs-panel-accent pf-lift">
              <h4>Decisions in Focus</h4>
              <ul className="cs-steps">
                {[["Build from scratch, no compromise:", "full creative control, stronger performance, and a brand home that truly fits me. Plus, a deliberate investment in learning."],
                  ["Custom logo over a font-only wordmark:", "a mark with personality that works across favicon, social, and print – designed to feel modern and approachable."],
                  ["Desktop first, then mobile:", "since case studies are mostly read on desktop, I shaped the flow there first – making mobile adaptations cleaner and faster."],
                  ["Manual localization:", "tone, terminology, and context matter. Careful translation creates more trust, better UX, and stronger SEO than automation ever could."]].map(([b, t]) => (
                  <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="cs-panel pf-lift">
              <h4>Design Rules in Practice</h4>
              <ul className="cs-steps">
                {[["Clarity:", "clear hierarchy in case studies so role, outcome, and impact are visible at a glance."],
                  ["Consistency:", "a spacing scale and typographic rhythm that hold pages together; reusable blocks align text and design."],
                  ["Identity:", "logo, tone of voice, and colors build a calm, approachable brand – consistent from hero to footer."],
                  ["Flexibility:", "built as a system (Tailwind + modular content), so adding new case studies can be done quickly and efficiently."]].map(([b, t]) => (
                  <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Impact</h3></div>
          <p className="cs-p" style={{ maxWidth: "72ch" }}>
            This project reshaped the way I approach design and projects as a whole. I picked up new skills,
            honed the ones I had, and experienced the full power of creative freedom – without paywalls or
            platform constraints standing in the way.
          </p>
          <div className="cs-grid2 cs-mt-m">
            <ul className="cs-steps">
              {[["Readability.", "Clear hierarchy and consistent patterns make long pages easy to skim."],
                ["Craft.", "A custom logo and tone give the portfolio a distinct, human voice."],
                ["Ownership.", "Content and code live in my repo – no lock-ins, no plugin roulette."]].map(([b, t]) => (
                <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
              ))}
            </ul>
            <ul className="cs-steps">
              {[["Localization.", "A manual approach keeps nuance and credibility intact."],
                ["Performance.", "A lightweight static build keeps pages fast and stable."],
                ["Dev empathy.", "The project gave me a better taste of what engineers face day to day."]].map(([b, t]) => (
                <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
              ))}
            </ul>
          </div>
          <div className="cs-grid2 ax-equal pf-oldpair cs-mt-l">
            <Reveal>
              <ZoomImg className="pf-oldfig" src={OLD.iter2} alt="Iteration 2 – reworked Case Studies layout"
                caption="Iteration 2, the penultimate layout – case studies reorganized, spacing refined, and everything polished before coding." />
            </Reveal>
            <Reveal>
              <ZoomImg className="pf-oldfig" src={OLD.localization} alt="Component frame with aligned blocks and translations"
                caption="All blocks were built as components, with texts managed and translated into three languages in one convenient table." />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-prose">
          <div className="cs-head" style={{ justifyContent: "center" }}><h3 className="cs-h">Learnings</h3></div>
          <p className="cs-p" style={{ textAlign: "center" }}>
            Building this site was a challenge in shipping a product end-to-end, design included.
            I learned to juggle identity, structure and code while keeping the focus on clarity and usability.
          </p>
          <ul className="cs-steps cs-mt-m">
            {[["Systems thinking.", "Clear spacing and grid rhythm saved hours once coding began."],
              ["Design → code flow.", "Tidy Figma components translated directly into cleaner HTML/CSS."],
              ["Localization awareness.", "Planning for EN, DE and RU early prevented layouts from breaking."],
              ["Momentum over perfection.", "The most effective rule: build it first, improve it later."]].map(([b, t]) => (
              <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   NEW DESIGN
   ============================================================ */
function NewDesignCase() {
  return (
    <div className="cs-view">
      <section className="cs-section cs-hero">
        <div className="cs-wrap">
          <div className="cs-kicker">
            <Reveal><MonoLabel>Case Study · Portfolio v2</MonoLabel></Reveal>
          </div>
          <Reveal as="h1" className="cs-title">The same portfolio,<br /><span className="accent">rebuilt with AI.</span></Reveal>
          <Reveal as="p" className="cs-lead">
            A year after shipping v1 the content held up, but the visuals didn't read like "data-heavy product
            design." So I rebuilt the whole front-end with Claude as a design partner – I directed the
            system and reviewed every screen. One week of evenings, same story, a sharper signal.
          </Reveal>
          <Reveal className="cs-meta cs-mt-l">
            <div className="cs-meta-cell">
              <div className="cs-meta-k">My role</div>
              <div className="cs-meta-v">Art direction, design system, prompting &amp; reviewing, front-end QA</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">AI in the loop</div>
              <div className="cs-meta-v">Claude as primary design/code partner, plus assorted LLMs for copy &amp; review</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Kept / changed</div>
              <div className="cs-meta-v">Same content &amp; story · new visual language, architecture and interactions</div>
            </div>
          </Reveal>
        </div>
      </section>

      <PFStatBand stats={[
        { pre: "~", to: 1, suf: " wk", label: "To rebuild the system & migrate" },
        { from: 33, to: 16, label: "Pages, after the rebuild" },
        { from: 15, to: 2, label: "Certs & legal – now modals" },
        { to: 3, label: "Languages, zero layout drift" },
      ]} />

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h2 className="cs-h">Before / After</h2></div>
          <Reveal className="pf-ba">
            <BrowserShot src={PF + "pf-old-hero.png"} url="alexmedved.com" tag="v1 · 2024"
              alt="Old portfolio hero – light, template-like layout"
              caption={<><strong>Before.</strong> A clean but generic light layout – a headshot, a job title, and a sentence.</>} />
            <BrowserShot src={PF + "pf-new-hero.png"} url="alexmedved.com" tag="v2 · 2026" isNew
              alt="New portfolio hero – bold editorial type on dark"
              caption={<><strong>After.</strong> A point of view in display type, an intentional palette, and a structural data-grid motif.</>} />
          </Reveal>
          <p className="cs-cap pf-fig-note">
            The headline went from a job title to a statement. Type got louder, the palette got decisive, and
            the grid behind everything nods to the dashboards I actually design.
          </p>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-grid2 ax-equal" style={{ alignItems: "center" }}>
            <div>
              <div className="cs-head"><h3 className="cs-h">The System behind the Rebuild</h3></div>
              <p className="cs-p">
                Before touching screens, Claude and I locked a small set of rules so every page would hold together with intent.
              </p>
              <ul className="cs-steps cs-mt-m">
                {[["Type.", "Archivo for confident display, Space Mono for labels and metadata – a product, lab-notebook feel."],
                  ["Palette.", "Warm near-black paper with a single decisive accent. Light and dark are both first-class."],
                  ["Motif.", "A faint 12-column data grid behind everything – a nod to dashboards and structure."],
                  ["Rhythm.", "One spacing scale and reveal-on-scroll cadence reused across hero, cards and case studies."]].map(([b, t]) => (
                  <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
                ))}
              </ul>
            </div>
            <Reveal>
              <BrowserShot src={PF + "pf-new-case.png"} url="alexmedved.com/case-study" tag="case study" isNew
                alt="New case-study page with mono labels, stats and live shots"
                caption={<><span className="accent">System → </span>One set of tokens drives every case study: mono index labels, an accent system, animated stat bands and a flagship hero.</>} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Fewer Pages, Smoother UX</h3></div>
          <p className="cs-p" style={{ maxWidth: "74ch" }}>
            The old site sprawled: certificates, imprint and privacy were 15 separate pages across three
            languages. In v2 they collapse into hover-previews and modals on a single page – with hash-routed
            URLs (<code>/#impressum</code>) so legal pages stay directly linkable. Less to translate, less to drift.
          </p>
          <Reveal className="pf-twin cs-mt-l">
            <BrowserShot src={PF + "pf-new-anim.png"} url="alexmedved.com/#certificates" tag="hover to preview" isNew
              alt="New certificates list with a hover preview card"
              caption={<><strong>Certificates, as a list.</strong> Hover lifts a live preview of the scan; the cursor-tracked card and accent ring are pure interaction, no extra pages.</>} />
            <BrowserShot src={PF + "pf-smoother-ux.png"} url="alexmedved.com/#certificates" tag="click for detail" isNew
              alt="Certificate detail modal with structured metadata"
              caption={<><strong>Click for the full record.</strong> A single modal carries date, skills and a verify link – what used to be 15 pages now lives behind one consistent component.</>} />
          </Reveal>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Trade-Offs I Made on Purpose</h3></div>
          <div className="cs-grid2">
            <Reveal className="cs-panel pf-lift">
              <div className="cs-stat">
                <div className="cs-stat-n">33 <span className="arrow">→</span> <span className="accent">16</span></div>
                <div className="cs-stat-k">pages collapsed</div>
              </div>
              <p className="cs-p cs-mt-m">
                Half the site was duplicated chrome across three languages. Folding it into modals and a
                live language switch cut the page count roughly in half – and cut the translation surface with it.
              </p>
            </Reveal>
            <Reveal className="cs-panel pf-lift">
              <h4>Deliberate Calls</h4>
              <ul className="cs-steps">
                {[["Live toggles.", "Theme, accent, case-grid layout and card style are live toggles – directions get compared, not guessed."],
                  ["SPA vs. static.", "A React front-end costs some SEO simplicity; kept content in plain markup and real URLs to claw it back."],
                  ["AI drafts, I direct.", "Models move fast but average out. Every screen got pushed past its first ‘fine’ version by hand."]].map(([b, t]) => (
                  <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-prose">
          <div className="cs-head" style={{ justifyContent: "center" }}><h3 className="cs-h">Working with AI as a Design Partner</h3></div>
          <ul className="cs-steps cs-mt-s">
            {[["Taste is the bottleneck.", "The model can generate ten layouts in a minute; knowing which one is right – and why – is still the job."],
              ["Specs beat vibes.", "Concrete constraints (tokens, grid, motion rules) produced far better output than ‘make it modern.’"],
              ["Review like a lead.", "I treated each pass as a design crit: keep, kill, push. Momentum stayed high without losing the bar."],
              ["Own the result.", "It still lives in my repo, in code I understand and can edit to the last pixel."]].map(([b, t]) => (
              <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
            ))}
          </ul>
          <p className="cs-p cs-mt-m" style={{ textAlign: "center", maxWidth: "52ch", marginInline: "auto" }}>
            The result is a portfolio that finally looks like the products it talks about – and a workflow I'd
            use again on any product surface.
          </p>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { CSSwitch, PFStat, PFStatBand, BrowserShot, SkillMarquee, OldDesignCase, NewDesignCase });
