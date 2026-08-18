/* heroes.jsx – final homepage direction (Mash-up flagship) */

/* ---------- Hero anchor backdrops (Tweak-controlled) ---------- */
function HeroBackdrop({ kind }) {
  if (!kind || kind === "none") return null;
  if (kind === "grid") {
    return <div className="hero-anchor hero-anchor-grid" aria-hidden="true"></div>;
  }
  if (kind === "dots") {
    return <div className="hero-anchor hero-anchor-dots" aria-hidden="true" data-parallax="0.22"></div>;
  }
  if (kind === "halftone") {
    return <div className="hero-anchor hero-anchor-halftone" aria-hidden="true" data-parallax="0.18"></div>;
  }
  if (kind === "scatter") {
    return (
      <div className="hero-anchor hero-anchor-scatter" aria-hidden="true" data-parallax="0.3">
        <span className="has-axis-x"></span>
        <span className="has-axis-y"></span>
        <span className="has-points"></span>
      </div>
    );
  }
  if (kind === "monogram") {
    return <div className="hero-anchor hero-anchor-monogram" aria-hidden="true" data-parallax="0.5">AM</div>;
  }
  if (kind === "frame") {
    return (
      <div className="hero-anchor hero-anchor-frame" aria-hidden="true">
        <span className="haf-cross haf-tl"></span>
        <span className="haf-cross haf-tr"></span>
        <span className="haf-cross haf-bl"></span>
        <span className="haf-cross haf-br"></span>
        <span className="mono-sm haf-label haf-label-tl">48.137°N · 11.575°E</span>
        <span className="mono-sm haf-label haf-label-br">MUC · Product Design</span>
      </div>
    );
  }
  return null;
}

function CTAs({ accent = true }) {
  return (
    <div className="row" style={{ gap: ".7rem", flexWrap: "wrap" }}>
      <a href="#work" className={"btn " + (accent ? "btn-accent" : "")} data-hot>
        {UI.ctaWork}
        <span className="btn-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
      </a>
      <a href="#about" className="btn" data-hot>{UI.ctaAbout}</a>
    </div>
  );
}

function HeroMeta({ className = "", compact = false }) {
  return (
    <div className={"hero-meta " + className}>
      <span className="mono-sm">{compact ? PROFILE.location.split(",")[0] : PROFILE.location}</span>
      <span className="meta-sep" aria-hidden="true"></span>
      <span className="mono-sm">DE <span style={{color:"var(--accent)"}}>/ </span>EN <span style={{color:"var(--accent)"}}>/ </span>RU</span>
      <span className="meta-sep" aria-hidden="true"></span>
      <span className="mono-sm">{compact ? UI.heroMetaExpShort : UI.heroMetaExp}</span>
    </div>
  );
}

/* Flagship horizontal feature card for the bento */
function FlagshipCard({ c }) {
  const Wrapper = c.soon ? "div" : "a";
  const extra = c.soon ? {} : { href: c.url, target: c.url.startsWith("http") ? "_blank" : undefined, rel: "noopener" };
  return (
    <Wrapper className="case case-flag" data-hot {...extra}>
      <div className="case-flag-media"><CaseMedia c={c} /></div>
      {!c.soon && <CaseGo />}
      <div className="case-body" style={{ justifyContent: "center", gap: "1rem" }}>
        <div className="row" style={{ justifyContent: "space-between", gap: "1rem" }}>
          <span className="case-index" style={{ color: "var(--accent)" }}>{UI.flagshipLabel} · {c.type}</span>
          <span className="case-index">{c.year}</span>
        </div>
        <div className="stack" style={{ gap: ".35rem" }}>
          <h3 className="case-title" style={{ fontSize: "clamp(1.6rem,2.6vw,2.6rem)" }}>{c.title}</h3>
          <span className="mono-sm" style={{ color: "var(--ink-faint)" }}>{c.kicker}</span>
        </div>
        <p className="case-desc" style={{ fontSize: "1rem", maxWidth: "46ch" }}>{c.desc}</p>
        <div className="case-tags" style={{ marginTop: 0 }}>{c.tags.map((t, i) => <span key={t} className={"tag" + (i === 0 ? " tag-accent" : "")}>{t}</span>)}</div>
      </div>
    </Wrapper>
  );
}

function MashupWork() {
  return (
    <div className="case-bento">
      {CASES.map((c, i) => (
        <Reveal key={c.id} as="div" d={String((i % 3) + 1)} className="case-wrap"><CaseCardInner c={c} /></Reveal>
      ))}
    </div>
  );
}

function DirMashup({ heroAnchor = "none" }) {
  return (
    <React.Fragment>
      <section className="section" id="top" style={{ paddingTop: "calc(4rem*var(--d))", paddingBottom: "0", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" data-parallax="1.1" style={{ position: "absolute", top: "-16%", right: "-6%", width: "44vw", height: "44vw", borderRadius: "999px", background: "radial-gradient(circle, color-mix(in oklab, var(--accent) 50%, transparent), transparent 64%)", filter: "blur(22px)", opacity: .32, zIndex: 0 }}></div>
        {heroAnchor !== "frame" && <HeroBackdrop kind={heroAnchor} />}

        <div className="wrap-wide" style={{ position: "relative" }}>
          {heroAnchor === "frame" && <HeroBackdrop kind="frame" />}
          <div className="mashup-hero" style={{ display: "grid", gridTemplateColumns: "1.45fr .92fr", gap: "clamp(2rem,4.5vw,4.5rem)", alignItems: "center" }}>
            {/* LEFT – statement headline */}
            <div className="stack" style={{ gap: "1.7rem" }}>
              <HeroMeta className="hero-meta-desktop" />
              <h1 className="display reveal mashup-h1" style={{ fontSize: "clamp(3rem, 8.4vw, 7.2rem)", lineHeight: ".92", letterSpacing: "-.035em" }}>
                <span className="line-mask"><span>{UI.heroH1Line1}</span></span>
                <span className="line-mask"><span>{UI.heroH1Line2Pre}<span style={{ color: "var(--accent)" }}>{UI.heroH1Accent}</span></span></span>
              </h1>
              <Reveal as="p" className="lead" d="3">
                {UI.heroLeadPre}<strong style={{ color: "var(--ink)" }}>{UI.heroLeadStrong}</strong>{UI.heroLeadPost}
              </Reveal>
              <Reveal d="4">
                <CTAs />
              </Reveal>
            </div>

            {/* RIGHT – portrait */}
            <Reveal d="2" className="mashup-portrait" style={{ position: "relative" }}>
              <div className="photo-frame" style={{ aspectRatio: "4/5" }} data-parallax="0.4">
                <img src={PROFILE.photo} alt="Aleksandr Medved" />
                <span className="photo-tint"></span>
              </div>
              <div className="hero-mobile-meta">
                <HeroMeta className="hero-meta-mobile" compact />
              </div>
            </Reveal>
          </div>
        </div>

        {/* Statement marquee */}
        <div style={{ marginTop: "clamp(2.2rem,5vw,3.6rem)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", paddingBlock: "clamp(.9rem,2vw,1.5rem)" }}>
          <Marquee />
        </div>
      </section>

      <section className="section" id="work">
        <div className="wrap-wide">
          <div className="section-head">
            <Reveal><MonoLabel>{UI.secCaseStudies}</MonoLabel></Reveal>
          </div>
          {/* Asymmetric bento – flagship leads, rest in rhythm */}
          <MashupWork />
        </div>
      </section>
    </React.Fragment>
  );
}

Object.assign(window, { DirMashup, CTAs, HeroBackdrop });
