/* core.jsx – data, motion hooks, chrome (Logo, Nav, Footer, Cursor, GridBackdrop) */
const { useState, useEffect, useRef, useCallback } = React;

/* ----------------------------- DATA ----------------------------- */
// All localizable content (PROFILE / CASES / CERTS / LEGAL / SOCIALS / NAV /
// DISCIPLINES / UI / IMG) now lives in i18n.jsx, which is loaded BEFORE this
// file and selects the active language from window.__LANG.

// ⚠️ Paste your real Formspree form ID here (from your live alexmedved.com form).
// It looks like "xkabcdef" – replace REPLACE_ME and the contact form goes live.
const FORMSPREE = "https://formspree.io/f/xovwzoed";

/* ---------------------- CONTACT FORM (shared) ----------------------
   Validation params ported 1:1 from the live alexmedved.com form:
   - message hard-capped at 3500 chars with a live counter
   - light email-format guard (blocks random/garbage addresses) that
     surfaces the localized error and refuses to POST until it's valid
   - submit button stays disabled until every field has content
   The exact same hook backs the homepage form and the case-study modal,
   so the behaviour is identical on every page and in every language. */
const CONTACT_MAX = 3500;
const CONTACT_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function useContactForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | ok | error
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [tried, setTried] = useState(false);
  const emailRef = useRef(null);

  const emailValid = CONTACT_EMAIL_RE.test(email.trim());
  // After the first submit attempt we keep the error in sync while the user fixes it.
  const showEmailErr = tried && !emailValid;
  const atMax = message.length >= CONTACT_MAX;
  // Button unlocks once ALL fields have something (email format not required yet).
  const canSend =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    message.length > 0 &&
    message.length <= CONTACT_MAX &&
    status !== "sending";

  const onName = (e) => setName(e.target.value);
  const onEmail = (e) => setEmail(e.target.value);
  const onMessage = (e) => setMessage(e.target.value.slice(0, CONTACT_MAX));

  const reset = () => {
    setStatus("idle"); setName(""); setEmail(""); setMessage(""); setTried(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setTried(true);
    if (!CONTACT_EMAIL_RE.test(email.trim())) {
      // Block the Formspree POST and point the user at the email field.
      emailRef.current && emailRef.current.focus();
      return;
    }
    const form = e.target;
    setStatus("sending");
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("ok");
        setName(""); setEmail(""); setMessage(""); setTried(false);
      } else setStatus("error");
    } catch (_) { setStatus("error"); }
  };

  return {
    status, name, email, message, emailRef,
    showEmailErr, atMax, canSend, MAX: CONTACT_MAX,
    onName, onEmail, onMessage, submit, reset,
  };
}

/* ----------------------------- HOOKS ----------------------------- */
// reveal-on-scroll: re-scan whenever `dep` changes (direction switch remounts)
function useReveal(dep) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal:not(.rin)"));
    const vh = window.innerHeight || 800;
    // above-the-fold elements reveal immediately (no waiting on observer)
    const pending = [];
    els.forEach((e) => {
      const top = e.getBoundingClientRect().top;
      if (top < vh * 0.92) e.classList.add("rin");
      else pending.push(e);
    });
    if (!("IntersectionObserver" in window)) { return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("rin"); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    pending.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [dep]);
}

// anim-ready: only enable the hidden→reveal transition once a REAL animation
// frame fires. In a non-painting context (snapshot capture, throttled tab) rAF
// never runs, the class is never added, and content stays visible by default.
function useAnimReady(enabled) {
  useEffect(() => {
    const root = document.querySelector(".app");
    if (!root) return;
    if (!enabled) { root.classList.remove("anim-ready"); return; }
    let raf1 = 0, raf2 = 0;
    // two nested frames guarantees a paint cycle actually happened
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => { root.classList.add("anim-ready"); });
    });
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
  }, [enabled]);
}

