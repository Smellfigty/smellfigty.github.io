/* gaming-content.jsx – English edition of the B2B mobile gaming platform case study.
   Exports <GamingCase/>. Same components & structure as gaming-content.de.jsx,
   English copy preserved (and lightly repackaged) from the original alexmedved.com page.
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
    // fallback: in a non-painting tab rAF may never fire – snap to final value
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
    const t = setTimeout(() => { setRun(true); cleanup(); }, 2500); // safety: never stay at 0
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
    <Reveal className="gm-cycle" role="list" aria-label="Design thinking loop" style={{ justifyContent: "center" }}>
      {CYCLE.map((s, i) => (
        <React.Fragment key={s}>
          <span className="gm-cycle-step" role="listitem">
            <span className="gm-cycle-n">{String(i + 1).padStart(2, "0")}</span>{s}
          </span>
          {i < CYCLE.length - 1 && <span className="gm-cycle-arr" aria-hidden="true">→</span>}
        </React.Fragment>
      ))}
      <span className="gm-cycle-loop" aria-hidden="true" title="Repeat until resolved">↻</span>
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
                <Reveal><MonoLabel>Case Study · 03 – B2B Mobile Gaming</MonoLabel></Reveal>
                <Reveal as="span" className="mono-sm gm-nda" style={{ color: "var(--ink-faint)" }}>2024 · NDA</Reveal>
              </div>
              <Reveal as="h1" className="cs-title">A gaming platform,<br /><span className="accent">built from scratch.</span></Reveal>
              <Reveal as="p" className="cs-sub">A blank page means a fresh start</Reveal>
              <Reveal as="p" className="cs-lead">
                A brand name, a mascot, and a loose concept – that was the whole brief. Everything else, from the
                Tone of Voice to the working product, had to be built from zero. NeoGroup trusted me and the team
                to bring it to life with UX baked in from the very first decision.
              </Reveal>
              <Reveal as="p" className="cs-cap gm-nda-note">
                Under NDA, I can't show real in-work visuals – but there's enough here to follow my
                contributions, the process, and how I approach an open-ended design challenge.
              </Reveal>
            </div>
            <Reveal>
              <Fig src={GIMG + "B2B-Platform-UI.png"} alt="Semi-lo-fi platform UI wireframe"
                caption="A semi-lo-fi UI wireframe used to validate layout, spacing, and component behavior before the full hi-fi prototype." />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Animated stat band */}
      <section className="cs-section gm-stats-sec">
        <div className="cs-wrap">
          <Reveal className="cs-head">
            <h2 className="cs-h">By the Numbers</h2>
            <span className="mono-sm" style={{ color: "var(--ink-faint)" }}>What the work moved</span>
          </Reveal>
          <div className="gm-statband">
            <Stat pre="~" to={4} suf=" mo" label="To MVP1 – shipped on schedule" />
            <Stat to={3} label="Launch locales · EN / DE / RU" />
            <Stat from={20} to={17} label="ToV pages → quick-ref slides" />
            <Stat text={<><span className="dim">days</span><span className="arr">→</span><span className="accent">hrs</span></>}
              label="Localization turnaround" />
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
              <div className="cs-meta-v">UX Designer &amp; Writer · Tone of Voice owner · Localization lead (EN → DE/RU)</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Timeline</div>
              <div className="cs-meta-v">MVP1 in ~4 months → ongoing feature work</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Markets</div>
              <div className="cs-meta-v">EU focus (DE, ES, IT, FR) + CIS</div>
            </div>
          </Reveal>

          <Reveal className="cs-chips cs-mt-m" style={{ justifyContent: "center" }}>
            {["Tone of Voice", "Registration & Onboarding", "Payments", "Loyalty & Cashback", "Referrals",
              "Achievements", "Seasonal Events", "Localization Pipeline"].map((c) => (
              <span className="tag" key={c}>{c}</span>
            ))}
          </Reveal>

          <div className="cs-grid2 cs-mt-l" style={{ alignItems: "stretch" }}>
            <Reveal className="cs-panel" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h4>Team &amp; Collaboration</h4>
              <p className="cs-p">
                Worked alongside the Head of UX, <span className="accent">2</span> UX researchers,{" "}
                <span className="accent">2</span> designers, a platform coordinator, and{" "}
                <span className="accent">3</span> developers.
              </p>
              <p className="cs-p">
                Served on the <strong>3-person UX review board</strong>, mentored{" "}
                <strong>4 junior colleagues</strong>, and aligned with Legal/Compliance and country managers.
              </p>
            </Reveal>
            <Reveal className="cs-panel cs-panel-accent">
              <h4>My Highlights</h4>
              <ul className="cs-steps">
                {["Defined a Tone of Voice that became the company standard across locales",
                  "Launched MVP1 on schedule in EN/DE/RU with polished core flows",
                  "Shipped engagement features – Achievements, Referrals – that lifted retention",
                  "Cut localization turnaround from days to hours with a scalable workflow"].map((t) => (
                  <li className="cs-li" key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal className="gm-tools cs-mt-m">
            <span className="gm-tools-k">Tools</span>
            <span className="gm-tools-v">Figma · Miro · Jira · Notion · Trello · internal localization microservices · GPT-4 / 3.5 for ideation</span>
          </Reveal>
        </div>
      </section>

      {/* Starting point */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-grid2">
            <div>
              <div className="cs-head"><h3 className="cs-h">Starting Point</h3></div>
              <p className="cs-p">
                The first phase was about answers: what the brand should stand for, what experience to create,
                and how to talk to the audience authentically. The real challenge wasn't producing assets – it
                was asking the right questions, testing approaches, and shaping a clear plan to guide design,
                content, and product decisions for the months ahead.
              </p>
              <h4 className="gm-subh">Top Priorities</h4>
              <p className="cs-p">
                Clarify the brand's role, explore directions, and build a foundation that balanced
                authenticity, compliance, and user engagement – setting the stage for everything that followed.
              </p>
            </div>
            <Reveal className="cs-panel">
              <h4>Core Objectives</h4>
              <ul className="cs-steps">
                {[["Drive registrations.", "Make signing up the obvious, low-friction next step."],
                  ["Encourage first deposits.", "Guide new users to value quickly and confidently."],
                  ["Stay compliant.", "Meet target-market regulations across Germany, Spain, Italy, France…"]].map(([b, t]) => (
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
          <div className="cs-head"><h3 className="cs-h">Iterative Testing &amp; Improvement</h3></div>
          <p className="cs-p" >
            In the first testing phase I mapped and analyzed user journeys in detail. That surfaced what was
            hurting UX – flow inconsistencies, technical bugs, and UI choices that were less intuitive than we
            wanted. We worked through them with a structured design-thinking cycle, repeating it until issues
            were resolved and the product stayed aligned with real user needs.
          </p>
          <CycleStrip />
          <p className="cs-p cs-mt-m" >
            Thanks to this pipeline, the team delivered a <span className="accent">high-quality, ready-to-launch
            product</span> in record time – without compromising on UX or accessibility.
          </p>
          <Reveal className="cs-mt-l">
            <Fig src={GIMG + "Screenshot-Figma.png"} alt="Recreated early project stages in Figma"
              caption="A recreation of the early stages: storyframes, first Tone of Voice definition, and lo-fi prototypes with draft copy. Built as an illustrative example, since internal files are under contract."
              capAccent="Early stages →" />
          </Reveal>
        </div>
      </section>

      {/* Tone of Voice */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-grid2" style={{ alignItems: "center" }}>
            <Reveal>
              <Fig src={GIMG + "Screenshot-Figma2.png"} alt="Recreation of the ToV definition phase"
                caption="A recreation of the first define phase, where we laid the Tone of Voice foundation – the reference point for every later design and content decision." />
            </Reveal>
            <div>
              <div className="cs-head"><h3 className="cs-h">Tone of Voice</h3></div>
              <p className="gm-quote">Clarity above <span className="accent">stylistic indulgence.</span></p>
              <p className="cs-p cs-mt-s">
                I defined the brand's voice early – always inclusive, approachable, and user-first. The full ToV
                document ran <span className="accent">over 20 pages</span>, covering basics, rules, examples,
                punctuation, even “Oxford comma: yes or no?”. Knowing nobody reads that cover to cover, I
                distilled it into a <span className="accent">17-slide</span> quick reference for the whole company.
              </p>
              <p className="cs-p">
                Under my supervision it was localized and adapted per market with country managers and
                translators, keeping consistency and cultural relevance for every user.
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
              <div className="cs-head"><h3 className="cs-h">MVP1 – And Beyond</h3></div>
              <p className="cs-p">
                For MVP1 I owned the core flows: registration, onboarding, payments, early promos, and
                localization into English, German, and Russian. It launched on schedule and met every
                regulatory requirement.
              </p>
              <p className="cs-p">
                After launch the work didn't stop. As one of three decision-makers on the UX review board,
                every new feature had to pass our review before development. In parallel I owned or contributed
                to major flows – <strong>Loyalty Program, Referral Program, Achievements, Advent Calendar</strong>,
                and a few still-unannounced features – each going through research → prototyping → testing → refinement.
              </p>
              <p className="cs-p">
                I kept the product evolving in a way that felt
                <span className="accent"> natural and user-friendly</span> – an experience built to
                convert and retain players while staying intuitive.
              </p>
            </div>
            <Reveal>
              <Fig src={GIMG + "Important-Lo-Fi.png"} alt="Recreated lo-fi wireframes – mobile leaderboards and web flows"
                caption="Recreated lo-fi wireframes: experimental mobile leaderboards and instructional web-flow prototypes." />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Impact</h3></div>
          <p className="cs-p" >
            This was a cross-disciplinary effort – a chance to take on new roles and shape the platform's
            design, content, and product decisions, influencing both how players experienced the service and
            how the brand spoke to them. The key results:
          </p>
          <div className="cs-grid2 cs-mt-m">
            <ul className="cs-steps">
              {[["Boosted engagement & retention.", "Features like Achievements drove clear gains in registrations, first deposits, and weekly retention."],
                ["Defined the brand's voice.", "The ToV became a company-wide standard across product, marketing, and support – giving the brand a human, trustworthy personality."],
                ["Accelerated localization.", "A scalable content pipeline cut localization for new features from days to hours, with no drop in quality or compliance."]].map(([b, t]) => (
                <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
              ))}
            </ul>
            <ul className="cs-steps">
              {[["Cross-team alignment.", "Worked at the intersection of UX, design, and compliance so features met experience, business, and regulatory checks."],
                ["Team development.", "Trained and guided 4 junior colleagues, introduced review practices, and turned content into a strategic product asset."],
                ["Implemented key flows.", "Co-led decisions on loyalty, referrals, and seasonal promotions – making content and UX integral to product strategy."]].map(([b, t]) => (
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
            Building this platform was a crash course in shipping both a product and a brand from the ground up.
            It pushed me from a UX designer into a strategic partner across design, compliance, and growth.
          </p>
          <ul className="cs-steps cs-mt-m">
            {[["Balance creativity and requirements.", "Make communication playful while still meeting strict regulation and business needs – solutions that work for everyone."],
              ["Scale a unified voice.", "Writing ToV guidelines is one thing; making them hold across countries and languages without losing their essence is another."],
              ["Think like a product owner.", "The review board taught me to decide as a strategist – weighing user needs, business goals, and technical feasibility."],
              ["Lead through content.", "Mentoring writers and working across teams showed me content leadership shapes processes, features, and even culture."]].map(([b, t]) => (
              <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { GamingCase });
