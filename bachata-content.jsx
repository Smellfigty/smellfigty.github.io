/* bachata-content.jsx – English edition of the Bachata School case study.
   Content + components (Stat band, Before/After toggle) for the rebuilt design.
   Exports <BachataCase/>. The page shell lives in casestudy-bachata.jsx.
   Depends on core.jsx + casestudy-shared.jsx (Reveal, MonoLabel, ZoomImg, useLightbox). */

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

/* one interactive Before / After comparison – segmented toggle morphs the same
   stage between the original and the reworked screen, with the notes swapping in sync.
   Images are clickable and open in the shared lightbox. */
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
        <div className="ba2-seg" role="tablist" aria-label={title + " before and after"}>
          <button type="button" role="tab" aria-selected={!isAfter} data-hot
            className={"ba2-seg-btn" + (!isAfter ? " on" : "")} onClick={() => setView("before")}>Before</button>
          <button type="button" role="tab" aria-selected={isAfter} data-hot
            className={"ba2-seg-btn" + (isAfter ? " on" : "")} onClick={() => setView("after")}>After</button>
        </div>
      </div>
      <div className="ba2-body">
        <div className="ba2-stage">
          <button type="button" className="ba2-figbtn" data-hot
            onClick={() => open({ src: active.img, alt: active.alt })}
            aria-label={"Expand " + view + " screen: " + active.alt}>
            <span className={"cs-ba-tag" + (isAfter ? " is-after" : "")}>{isAfter ? "After" : "Before"}</span>
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
          <div className="ba2-notes-k">{isAfter ? "What changed" : "Issues spotted"}</div>
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
    title: "Primary flow",
    before: {
      img: BIMG + "Screenshot-Bachata-Doc33.jpg",
      alt: "Before – hero and primary flow",
      points: [
        "No clear **“Book Now”** button",
        "Heavy, less approachable wording",
        "Inconsistent card sizes and layout",
        "Hard to scan for quick decisions",
      ],
    },
    after: {
      img: BIMG + "Screenshot-Bachata-Doc44.png",
      alt: "After – hero with Book Now and improved microcopy",
      points: [
        "Added a clear **“Book Now”** button",
        "Changed “Package” to **“Pass”** – playful and familiar",
        "Unified card sizes for consistency",
        "Refined wording, structure and added bullet points",
      ],
    },
  },
  {
    title: "Info block",
    before: {
      img: BIMG + "Screenshot-Bachata-Doc55.jpg",
      alt: "Before – dense information block",
      points: [
        "Large, uniform text blocks",
        "No visual emphasis, hard to skim",
        "Key details hidden in long paragraphs",
      ],
    },
    after: {
      img: BIMG + "Screenshot-Bachata-Doc66.png",
      alt: "After – scannable info with emphasis",
      points: [
        "Added relevant **emojis** for easier parsing",
        "Shortened text for better readability",
        "Highlighted key details in **bold** for quick scanning",
      ],
    },
  },
  {
    title: "Key points / benefits",
    before: {
      img: BIMG + "Screenshot-Bachata-Doc11.jpg",
      alt: "Before – key points / benefits section",
      points: [
        "Weak or missing headings",
        "Long lines with little rhythm",
        "Text felt non-native and harder to grasp",
      ],
    },
    after: {
      img: BIMG + "Screenshot-Bachata-Doc22.png",
      alt: "After – clearer benefits with strong headings",
      points: [
        "Added strong, visible headings",
        "Rewritten for **clarity & tone**",
        "Simple, natural phrasing – much easier to understand",
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
                <Reveal><MonoLabel>Case Study · 04 – Bachata School</MonoLabel></Reveal>
                <Reveal as="span" className="mono-sm" style={{ color: "var(--ink-faint)" }}>2024 · one evening</Reveal>
              </div>
              <Reveal as="h1" className="cs-title">Clearer words,<br /><span className="accent">better UX.</span></Reveal>
              <Reveal as="p" className="cs-sub">From cluttered copy to a clear, conversion-driven site in just one evening</Reveal>
              <Reveal as="p" className="cs-lead">
                A full UX-writing and content-structure sprint. I reviewed the dance-school site end to end,
                mapped the pain points, and rewrote the key sections so newcomers could quickly grasp the
                offer, check pricing, and contact the coaches – a friendlier site that's easier to scan and act on.
              </Reveal>
            </div>
            <Reveal>
              <ZoomImg src={BIMG + "Screenshot-Bachta.png"} alt="Bachata website hero section"
                caption="Hero of the Bachata site. The client kept some UI to their own taste, but the changes still lifted both UX and overall appeal." />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Animated stat band */}
      <section className="cs-section">
        <div className="cs-wrap">
          <Reveal className="cs-head">
            <h2 className="cs-h">By the numbers</h2>

          </Reveal>
          <div className="gm-statband">
            <Stat to={1} label="Evening · full review → shipped" />
            <Stat to={5} label="Core sections rewritten" />
            <Stat to={11} suf="-page" label="Document with edits" />
            <Stat to={2} pre="×" label="Inquiries within a week" />
          </div>
        </div>
      </section>

      {/* Nutshell */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h2 className="cs-h">Project in a nutshell</h2></div>

          <Reveal className="cs-meta">
            <div className="cs-meta-cell">
              <div className="cs-meta-k">My role</div>
              <div className="cs-meta-v">UX Writing &amp; Review, IA cleanup, microcopy &amp; CTA design, EN localization refinement</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Timeline</div>
              <div className="cs-meta-v">One evening – review → proposal → second-pass QA</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Tools</div>
              <div className="cs-meta-v">Google Docs (spec + rationale), Tilda (site platform), Figma (quick comps)</div>
            </div>
          </Reveal>

          <Reveal className="cs-chips cs-mt-m" style={{ justifyContent: "center" }}>
            {["Audit", "UX Writing", "IA / Structure", "CTA & Forms", "Localization (EN)"].map((c) => (
              <span className="tag" key={c}>{c}</span>
            ))}
          </Reveal>

          <div className="cs-grid2 cs-mt-l">
            <Reveal>
              <h3 className="cs-h" style={{ fontSize: "1.25rem", marginBottom: ".8rem" }}>Challenge</h3>
              <p className="cs-p">
                No access to the client's Tilda account, so every change had to be documented in a clear,
                reproducible spec with reasoning and examples. After the client shipped the updates, I ran a
                second-pass QA to catch gaps and make sure nothing critical was missed.
              </p>
            </Reveal>
            <Reveal>
              <h3 className="cs-h" style={{ fontSize: "1.25rem", marginBottom: ".8rem" }}>Objective</h3>
              <p className="cs-p">
                Make the site quick to scan and act on in one sitting: refine the information architecture,
                clarify offers, simplify pricing and schedules, streamline booking, and craft approachable
                English copy that feels professional to newcomers.
              </p>
            </Reveal>
          </div>

          <div className="cs-grid2 cs-mt-l" style={{ alignItems: "stretch" }}>
            <Reveal className="cs-panel">
              <h4>Highlights</h4>
              <ul className="cs-steps">
                {["Mapped pain points and rewrote hero, value prop, pricing, FAQs, and CTAs",
                  "Consolidated scattered info, reducing cognitive load on key pages",
                  "Refined CTA hierarchy and clarified contact / booking paths",
                  "Delivered a Google Doc playbook with before/after copy, rationale, and notes",
                  "Ran a QA check after implementation to verify the fixes"].map((t) => (
                  <li className="cs-li" key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Outcome</h4>
              <ul className="cs-steps">
                {["Onboarding feels smoother – visitors find info and pricing faster, with fewer clicks",
                  "Stronger first impression – polished English microcopy raises perceived professionalism",
                  "Clearer paths to action led to more inquiries and new student enrollments",
                  "The site now reads like a friendly invitation rather than a puzzle"].map((t) => (
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
          <div className="cs-head"><h3 className="cs-h">Changes made transparent</h3></div>
          <p className="cs-p">
            Every recommendation lived in one structured Google Doc: a marked-up screenshot, the original text,
            and the proposed version right underneath. When a change called for a strategic choice I offered
            2–3 focused variants; otherwise a single clear option kept momentum and avoided “too much choice.”
            The client could review, decide, and implement quickly.
          </p>
          <div className="cs-grid3 cs-mt-l">
            <Reveal>
              <ZoomImg src={BIMG + "Screenshot-Bachata-Doc.png"} alt="Spec doc: annotated screenshot, current copy, proposed revision"
                caption="Marked issues, suggested fixes, added notes – structured feedback that kept us on time."
                capAccent="Spec →" />
            </Reveal>
            <Reveal>
              <ZoomImg src={BIMG + "Screenshot-Bachata-Doc2.png"} alt="Spec doc: headline and CTA alternatives with rationale"
                caption="Worked section by section, prioritizing core flows like trial classes and venue info." />
            </Reveal>
            <Reveal>
              <ZoomImg src={BIMG + "Screenshot-Bachata-Doc3.png"} alt="Spec doc: final proposed copy with implementation notes"
                caption="Impact showed right after the first edits – the landing instantly felt clearer and more inviting." />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Before → After */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head">
            <h3 className="cs-h">Before → after highlights</h3>

          </div>
          <p className="cs-p">
            To show the impact of the rewrite, here are three key areas of the site. Each pair turns a vague,
            inconsistent, or hard-to-scan section into a clear, user-friendly experience that helps visitors
            act with confidence.
          </p>
          <div className="ba2-stack cs-mt-l">
            {BA_PAIRS.map((p, i) => <BAToggle key={p.title} index={i + 1} {...p} />)}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Impact</h3></div>
          <p className="cs-p">
            In one evening, the site became clearer, friendlier, and more action-oriented. The rework removed
            friction, made key information easier to find, and gave the school a stronger, more professional
            presence. Most importantly, the changes led to more inquiries and sign-ups – contacting the coaches
            and booking a class became simple and obvious.
          </p>
          <div className="cs-grid2 cs-mt-m">
            <ul className="cs-steps">
              {[["Usability.", "Clearer CTAs, consistent layouts, better scanability across sections."],
                ["Clarity.", "Simplified language, less ambiguity, structured content flow."],
                ["Consistency.", "Unified card sizes, headline patterns, and CTA styles for a professional look."]].map(([b, t]) => (
                <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
              ))}
            </ul>
            <ul className="cs-steps">
              {[["Actionability.", "“Book Now” paths made visible and emphasized throughout."],
                ["Accessibility.", "Beginner-friendly phrasing with reduced jargon."],
                ["Business impact.", "An easier booking process led to more class enrollments (client-reported)."]].map(([b, t]) => (
                <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Learnings */}
      <section className="cs-section">
        <div className="cs-prose">
          <div className="cs-head" style={{ justifyContent: "center" }}><h3 className="cs-h">Learnings</h3></div>
          <p className="cs-p" style={{ textAlign: "center" }}>
            Another reminder that sharp UX writing can change a product in hours, not weeks. By tightening the
            structure, making sections easy to scan, and designing CTAs with intent, the site shifted from
            overloaded to clear and action-focused.
          </p>
          <ul className="cs-steps cs-mt-m">
            {[["Structure & scanability.", "Sections should be easy to grasp at a glance."],
              ["Specific CTAs.", "Buttons like “Book now” reduce hesitation and guide users down the main path."],
              ["Small, surgical edits.", "Tweaks to headings, card sizes, and microcopy can have a big impact."],
              ["Spec-first workflow.", "Clear before → after docs speed up implementation even without CMS access."]].map(([b, t]) => (
              <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { BachataCase });
