/* casestudy-migroplan-content.jsx – MigroPlan case study article.
   Exports <MigroCase/>. Depends on core.jsx + casestudy-shared.jsx.
   Visuals are live embeds of the production page (migro-live/) – no screenshots. */

/* ---- live-site screenshot in a browser-chrome frame; click to zoom,
   chrome link opens the real production page ---- */
function LiveShot({ src, caption, alt = "MigroPlan live page", href = "https://migroplan.com/", fit, pos }) {
  const open = useLightbox();
  return (
    <figure className={"mg-live" + (fit ? " mg-live--fit" : "")}>
      <div className="mg-live-shell">
        <div className="mg-live-chrome">
          <span className="mg-live-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span className="mg-live-url">migroplan.com</span>
          <a className="mg-live-open" href={href} target="_blank" rel="noopener noreferrer" data-hot>
            <span className="mg-live-pulse" aria-hidden="true"></span>live · open ↗
          </a>
        </div>
        <button type="button" className="mg-live-shot" data-hot
          onClick={() => open({ src, alt, caption })}
          aria-label={"Expand image: " + alt}>
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

/* ---- mobile screenshot in a phone bezel; click to zoom ---- */
function MobileShot({ src, caption, alt = "MigroPlan on mobile" }) {
  const open = useLightbox();
  return (
    <figure className="mg-phone">
      <div className="mg-phone-frame">
        <button type="button" className="mg-phone-shot" data-hot
          onClick={() => open({ src, alt, caption })}
          aria-label={"Expand image: " + alt}>
          <img src={src} alt={alt} loading="lazy" />
        </button>
      </div>
      {caption && <figcaption className="cs-cap">{caption}</figcaption>}
    </figure>
  );
}

/* ---- animated stat ---- */
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

/* ---- Mini inline wireframe primitives ---- */
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

/* Five funnel direction cards */
const FUNNEL_DIRS = [
  {
    id: "A",
    title: "Test-first",
    pin: "Main hook = assess your chances first, buy later",
    layout: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 10px 8px" }}>
        <WireBar w="65%" h={8} accent />
        <WireBar w="80%" h={5} />
        <WireBar w="55%" h={5} />
        <WireBox style={{ padding: "7px 8px", marginTop: 4, border: "1px solid color-mix(in oklab, var(--accent) 50%, var(--line-2))" }}>
          <WireLabel>[ TAKE THE TEST – 2 MIN ]</WireLabel>
          <WireBar w="90%" h={14} accent style={{ marginTop: 5, borderRadius: 2 }} />
          <WireBar w="55%" h={8} style={{ marginTop: 3 }} />
        </WireBox>
        <WireBar w="35%" h={7} style={{ marginTop: 3 }} />
        <WireBar w="100%" h={1} style={{ marginTop: 6, marginBottom: 6 }} />
        <WireLabel>→ How it works → Pricing</WireLabel>
      </div>
    ),
  },
  {
    id: "B",
    title: "Shop-first",
    pin: "Configurator as hero – buy on screen 1",
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
          <WireLabel>CONFIGURE</WireLabel>
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
    title: "3 Cards",
    pin: "Classic pricing cards – center card highlighted",
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
    title: "Expert / Editorial",
    pin: "Trust-first narrative – product after the warm-up",
    layout: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 10px 8px" }}>
        <WireBar w="95%" h={7} accent />
        <WireBar w="85%" h={7} />
        <WireBar w="60%" h={7} />
        <WireBar w="100%" h={40} style={{ marginTop: 4, borderRadius: 3, background: "var(--line)" }} />
        <WireLabel style={{ marginTop: 4 }}>EXPERT PORTRAIT + BIO</WireLabel>
        <WireBar w="100%" h={1} style={{ marginTop: 5, marginBottom: 4 }} />
        <WireLabel>→ How it works → Testimonials → Pricing (late)</WireLabel>
      </div>
    ),
  },
  {
    id: "E",
    title: "Sticky Cart",
    pin: "Scroll content left, sticky configurator right",
    layout: () => (
      <div style={{ display: "flex", gap: 6, padding: "10px 10px 8px" }}>
        <div style={{ flex: "1.5", display: "flex", flexDirection: "column", gap: 4 }}>
          <WireBar w="95%" h={7} accent />
          <WireBar w="75%" h={5} />
          <WireBar w="55%" h={5} />
          <WireBar w="100%" h={1} style={{ margin: "5px 0" }} />
          <WireLabel>Step 1 ↓ Step 2 ↓ Step 3 ↓</WireLabel>
          <WireBar w="100%" h={24} style={{ marginTop: 2 }} />
          <WireBar w="80%" h={24} />
        </div>
        <div style={{ flex: 1 }}>
          <WireBox style={{ padding: "6px 7px", border: "1px solid color-mix(in oklab, var(--accent) 50%, var(--line-2))" }}>
            <WireLabel>STICKY CART</WireLabel>
            <WireBar w="100%" h={6} style={{ marginTop: 4 }} />
            <WireBar w="100%" h={6} />
            <WireBar w="70%" h={5} style={{ marginTop: 5 }} />
            <WireBar w="100%" h={11} accent style={{ marginTop: 4, borderRadius: 2 }} />
          </WireBox>
          <WireLabel style={{ marginTop: 5 }}>→ follows scroll</WireLabel>
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
          {chosen && <span className="tag tag-accent" style={{ fontSize: ".64rem", marginTop: ".3rem", display: "inline-block" }}>Final direction</span>}
        </div>
      </div>
      <div className="mg-fdir-wire">
        <dir.layout />
      </div>
      <div className="mg-fdir-pin">{dir.pin}</div>
    </Reveal>
  );
}

/* ---- quiz step storyboard ---- */
const QUIZ_STEPS = [
  { n: "Start", q: "Is the visa right for you?", note: "4 questions · no signup · ~2 min", cta: "Start →" },
  { n: "Q1", q: "How old are you?", opts: ["Under 45", "45 or older"] },
  { n: "Q2", q: "What do you do?", opts: ["Freelance – IT, design, teaching…", "Small business – agency, school…"] },
  { n: "Q3", q: "What is your monthly income?", opts: ["Under €1,500", "€1,500–2,000", "Over €2,000"] },
  { n: "Q4", q: "Do you have clients in Germany?", opts: ["Yes, I do", "Not at the moment"] },
  { n: "Result", q: "Excellent chances!", note: "Book a free consultation to learn more", cta: "Book now →", result: true },
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

/* ---- main article ---- */
function MigroCase() {
  return (
    <div className="cs-view">

      {/* ── Hero ── */}
      <section className="cs-section cs-hero">
        <div className="cs-wrap">
          <div className="cs-kicker">
            <Reveal><MonoLabel>Case Study · 02 – MigroPlan</MonoLabel></Reveal>
            <Reveal as="span" className="mono-sm" style={{ color: "var(--ink-faint)" }}>2025 · 1.5 days · Client project</Reveal>
          </div>
          <div className="ax-hero-grid">
            <Reveal className="ax-hero-text">
              <h1 className="cs-title">Visa help for freelancers.<br /><span className="accent">Live in 36 hours.</span></h1>
              <p className="cs-sub">Funnel architecture, an express visa test and Cal.eu booking for MigroPlan – built mobile-first and shipped in a day and a half</p>
              <p className="cs-lead">
                MigroPlan helps freelancers prepare a strong case for Germany's self-employment visa.
                The service already existed and ran through Telegram – it needed a web presence, fast.
                I came in with a design concept, used Claude to explore five funnel directions,
                agreed on priorities with the client and polished the page stage by stage.
                The site went live in under 36 hours.
              </p>
              <div className="ax-skip-wrap" style={{ display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
                <a href="https://migroplan.com/" target="_blank" rel="noopener noreferrer" className="btn btn-accent ax-skip-btn" data-hot>
                  See it live
                  <span className="btn-arrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </span>
                </a>
                <a href="#funnel" className="btn ax-skip-btn" data-hot>
                  Skip to the process
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
                src="live-shots/hero.png"
                alt="MigroPlan landing page – hero"
                caption={<><strong>The production page, English build.</strong> Click to enlarge, or open migroplan.com to see it live.</>}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="cs-section gm-stats-sec">
        <div className="cs-wrap">
          <div className="gm-statband mg-statband">
            <MigroStat pre="<" to={36} suf="h" label="From brief to live" />
            <MigroStat to={5} label="Funnel directions explored" />
            <MigroStat to={3} label="Quiz outcome paths" />
            <MigroStat to={2} label="Languages at launch (RU / EN)" />
          </div>
        </div>
      </section>

      {/* ── Nutshell ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h2 className="cs-h">Project in a Nutshell</h2></div>
          <Reveal className="cs-meta">
            <div className="cs-meta-cell">
              <div className="cs-meta-k">My role</div>
              <div className="cs-meta-v">UX concept, funnel architecture, UI design, RU/EN microcopy and tech integrations – end to end</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Timeline</div>
              <div className="cs-meta-v">1.5 days from first wireframe to production deploy</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Stack & tools</div>
              <div className="cs-meta-v">Vanilla HTML / CSS / JS, mobile-first, Cal.eu booking, custom quiz engine, RU/EN i18n, Claude for ideation</div>
            </div>
          </Reveal>
          <Reveal className="cs-chips cs-mt-m" style={{ justifyContent: "center" }}>
            {["Funnel Design", "Landing Page UX", "Bilingual UI (RU/EN)", "Conversion Architecture", "Cal.eu Integration", "Interactive Quiz", "AI-Assisted Sprint"].map((c) => (
              <span className="tag" key={c}>{c}</span>
            ))}
          </Reveal>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel">
              <h4>What I shipped</h4>
              <MPlain items={[
                "Full funnel landing – Russian and English in a single build",
                "Native mobile layout drawn in the same pass as desktop",
                "Express visa-chances test – 4 questions, instant result, tailored CTA",
                "Cal.eu booking for free and paid consultations",
                "Pricing with package comparison, plus FAQ and SEO article in both languages",
              ]} />
            </Reveal>
            <Reveal className="cs-panel cs-panel-accent">
              <h4>Outcome</h4>
              <MPlain items={[
                "Live in under 36 hours from the first wireframe",
                "RU / EN switch with no reload and no layout shifts",
                "Wrong-fit leads redirected by the quiz before the calendar",
                "Booking takes 2 clicks: CTA → Cal.eu embed",
                "Priorities and positioning confirmed with the client before any code",
              ]} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Context & Brief ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Context & the Brief</h3></div>
          <div className="cs-grid2 ax-equal">
            <Reveal>
              <h4 className="gm-subh" style={{ marginTop: 0 }}>The Service</h4>
              <p className="cs-p">
                The German Freiberufler visa is one of the most realistic routes for IT specialists, designers,
                teachers and translators from third countries to legally live and work in Germany. The application
                stands or falls on paperwork – a business plan, a financial forecast and a document package in the
                exact shape the authorities expect. That preparation is what the client sells.
              </p>
              <p className="cs-p">
                The service already worked – real clients, real approvals – but it ran entirely through Telegram and
                word of mouth, with nothing to show a new lead who wanted to check it out first. The brief: a landing
                that explains the offer, earns enough trust to book a call, and honestly turns away people the visa
                doesn't fit – with no room for a multi-week process.
              </p>
            </Reveal>
            <Reveal className="ax-hero-media mg-ctx-media">
              <LiveShot
                src="live-shots/funnel-entry.png"
                pos="top center"
                alt="MigroPlan – who the visa is for, and the 4-step process"
                caption={<><strong>The audience, named on the page.</strong> "Who it's for" lists the professions the visa fits, then "How it works" lays out the four-step path – the spine the whole brief had to serve.</>}
              />
            </Reveal>
          </div>

          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="ax-success ax-success-compact" style={{ margin: 0 }}>
              <div className="ax-sub5" style={{ marginBottom: ".7rem" }}>What the client wanted to prioritise</div>
              <div className="ax-questions ax-questions-tight">
                <p className="ax-q">"Consultation booking – <span className="accent">get them on a call.</span>"</p>
                <p className="ax-q">"Show the <span className="accent">combo package</span> as the default option."</p>
                <p className="ax-q">"Filter out people who <span className="accent">aren't a good fit</span> early."</p>
              </div>
              <p className="ax-success-note">
                We went through these priorities on a call before I touched the layout. That conversation picked
                the funnel direction and saved at least one full iteration.
              </p>
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Working Title → Final Name</h4>
              <p className="cs-p">
                The project started as <strong>Freiberufler·Weg</strong> – an accurate German label, and a mouthful
                half the audience would stumble over. <strong>MigroPlan</strong> won because it passes the checks
                that matter here:
              </p>
              <div className="cs-mt-m">
                <MKL items={[
                  ["Reads the same in Russian and English", "– no transliteration weirdness either way."],
                  ["Says what it does", "– migration plus a plan, no explanation needed."],
                  ["Short enough", "for a logo, a domain and a Telegram handle."],
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
          <div className="cs-head"><h3 className="cs-h">Funnel Architecture: Five Directions</h3></div>
          <p className="cs-p">
            Before any production code, I sketched five structurally different funnels – each one a different bet
            on where the visitor's attention should land first and how soon they should see a price.
            Every direction got a lo-fi wireframe and a one-line hypothesis.
          </p>
          <p className="cs-p" style={{ marginTop: ".9rem" }}>
            This pass took one evening with Claude instead of the usual several days, and it's where AI helped
            the most. By the time I got on the call with the client, I had all five mapped, a clear favourite,
            and the reasoning ready.
          </p>

          <div className="mg-fdirs cs-mt-l">
            {FUNNEL_DIRS.map((d) => (
              <FunnelDirCard key={d.id} dir={d} chosen={d.id === "A"} />
            ))}
          </div>

          <Reveal className="cs-panel cs-panel-accent cs-mt-l">
            <h4>Why Direction A won</h4>
            <p className="cs-p" style={{ marginTop: ".6rem" }}>
              The client's top priority was filtering leads before they hit the calendar, and direction A
              puts that filter front and centre: the test is the hero, the product sits one decision lower.
              Visitors the visa doesn't fit get an honest answer and a different next step before they ever
              see the pricing. The ones who do fit arrive at the booking already knowing their chances –
              the calls start warmer and run shorter.
            </p>
            <p className="cs-p" style={{ marginTop: ".8rem" }}>
              B and E would suit a shop with repeat purchases; C is the safe default for a service business;
              D needs an expert with an established personal brand. For a new name in a domain where the
              audience needs education before commitment, A was the right call.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Funnel in production ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Down the Funnel, in Production</h3></div>
          <p className="cs-p">
            Direction A on a real page. The wireframe promised a funnel that qualifies before it sells –
            here is how each stage looks in the shipped build, and what each one is quietly doing to the visitor
            as they move down it.
          </p>

          <div className="mg-stageflow cs-mt-l">
            <div className="mg-stage">
              <span className="mg-stage-n">01 · Land</span>
              <span className="mg-stage-t">One promise</span>
              <span className="mg-stage-d">The hero makes a single offer: a strong freelance-visa case for Germany.</span>
            </div>
            <div className="mg-stage">
              <span className="mg-stage-n">02 · Target</span>
              <span className="mg-stage-t">Who it's for</span>
              <span className="mg-stage-d">Names the professions that fit. Everyone else self-selects out.</span>
            </div>
            <div className="mg-stage mg-stage--gate">
              <span className="mg-stage-n">03 · Qualify</span>
              <span className="mg-stage-t">Express test</span>
              <span className="mg-stage-d">Four questions sort strong, edge and wrong-fit before the calendar.</span>
            </div>
            <div className="mg-stage">
              <span className="mg-stage-n">04 · Convert</span>
              <span className="mg-stage-t">Pricing</span>
              <span className="mg-stage-d">Combo package as the default; à-la-carte documents around it.</span>
            </div>
            <div className="mg-stage">
              <span className="mg-stage-n">05 · Book</span>
              <span className="mg-stage-t">Consultation</span>
              <span className="mg-stage-d">Two call types, both two clicks from a Cal.eu slot.</span>
            </div>
          </div>

          <div className="cs-grid2 ax-equal cs-mt-l" style={{ alignItems: "center" }}>
            <Reveal className="cs-order-2">
              <h4 className="gm-subh" style={{ marginTop: 0 }}>Convert on the client's terms</h4>
              <p className="cs-p">
                The client asked for one thing above all: make the combo package the obvious choice. It carries
                the only "best value" sticker and the only red button; the three à-la-carte documents around it
                frame the combo as the complete, considered option rather than the expensive one.
              </p>
              <p className="cs-p" style={{ marginTop: ".8rem" }}>
                The quiet <strong>"I'm not sure what I need"</strong> button underneath catches anyone still
                hesitating and routes them back to a consultation instead of letting them bounce.
              </p>
            </Reveal>
            <Reveal className="cs-order-1">
              <LiveShot
                src="live-shots/funnel-pricing.png"
                alt="MigroPlan – pricing packages"
                caption={<><strong>Stage 04 – convert.</strong> The combo package carries the only accent button; the others set its value.</>}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Express Test ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">The Express Test</h3></div>
          <p className="cs-p">
            The visa-chances quiz is the first CTA on the page and the funnel's main qualification step.
            It had to feel like a quick self-check, something you'd do out of curiosity: four questions,
            no signup, a result with a concrete recommendation in under two minutes.
          </p>

          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal>
              <h4 className="gm-subh" style={{ marginTop: 0 }}>Design Decisions</h4>
              <MKL items={[
                ["4 questions only.", "Age, type of work, income level, German clients – the minimum needed to route someone to one of three outcomes. Every extra question costs completions."],
                ["Three result paths.", "Strong profile → free 15-minute consultation. Non-standard case → paid deep-dive. Wrong visa type or income below the bar → an honest redirect with a different next step. Nobody hits a dead end."],
                ["No registration.", "Contact details come up later, after the visitor has already received something useful."],
                ["A modal, not a separate page.", "The quiz opens over the landing and closes back into the same scroll position, so nobody loses their place."],
              ]} />
            </Reveal>
            <Reveal>
              <h4 className="gm-subh" style={{ marginTop: 0 }}>Outcome Routing</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: ".7rem", marginTop: ".3rem" }}>
                <div className="cs-panel" style={{ padding: "1rem 1.2rem" }}>
                  <div className="ax-sub5" style={{ marginBottom: ".4rem", color: "var(--accent)" }}>Excellent chances</div>
                  <p className="cs-p" style={{ fontSize: ".94rem" }}>
                    Freelance profession + income ≥ €1,500 + German client. CTA: free 15-min consultation → Cal.eu.
                  </p>
                </div>
                <div className="cs-panel" style={{ padding: "1rem 1.2rem" }}>
                  <div className="ax-sub5" style={{ marginBottom: ".4rem" }}>Moderate chances</div>
                  <p className="cs-p" style={{ fontSize: ".94rem" }}>
                    Good profile, non-standard case – no German client yet, or edge income. CTA: paid 60-min deep-dive → Cal.eu.
                  </p>
                </div>
                <div className="cs-panel" style={{ padding: "1rem 1.2rem" }}>
                  <div className="ax-sub5" style={{ marginBottom: ".4rem" }}>Different visa / too early</div>
                  <p className="cs-p" style={{ fontSize: ".94rem" }}>
                    Small business rather than freelance, or income below the threshold. An honest redirect that saves both sides a call.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal className="cs-mt-l">
            <h4 className="gm-subh" style={{ marginTop: 0 }}>Quiz Flow Storyboard</h4>
          </Reveal>
          <div className="mg-qboard cs-mt-m">
            {QUIZ_STEPS.map((s, i) => <QuizFrame key={i} step={s} />)}
          </div>

          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal>
              <LiveShot
                src="live-shots/quiz-q1.png"
                alt="MigroPlan eligibility quiz – first question"
                caption={<><strong>Question 1 of 4.</strong> The test opens as a modal over the landing – a progress bar, one question at a time, no signup. Closes back into the same scroll position.</>}
              />
            </Reveal>
            <Reveal>
              <LiveShot
                src="live-shots/quiz-result.png"
                alt="MigroPlan eligibility quiz – result screen"
                caption={<><strong>The result.</strong> A scored profile drives the gauge and the CTA – here, a strong 8/8 routes straight to a free 15-minute consultation.</>}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Booking / Cal.eu ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">From CTA to a Booked Slot</h3></div>
          <p className="cs-p">
            Every CTA on the page – the test result, the pricing cards, the consultation block – routes to the same
            place: a Cal.eu slot. Two entry points on the page, one booking sheet behind them.
          </p>

          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal>
              <LiveShot
                fit
                src="live-shots/consultation.png"
                alt="MigroPlan – consultation options"
                caption={<><strong>On the page.</strong> A free 15-minute express assessment and a paid 60-minute case review – two separate offers.</>}
              />
            </Reveal>
            <Reveal>
              <LiveShot
                fit
                src="live-shots/cal-eu.png"
                alt="MigroPlan – Cal.eu booking sheet"
                href="https://migroplan.com/"
                caption={<><strong>What opens.</strong> The Cal.eu sheet, branded MigroPlan, with live availability in the Europe/Berlin timezone.</>}
              />
            </Reveal>
          </div>
          <p className="mg-paircap">↑ Each on-page entry point routes to its own Cal.eu event type, so bookings arrive pre-labelled</p>

          <Reveal className="cs-panel cs-mt-l">
            <h4>Why Cal.eu</h4>
            <div className="cs-mt-m">
              <MKL items={[
                ["EU-hosted on purpose.", "Booking runs on Cal.eu – Cal.com's EU-hosted instance – so scheduling data for a service about moving to Germany stays inside the EU. A small detail that fits the audience."],
                ["Two event types, pre-labelled.", "A free 15-minute intro and a paid 60-minute review sit behind separate links, so every booking lands tagged with which call it is."],
                ["Two clicks to a slot.", "From any CTA on the page, and the FAQ states in plain words that the paid call is credited toward the combo package."],
              ]} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Mobile-first ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Built for the Phone First</h3></div>
          <p className="cs-p">
            Most people researching a visa do it on their phone, in spare minutes between other things – so the
            mobile layout was never an afterthought. Desktop and mobile were drawn in the same pass, and the whole
            UI was built to <strong>reflow dynamically</strong> rather than snap to a handful of fixed widths.
          </p>

          <div className="mg-phones cs-mt-l">
            <MobileShot
              src="live-shots/mobile-hero.png"
              alt="MigroPlan mobile – hero"
              caption={<><strong>Hero, stacked.</strong> The German-flag note moves above the headline; the CTA goes full-width and thumb-reachable.</>}
            />
            <MobileShot
              src="live-shots/mobile-steps.png"
              alt="MigroPlan mobile – how it works"
              caption={<><strong>"How it works", vertical.</strong> The four-step rail rotates to a single column with the connector running down the left.</>}
            />
          </div>

          <Reveal className="cs-panel cs-panel-accent cs-mt-l">
            <h4>Fixed in the open</h4>
            <p className="cs-p" style={{ marginTop: ".6rem" }}>
              After launch I ran a dedicated bug-fix pass on real devices, not the simulator. One catch:
              the full <span className="mg-tgchip">Telegram</span> button overflowed the header on screens
              below a certain width and broke the layout.
            </p>
            <p className="cs-p" style={{ marginTop: ".8rem" }}>
              The fix was to drop the label on mobile and keep just the paper-plane icon – more than enough on a
              phone, where the Telegram glyph reads instantly – so the header holds together down to the smallest
              screens. You can spot the icon-only button in the shots above.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── AI-Assisted Sprint ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">What the AI-Assisted Sprint Actually Looked Like</h3></div>
          <p className="cs-p">
            This project doubled as a field test of Claude in a real client delivery – with a hard deadline,
            an opinionated client and money on the line. Roughly hour by hour:
          </p>
          <ol className="ax-steps cs-mt-l">
            {[
              ["Funnel ideation · hours 0–4.", "I described the service, the audience and my design concept to Claude and worked through structurally different funnel options. We ended up with five, each with its own hypothesis about what the visitor sees first. I had a favourite by the end of the evening."],
              ["Client sync · hour 5.", "Half an hour on a call. We confirmed which services to push, set the combo package as the default offer, and agreed the test should filter leads before the calendar. Coming in with five mapped directions made this conversation short and concrete."],
              ["Copy · hours 6–18.", "All section copy drafted and reworked with the positioning locked. Russian and English were written as two separate passes – the English version is not a translation, it has its own rhythm and slightly different emphasis."],
              ["Build & polish · hours 18–30.", "Layout, the quiz routing, the i18n layer, mobile breakpoints. Each round of my feedback went straight into the next pass, which is where the compressed timeline really comes from – no waiting between iterations."],
              ["Ship · hours 30–36.", "Domain, deploy, a last copy pass in both languages, Cal.eu event types connected. Live by the second evening."],
            ].map(([b, t], i) => (
              <li className="ax-step" key={i}>
                <span className="ax-step-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="ax-step-t"><strong>{b}</strong> {t}</span>
              </li>
            ))}
          </ol>

          <Reveal className="cs-panel cs-panel-accent cs-mt-l">
            <h4>On working with Claude</h4>
            <p className="cs-p" style={{ marginTop: ".6rem" }}>
              For me the win was pace. More directions on the table in the first hours, copy passes that run
              in minutes, layout experiments I could judge on screen instead of imagining. I still made every
              final call and threw away a good share of what came back – but the distance between an idea and
              something I could evaluate collapsed, and that's what made 36 hours enough.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Tech stack ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Technical Highlights</h3></div>
          <div className="ax-dsys">
            <Reveal className="cs-panel">
              <h4>Two languages, one build</h4>
              <MKL items={[
                ["One HTML file", "carries both full language versions, switched client-side through an i18n key map."],
                ["Rich strings live separately,", "so the inline red keyword accents survive the language switch intact."],
                ["No German on purpose.", "Someone who already lives in German doesn't need a freelancer visa. Russian covers the CIS audience, English covers the rest of the world."],
              ]} />
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Quiz engine</h4>
              <MKL items={[
                ["Custom vanilla JS,", "no dependencies – four questions, three result paths, one modal."],
                ["Branching logic", "routes on work type, income and German client presence; a scored profile drives the final gauge."],
                ["Result CTAs", "link to Cal.eu event types matched to the outcome."],
              ]} />
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Cal.eu booking</h4>
              <MKL items={[
                ["EU-hosted (Cal.eu)", "– Cal.com's European instance, so booking data for a Germany-bound audience stays inside the EU."],
                ["Separate event types", "for the free 15-minute and paid 60-minute consultations – bookings arrive pre-labelled."],
                ["Two clicks to a slot", "from any CTA, and the paid call is credited toward the combo package."],
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
            A few things from this sprint that I'm keeping for the next one:
          </p>
          <ul className="cs-steps cs-mt-m">
            {[
              ["Come to the client call with a recommendation.", "Five mapped directions and a favourite turned what could have been a two-hour discovery session into thirty decisive minutes. Forming a hypothesis first and validating it together beats starting from a blank page in the room."],
              ["An honest 'no' builds more trust than a soft 'maybe'.", "The quiz tells a small-business owner outright that this visa won't work for them and points elsewhere. That answer costs a lead and earns a reputation."],
              ["Test the name in every language before committing.", "Freiberufler·Weg died the moment I imagined a Russian speaker typing it into a search bar. A name that only works in one language quietly limits everything built on top of it."],
              ["A key map beats a framework at this scale.", "For a single bilingual landing, a few lines of vanilla JS handled what an i18n library would – with no build step and nothing to explain at handoff."],
              ["Design the phone layout in the same pass, not after.", "Because mobile and desktop were drawn together, the post-launch fixes were small – a button label here, a breakpoint there – not a second redesign once real phones got hold of it."],
              ["A hard deadline is a good editor.", "Every section had to justify itself within 36 hours, so the page shipped without a single 'nice to have'. The constraint made the product tighter, and the quality didn't move."],
            ].map(([b, t], i) => <li className="cs-li" key={i}><strong>{b}</strong> {t}</li>)}
          </ul>
        </div>
      </section>

    </div>
  );
}

Object.assign(window, { MigroCase });
