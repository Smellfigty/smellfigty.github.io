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
    pin: "Main hook: assess your fit first, decide later",
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
    pin: "Configurator as the hero: buy on screen one",
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
    title: "Three cards",
    pin: "Classic pricing layout with the middle package highlighted",
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
    pin: "Trust-first narrative: expert profile, service explanation, pricing later",
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
    title: "Sticky cart",
    pin: "Long-form content on the left, sticky configurator on the right",
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
    <Reveal className={"mg-fdir" + (chosen ? " mg-fdir--chosen" : " mg-fdir--rejected")} data-stamp={chosen ? undefined : "Not chosen"}>
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

/* ---- main article ---- */
function MigroCase() {
  return (
    <div className="cs-view">

      {/* ── Hero ── */}
      <section className="cs-section cs-hero">
        <div className="cs-wrap">
          <div className="cs-kicker">
            <Reveal><MonoLabel>Case Study · MigroPlan</MonoLabel></Reveal>
            <Reveal as="span" className="mono-sm" style={{ color: "var(--ink-faint)" }}>· 2026 · 1.5 days · Client project</Reveal>
          </div>
          <div className="ax-hero-grid">
            <Reveal className="ax-hero-text">
              <h1 className="cs-title">Freelance visa support.<br /><span className="accent">Live in 36 hours.</span></h1>
              <p className="cs-sub">A mobile-first landing page for MigroPlan, built around a clear funnel, eligibility quiz and Cal.eu booking flow.</p>
              <p className="cs-lead">
                MigroPlan supports freelancers preparing an application for Germany’s self-employment visa. Before the project, the service lived mainly in Telegram, so the goal was to create a clear web entry point: explain the offer, qualify visitors and guide serious leads towards a consultation.
              </p>
              <p className="cs-lead">
                I mapped the funnel, structured the page, shaped the core UX copy, designed the mobile-first interface and connected the booking flow. AI-assisted exploration helped compare several directions quickly, but the final page was refined around the client’s priorities and the practical needs of the service.
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
                  <span className="btn-arrow btn-arrow--down">
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
                caption={<><strong>The final hero section.</strong> Since it carried the first decision point of the landing funnel, much of the research and iteration focused on finding the right angle.</>}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="cs-section gm-stats-sec">
        <div className="cs-wrap">
          <div className="gm-statband mg-statband">
            <MigroStat pre="<" to={36} suf="h" label="FROM BRIEF TO LAUNCH" />
            <MigroStat to={5} label="FUNNEL CONCEPTS COMPARED" />
            <MigroStat to={3} label="QUIZ PATHS DESIGNED" />
            <MigroStat to={2} label="BOOKING FLOWS CONNECTED" />
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
              <div className="cs-meta-v">Funnel strategy, landing UX, UI design, bilingual copy and implementation support</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Timeline</div>
              <div className="cs-meta-v">1.5 days from wireframe to launch</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Stack & tools</div>
              <div className="cs-meta-v">HTML / CSS / JS, Cal.eu, custom eligibility quiz, RU/EN i18n, Claude-assisted build and concept exploration</div>
            </div>
          </Reveal>
          <Reveal className="cs-chips cs-mt-m" style={{ justifyContent: "center" }}>
            {["Funnel Design", "Landing UX", "Bilingual UI (RU/EN)", "Conversion Architecture", "Cal.eu Integration", "Eligibility Quiz", "AI-Assisted Sprint"].map((c) => (
              <span className="tag" key={c}>{c}</span>
            ))}
          </Reveal>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel">
              <h4>What I shipped</h4>
              <MPlain items={[
                "A bilingual landing funnel in Russian and English, built as a single responsive page",
                "Mobile-first layouts designed alongside the desktop version",
                "A 4-question eligibility quiz with instant results and tailored CTAs",
                "Cal.eu booking flows for free and paid consultations",
                "Pricing, package comparison, FAQ and SEO content in both languages",
              ]} />
            </Reveal>
            <Reveal className="cs-panel cs-panel-accent">
              <h4>Outcome</h4>
              <MPlain items={[
                "A Telegram-based service became a clear web entry point",
                "Visitors could understand the offer before contacting the client",
                "The quiz separated serious leads from low-fit requests",
                "Booking moved from manual messaging to a structured Cal.eu flow",
                "The full RU/EN landing experience went live in under 36 hours",
              ]} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Context & Brief ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Context & the Brief</h3></div>
          <div className="cs-grid2 mg-ctx-grid">
            <div className="mg-ctx-col">
              <Reveal>
                <h4 className="gm-subh" style={{ marginTop: 0 }}>The UX problem</h4>
                <p className="cs-p">
                  MigroPlan sells preparation for Germany's self-employment visa: business plan, financial forecast,
                  document structure and step-by-step guidance before the applicant talks to the authorities. The
                  service is not a generic visa blog, and not a law firm either. The page had to make that distinction
                  clear fast.
                </p>
                <p className="cs-p">
                  The main challenge was trust and fit. Visitors needed to understand whether the service applied to
                  their profession, what they would actually get, and whether it made sense to book a consultation at
                  all. At the same time, the client did not want every curious visitor in the calendar. The funnel had
                  to explain, qualify and convert without turning the page into an encyclopedia.
                </p>
              </Reveal>
              <Reveal className="ax-success ax-success-compact">
                <div className="ax-sub5" style={{ marginBottom: ".7rem" }}>What the client wanted to prioritise</div>
                <div className="ax-questions ax-questions-tight">
                  <p className="ax-q">"Consultation booking – <span className="accent">get them on a call.</span>"</p>
                  <p className="ax-q">"Show the <span className="accent">combo package</span> as the default option."</p>
                  <p className="ax-q">"Filter out people who <span className="accent">aren't a good fit</span> early."</p>
                </div>
                <p className="ax-success-note">
                  We aligned these priorities before touching the layout. That call shaped the funnel direction:
                  lead with audience fit, explain the service path, qualify through the quiz, then move serious
                  leads towards booking.
                </p>
              </Reveal>
            </div>
            <div className="mg-ctx-col">
              <Reveal className="ax-hero-media mg-ctx-media">
                <LiveShot
                  src="live-shots/funnel-entry.png"
                  pos="top center"
                  alt="MigroPlan – who the visa is for, and the 4-step process"
                  caption={<>The audience and process sections became the spine of the page: first showing who the service is for, then explaining the four-step path.</>}
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Funnel Architecture ── */}
      <section className="cs-section" id="funnel">
        <span className="ax-anchor" aria-hidden="true"></span>
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Funnel Architecture: Five Directions</h3></div>
          <p className="cs-p">
            Before the build, I mapped five structurally different landing funnels. Each direction tested a different
            first decision: should visitors start with a quiz, see the offer first, compare packages, build trust
            through editorial content or configure a service path directly?
          </p>
          <p className="cs-p" style={{ marginTop: ".9rem" }}>
            Each concept got a lo-fi wireframe and a one-line hypothesis. With Claude in the workflow, this exploration
            took one evening instead of several days. Thus, I had all five directions mapped, a clear recommendation
            and the reasoning behind it.
          </p>

          <div className="mg-fdirs cs-mt-l" data-deselect="stamp">
            {FUNNEL_DIRS.map((d) => (
              <FunnelDirCard key={d.id} dir={d} chosen={d.id === "A"} />
            ))}
          </div>

          <Reveal className="cs-panel cs-panel-accent cs-mt-l">
            <h4>Why Direction A Won</h4>
            <p className="cs-p" style={{ marginTop: ".6rem" }}>
              The client's top priority was filtering leads before they reached the calendar. Direction A put
              that filter at the start of the funnel: the quiz became the hero, while packages and pricing
              moved one decision lower. Visitors who already knew what they needed still had a direct path
              to the offer, with clear packages, scope and pricing.
            </p>
            <p className="cs-p" style={{ marginTop: ".8rem" }}>
              This made the funnel work for both groups. Unsure visitors could check whether the service
              made sense for them before booking. Qualified users reached the calendar with a clearer
              understanding of their chances, while low-fit users received a more honest next step.
            </p>
            <p className="cs-p" style={{ marginTop: ".8rem" }}>
              B and E would fit a shop-like product with repeat purchases. C was the safe service-page
              default. D needed a stronger personal brand behind it. For a new service where users need
              trust and education before they commit, A was the right direction.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Turning the funnel into a page ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Turning the Chosen Funnel into a Page</h3></div>

          <div className="mg-stageflow cs-mt-l">
            <div className="mg-stage">
              <span className="mg-stage-n">01 · Land</span>
              <span className="mg-stage-t">One promise</span>
              <span className="mg-stage-d">Preparation for a stronger freelance-visa case in Germany.</span>
            </div>
            <div className="mg-stage">
              <span className="mg-stage-n">02 · Fit</span>
              <span className="mg-stage-t">Who it's for</span>
              <span className="mg-stage-d">Names the professions the service is built for, so visitors can see whether the offer applies to them.</span>
            </div>
            <div className="mg-stage">
              <span className="mg-stage-n">03 · Qualify</span>
              <span className="mg-stage-t">Eligibility quiz</span>
              <span className="mg-stage-d">A short quiz separates strong profiles, edge cases and low-fit requests — and routes each to the right next step.</span>
            </div>
            <div className="mg-stage">
              <span className="mg-stage-n">04 · Compare</span>
              <span className="mg-stage-t">Pricing</span>
              <span className="mg-stage-d">The combo package is the default option; alternative packages around it give a clear price and scope comparison.</span>
            </div>
            <div className="mg-stage">
              <span className="mg-stage-n">05 · Book</span>
              <span className="mg-stage-t">Consultation</span>
              <span className="mg-stage-d">Free and paid consultations route into separate Cal.eu event types, one or two clicks from the main CTAs.</span>
            </div>
          </div>

          {/* eligibility quiz */}
          <Reveal className="cs-mt-l">
            <h4 className="gm-subh" style={{ marginTop: 0 }}>The eligibility quiz</h4>
            <p className="cs-p">
              The quiz gives visitors a quick first answer before they book anything: does this look like the
              right visa path, and which next step makes sense? The result comes first; contact details only
              appear after the user has already received a useful recommendation.
            </p>
          </Reveal>
          <Reveal className="cs-panel cs-mt-m">
            <div className="ax-sub5" style={{ marginBottom: ".7rem" }}>Design logic</div>
            <MKL items={[
              ["4 questions only:", "age, work type, income and German clients."],
              ["3 result paths:", "strong profile, non-standard case or wrong visa path."],
              ["Value before contact:", "users see the result before any contact details are requested."],
              ["Modal flow:", "the quiz opens over the landing page and returns users to the same scroll position."],
            ]} />
          </Reveal>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal>
              <LiveShot
                src="live-shots/quiz-q1.png"
                alt="MigroPlan eligibility quiz – first question"
                caption={<>The quiz opens over the page: one question at a time, visible progress, no signup required.</>}
              />
            </Reveal>
            <Reveal>
              <LiveShot
                src="live-shots/quiz-result.png"
                alt="MigroPlan eligibility quiz – result"
                caption={<>The result leads straight to the next step: in this example, a strong profile routes to a free consultation.</>}
              />
            </Reveal>
          </div>

          {/* pricing and booking */}
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel cs-panel-accent">
              <h4>Pricing and booking</h4>
              <p className="cs-p" style={{ marginTop: ".6rem" }}>
                The pricing block supported the same funnel logic. The combo package carried the strongest
                visual weight, while individual documents around it made the full package feel complete rather
                than simply more expensive.
              </p>
              <p className="cs-p" style={{ marginTop: ".8rem" }}>
                From there, the booking path stayed short: quiz results, pricing cards and consultation CTAs all
                route to Cal.eu. Free 15-minute calls and paid 60-minute reviews use separate event types, so each
                booking arrives with the right context.
              </p>
            </Reveal>
            <Reveal>
              <LiveShot
                src="live-shots/funnel-pricing.png"
                alt="MigroPlan – pricing packages"
                caption={<>The combo package carries the strongest CTA; individual documents around it frame the value.</>}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Mobile-first ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Built Around Mobile</h3></div>
          <p className="cs-p">
            The client and I knew from the start that the page would most likely be opened on a phone: from a Telegram chat, a link, or a quick search. So the mobile layout became the main reference point, not a smaller version of the desktop page.
          </p>
          <p className="cs-p" style={{ marginTop: ".8rem" }}>
            That shaped the whole interface. Blocks stay narrow and easy to scan. Text is kept compact. Each section carries one clear idea instead of trying to fit too much into a small screen. The colour palette is also simple on purpose, so the red CTAs and key highlights stay visible without making the page feel busy.
          </p>
          <p className="cs-p" style={{ marginTop: ".8rem" }}>
            The integrations were checked with mobile use in mind as well. The quiz opens directly on the page, Cal.eu handles booking without extra friction, and the main Telegram contact button leads straight to the mobile app.
          </p>

          <div className="mg-phones cs-mt-l">
            <MobileShot
              src="live-shots/mobile-hero.png"
              alt="MigroPlan mobile – hero"
              caption={<>A compact first screen: short copy, one main CTA and a Telegram contact button that works naturally on mobile.</>}
            />
            <MobileShot
              src="live-shots/mobile-steps.png"
              alt="MigroPlan mobile – how it works"
              caption={<>The process becomes a narrow vertical flow: four steps in one column, easy to read on a small screen.</>}
            />
          </div>

          <Reveal className="cs-panel cs-panel-accent cs-mt-l">
            <h4>Post-launch mobile fix</h4>
            <p className="cs-p" style={{ marginTop: ".6rem" }}>
              After launch, I checked the page on real phones and found one layout issue in the header. On very narrow screens, the full <span className="mg-tgchip">Telegram</span> button took too much space and pushed the header out of alignment.
            </p>
            <p className="cs-p" style={{ marginTop: ".8rem" }}>
              I changed the mobile header to use the Telegram icon only. The button stayed recognisable, the link still opened Telegram directly, and the header now holds together on smaller screens. You can see the icon-only version in the mobile screenshots above.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── AI-Assisted Sprint ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">How I Used Claude During the Sprint</h3></div>
          <p className="cs-p">
            I used Claude throughout this 36-hour client sprint: first to explore possible directions, then to speed up copy, layout work and build iterations. The project still followed a normal client process: a fixed deadline, a clear business goal and a client who knew what the page needed to achieve.
          </p>
          <ol className="ax-steps cs-mt-l">
            {[
              ["Funnel ideation · hours 0–4.", "I gave Claude the service context, target audience and my initial design direction, then used it to map several possible landing funnels. By the end of the first evening, I had five options, each built around a different first decision for the visitor, and one direction I was ready to recommend."],
              ["Client sync · hour 5.", "We spent about thirty minutes on a call. We confirmed which services should get the most attention, set the combo package as the default offer and agreed that the test should filter people before they reached the calendar. Having five directions already mapped made the call short and concrete."],
              ["Copy · hours 6–18.", "Once the positioning was clear, I drafted and reworked the page copy section by section. Russian and English were written as separate passes, with their own rhythm and emphasis."],
              ["Build and polish · hours 18–30.", "I worked through the layout, quiz routing, i18n layer and mobile breakpoints in fast rounds. Each round of feedback went straight into the next version, which kept the timeline tight without long gaps between iterations."],
              ["Ship · hours 30–36.", "The final stretch covered the domain, deploy, last copy edits in both languages and Cal.eu event types. The page was live by the second evening."],
            ].map(([b, t], i) => (
              <li className="ax-step" key={i}>
                <span className="ax-step-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="ax-step-t"><strong>{b}</strong> {t}</span>
              </li>
            ))}
          </ol>


        </div>
      </section>

      {/* ── Tech stack ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Technical Highlights</h3></div>
          <div className="ax-dsys">
            <Reveal className="cs-panel">
              <h4>Single static build</h4>
              <MKL items={[
                ["The landing page runs as a single static HTML/CSS/JS build,", "with both RU and EN versions included in the same file."],
                ["Language switching happens client-side", "through a small i18n key map. Rich strings are stored separately, so inline keyword highlights stay intact when the language changes."],
                ["I kept the setup lightweight:", "no framework, no build step and nothing extra to maintain after handoff."],
              ]} />
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Custom quiz logic</h4>
              <MKL items={[
                ["The eligibility quiz is built in vanilla JS:", "four questions, three result paths and one modal."],
                ["The routing checks work type, income level and German client presence.", "A simple score drives the final gauge and decides which result screen the user sees."],
                ["Each result has its own CTA,", "linked to the matching Cal.eu event type."],
              ]} />
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Cal.eu booking</h4>
              <MKL items={[
                ["Booking runs through Cal.eu, Cal.com's EU-hosted instance.", "It was simple to integrate, lightweight enough for a static landing page and covered the project’s booking needs without extra overhead."],
                ["Free 15-minute calls and paid 60-minute reviews use separate event types,", "so bookings arrive with the right context from the start."],
                ["The main CTAs all lead to a slot in a few clicks,", "and the paid consultation is credited toward the combo package."],
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
            A few things I would repeat in the next sprint:
          </p>
          <ul className="cs-steps cs-mt-m">
            {[
              ["Come to the client call with a point of view.", "Having five funnel directions ready made the first client call much easier. We did not have to start from abstract questions; we could look at concrete options, discuss trade-offs and decide quickly which direction made the most sense."],
              ["Be clear when the service is not the right fit.", "The quiz does not try to keep every visitor in the funnel. If someone is closer to a small-business visa or does not meet the basic income threshold, the page says so and points them elsewhere. That makes the service more useful and saves both sides an unnecessary call."],
              ["Work through mobile details early.", "The mobile layout was part of the first design pass, so the fixes after launch were small: one button label, a few spacing issues, a breakpoint here and there. There was no need to rethink the page once it was tested on real phones."],
              ["Let the deadline cut the extras.", "With 36 hours from brief to launch, every section had to earn its place. The page shipped with the pieces the service actually needed: offer, fit, test, packages, booking and FAQ. The constraint helped keep the landing page focused."],
            ].map(([b, t], i) => <li className="cs-li" key={i}><strong>{b}</strong> {t}</li>)}
          </ul>
        </div>
      </section>

    </div>
  );
}

Object.assign(window, { MigroCase });