// parallax: translate [data-parallax] by speed on scroll + slight mouse drift
function useParallax(enabled, dep) {
  useEffect(() => {
    if (!enabled) return;
    let raf = 0, mx = 0, my = 0;
    const run = () => {
      raf = 0;
      const vh = window.innerHeight;
      document.querySelectorAll("[data-parallax]").forEach((el) => {
        const sp = parseFloat(el.getAttribute("data-parallax")) || 0;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2 - vh / 2;
        const y = center * sp * -0.12;
        const dx = mx * sp * 8, dy = my * sp * 8;
        el.style.transform = `translate3d(${dx}px, ${y + dy}px, 0)`;
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(run); };
    const onMove = (e) => { mx = (e.clientX / window.innerWidth - 0.5); my = (e.clientY / window.innerHeight - 0.5); if (!raf) raf = requestAnimationFrame(run); };
    run();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("mousemove", onMove); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [enabled, dep]);
}

// custom cursor – style: "off"|"ring"|"dot"|"crosshair"|"scope"|"reticle"|"halo"|"comet".
// Brand-coloured via --cursor-color (the green set in styles.css); an optional 2nd
// arg overrides it. Builds its own DOM layer so it works on any page regardless of
// the static markup, and reads clearly on both light and dark palettes.
const CURSOR_HOT = "a,button,input,textarea,select,[data-hot],.case,.workrow,.cert,.btn,.theme-toggle";
function useCursor(style, color) {
  useEffect(() => {
    // retire the legacy static nodes if a page still ships them
    ["cursorDot", "cursorRing"].forEach((id) => {
      const el = document.getElementById(id); if (el) el.style.display = "none";
    });
    if (color) document.body.style.setProperty("--cursor-color", color);

    const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (!style || style === "off" || coarse) {
      document.body.classList.remove("has-cursor");
      document.body.removeAttribute("data-cursor");
      return;
    }
    document.body.classList.add("has-cursor");
    document.body.setAttribute("data-cursor", style);

    const layer = document.createElement("div");
    layer.className = "cfx"; layer.dataset.style = style; layer.setAttribute("aria-hidden", "true");
    const node = (innerCls, html) => {
      const n = document.createElement("div"); n.className = "cfx-node";
      const inner = document.createElement("div"); inner.className = innerCls;
      if (html) inner.innerHTML = html; n.appendChild(inner); return n;
    };

    let lead = null, trail = null, reticle = null; const comet = [];
    if (style === "ring") {
      trail = node("cfx-ring"); lead = node("cfx-dot"); layer.append(trail, lead);
    } else if (style === "dot") {
      lead = node("cfx-dot"); layer.append(lead);
    } else if (style === "crosshair") {
      lead = node("cfx-cross", '<i class="l"></i><i class="r"></i><i class="t"></i><i class="b"></i><span class="cx-c"></span>');
      layer.append(lead);
    } else if (style === "scope") {
      trail = node("cfx-scope", '<i class="t"></i><i class="r"></i><i class="b"></i><i class="l"></i><span class="sc-c"></span>');
      layer.append(trail);
    } else if (style === "reticle") {
      trail = node("cfx-reticle", '<i class="tl"></i><i class="tr"></i><i class="br"></i><i class="bl"></i>');
      reticle = trail.firstChild; layer.append(trail);
    } else if (style === "halo") {
      trail = node("cfx-halo"); lead = node("cfx-dot small"); layer.append(trail, lead);
    } else if (style === "comet") {
      for (let i = 0; i < 7; i++) {
        const c = node("cfx-comet"); c.style.setProperty("--i", i); comet.push(c); layer.append(c);
      }
    }
    document.body.appendChild(layer);

    let px = innerWidth / 2, py = innerHeight / 2, tx = px, ty = py, raf = 0;
    let hot = false, hotRect = null, shown = false;
    const hist = [];
    const place = (n, x, y) => { n.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`; };

    const loop = () => {
      if (lead) place(lead, px, py);
      let gx = px, gy = py;
      if (style === "reticle" && hot && hotRect) { gx = hotRect.cx; gy = hotRect.cy; }
      const k = style === "reticle" ? 0.3 : 0.2;
      tx += (gx - tx) * k; ty += (gy - ty) * k;
      if (trail) place(trail, tx, ty);
      if (comet.length) {
        hist.unshift({ x: px, y: py });
        if (hist.length > comet.length) hist.pop();
        for (let i = 0; i < comet.length; i++) {
          const p = hist[Math.min(i, hist.length - 1)] || { x: px, y: py };
          place(comet[i], p.x, p.y);
        }
      }
      raf = requestAnimationFrame(loop);
    };

    const move = (e) => {
      px = e.clientX; py = e.clientY;
      if (!shown) { shown = true; layer.style.opacity = "1"; }
      // place the exact-tracking nodes synchronously so the primary cursor
      // never waits on rAF (which is paused in non-painting/throttled contexts)
      if (lead) place(lead, px, py);
      if (comet.length) place(comet[0], px, py);
      const target = e.target.closest(CURSOR_HOT);
      const nowHot = !!target;
      if (nowHot !== hot) { hot = nowHot; layer.classList.toggle("is-hot", hot); }
      if (style === "reticle") {
        if (target) {
          const r = target.getBoundingClientRect();
          hotRect = { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
          reticle.style.width = (r.width + 12) + "px";
          reticle.style.height = (r.height + 12) + "px";
        } else {
          hotRect = null; reticle.style.width = ""; reticle.style.height = "";
        }
      }
    };
    const down = () => layer.classList.add("is-down");
    const up = () => layer.classList.remove("is-down");

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down); window.addEventListener("mouseup", up);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      layer.remove();
      document.body.classList.remove("has-cursor");
      document.body.removeAttribute("data-cursor");
    };
  }, [style, color]);
}

// sticky-nav shadow on scroll
function useStuck() {
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return stuck;
}

/* ----------------------------- SMALL UI ----------------------------- */
function MonoLabel({ children, className = "" }) {
  return <span className={"mono eyebrow " + className}>{children}</span>;
}

function Reveal({ as = "div", d, className = "", children, ...rest }) {
  const Tag = as;
  return <Tag className={"reveal " + className} data-d={d} {...rest}>{children}</Tag>;
}

function GridBackdrop() { return <div className="grid-backdrop" aria-hidden="true"></div>; }

function maskStyle(uri) {
  const v = "url(\"" + (uri || "") + "\")";
  return { WebkitMaskImage: v, maskImage: v };
}

function Logo({ onDark }) {
  const I = (typeof window !== "undefined" && window.ICONS) || {};
  return (
    <a href="#top" className="row" data-hot style={{ gap: ".62rem" }} aria-label="Aleksandr Medved – home">
      <span className="sm-mark" aria-hidden="true">
        <span className="sm-mark-layer sm-mark-ink" style={maskStyle(I.logoInk)}></span>
        <span className="sm-mark-layer sm-mark-accent" style={maskStyle(I.logoAccent)}></span>
      </span>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, letterSpacing: "-.02em" }}>Aleksandr Medved</span>
        <span className="mono-sm" style={{ color: "var(--ink-faint)", marginTop: 3 }}>Product Designer <span style={{ color: "var(--accent)" }}>//</span> Smellfigty</span>
      </span>
    </a>
  );
}

/* social link with brand glyph (mask-tinted, accent on hover) */
function SocialLink({ s, showLabel = true, className = "" }) {
  const I = (typeof window !== "undefined" && window.ICONS) || {};
  return (
    <a className={"social " + className} href={s.url} target="_blank" rel="noopener" data-hot>
      <span className="soc-ico" style={maskStyle(I[s.iconKey])} aria-hidden="true"></span>
      {showLabel && <span>{s.label}</span>}
    </a>
  );
}

/* ----------------------------- NAV ----------------------------- */
function ThemeToggle({ theme, onToggle }) {
  const dark = theme === "dark";
  return (
    <button className="theme-toggle" data-hot onClick={onToggle} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} title={dark ? "Light theme" : "Dark theme"}>
      {dark ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      )}
    </button>
  );
}

/* language switcher – links come from UI.langLinks (built per-language in i18n) */
function LangSwitch({ style }) {
  return (
    <span className="lang" aria-label="Language" style={style}>
      {UI.langLinks.map((l) => (
        <a key={l.label} className={l.active ? "active" : ""} href={l.href} data-hot
          {...(/^https?:/.test(l.href) ? { target: "_blank", rel: "noopener" } : {})}>{l.label}</a>
      ))}
    </span>
  );
}

function Nav({ theme, onToggleTheme }) {
  const stuck = useStuck();
  const [open, setOpen] = useState(false);
  return (
    <header className={"nav" + (stuck ? " stuck" : "")}>
      <div className="wrap-wide nav-inner">
        <Logo />
        <nav className="nav-links desktop">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="nav-link" data-hot>{n.label}</a>
          ))}
          <LangSwitch />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <a href="#contact" className="btn" data-hot style={{ padding: ".7em 1.1em" }}>{UI.navGetInTouch}</a>
        </nav>
        <span className="nav-toggle">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button className="btn" data-hot onClick={() => setOpen((v) => !v)} style={{ padding: ".55em .9em" }} aria-label="Menu">
            {open ? UI.navClose : UI.navMenu}
          </button>
        </span>
      </div>
      {open && (
        <div className="wrap-wide" style={{ paddingBottom: "1.2rem", display: "flex", flexDirection: "column", gap: ".4rem" }}>
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="nav-link" data-hot onClick={() => setOpen(false)} style={{ fontSize: "1.1rem", padding: ".4rem 0" }}>{n.label}</a>
          ))}
          <LangSwitch style={{ marginTop: ".4rem" }} />
        </div>
      )}
    </header>
  );
}

/* ----------------------------- FOOTER ----------------------------- */
function Footer() {
  return (
    <footer className="footer" id="imprint">
      <div className="wrap-wide" style={{ display: "flex", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div className="stack" style={{ gap: ".8rem" }}>
          <Logo />
          <p className="mono-sm" style={{ color: "var(--ink-faint)", maxWidth: 360, lineHeight: 1.6 }}>
            {UI.footerTagline}
          </p>
          <a className="footer-mail" href="mailto:alex@alexmedved.com" data-hot>
            alex<span className="footer-mail-at">@</span>alexmedved.com
          </a>
        </div>
        <div className="stack" style={{ gap: ".5rem", alignItems: "flex-start" }}>
          <a className="mono-sm" href="#impressum" data-hot style={{ color: "var(--ink-soft)" }}>{UI.footerImprint}</a>
          <a className="mono-sm" href="#privacy" data-hot style={{ color: "var(--ink-soft)" }}>{UI.footerPrivacy}</a>
          <span className="mono-sm" style={{ color: "var(--ink-faint)", marginTop: ".6rem" }}>{UI.footerCopyright}</span>
        </div>
      </div>
    </footer>
  );
}

/* export */
Object.assign(window, {
  useReveal, useParallax, useCursor, useStuck, useAnimReady, useContactForm,
  MonoLabel, Reveal, GridBackdrop, Logo, Nav, Footer, SocialLink, ThemeToggle, LangSwitch,
});
