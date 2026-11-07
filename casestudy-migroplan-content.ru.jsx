/* casestudy-migroplan-content.ru.jsx – Русская версия кейса MigroPlan.
   Та же структура и компоненты, что и в casestudy-migroplan-content.jsx, тексты на русском
   в тоне существующих RU-материалов проекта. Экспортирует <MigroCase/>.
   ВНИМАНИЕ: изображения временно указывают на EN-набор live-shots/ — заменить на RU-варианты. */

const MS = "../assets/";

/* ---- Живой скриншот в рамке браузера; клик увеличивает,
   ссылка в chrome открывает реальный продакшен ---- */
function LiveShot({ src, caption, alt = "MigroPlan, живая страница", href = "https://migroplan.com/", fit, pos }) {
  const open = useLightbox();
  return (
    <figure className={"mg-live" + (fit ? " mg-live--fit" : "")}>
      <div className="mg-live-shell">
        <div className="mg-live-chrome">
          <span className="mg-live-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span className="mg-live-url">migroplan.com</span>
          <a className="mg-live-open" href={href} target="_blank" rel="noopener noreferrer" data-hot>
            <span className="mg-live-pulse" aria-hidden="true"></span>live · открыть ↗
          </a>
        </div>
        <button type="button" className="mg-live-shot" data-hot
          onClick={() => open({ src, alt, caption })}
          aria-label={"Увеличить изображение: " + alt}>
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

/* ---- Мобильный скриншот в рамке телефона; клик увеличивает ---- */
function MobileShot({ src, caption, alt = "MigroPlan на смартфоне" }) {
  const open = useLightbox();
  return (
    <figure className="mg-phone">
      <div className="mg-phone-frame">
        <button type="button" className="mg-phone-shot" data-hot
          onClick={() => open({ src, alt, caption })}
          aria-label={"Увеличить изображение: " + alt}>
          <img src={src} alt={alt} loading="lazy" />
        </button>
      </div>
      {caption && <figcaption className="cs-cap">{caption}</figcaption>}
    </figure>
  );
}

/* ---- анимированная метрика ---- */
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

/* ---- мини-вайрфрейм примитивы ---- */
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

/* Пять карточек направлений воронки */
const FUNNEL_DIRS = [
  {
    id: "A",
    title: "Сначала тест",
    pin: "Главный хук: сначала проверить релевантность, потом выбрать пакет",
    layout: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 10px 8px" }}>
        <WireBar w="65%" h={8} accent />
        <WireBar w="80%" h={5} />
        <WireBar w="55%" h={5} />
        <WireBox style={{ padding: "7px 8px", marginTop: 4, border: "1px solid color-mix(in oklab, var(--accent) 50%, var(--line-2))" }}>
          <WireLabel>[ ПРОЙТИ ТЕСТ – 2 МИН. ]</WireLabel>
          <WireBar w="90%" h={14} accent style={{ marginTop: 5, borderRadius: 2 }} />
          <WireBar w="55%" h={8} style={{ marginTop: 3 }} />
        </WireBox>
        <WireBar w="35%" h={7} style={{ marginTop: 3 }} />
        <WireBar w="100%" h={1} style={{ marginTop: 6, marginBottom: 6 }} />
        <WireLabel>→ Как это работает → Тарифы</WireLabel>
      </div>
    ),
  },
  {
    id: "B",
    title: "Пакеты сразу",
    pin: "Конфигуратор в Hero: выбор пакета на первом экране",
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
          <WireLabel>НАСТРОИТЬ</WireLabel>
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
    title: "Три карточки",
    pin: "Классический блок тарифов с выделенным средним пакетом",
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
    title: "Экспертный формат",
    pin: "Сначала доверие: эксперт, объяснение сервиса, цены позже",
    layout: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 10px 8px" }}>
        <WireBar w="95%" h={7} accent />
        <WireBar w="85%" h={7} />
        <WireBar w="60%" h={7} />
        <WireBar w="100%" h={40} style={{ marginTop: 4, borderRadius: 3, background: "var(--line)" }} />
        <WireLabel style={{ marginTop: 4 }}>ПОРТРЕТ ЭКСПЕРТА + BIO</WireLabel>
        <WireBar w="100%" h={1} style={{ marginTop: 5, marginBottom: 4 }} />
        <WireLabel>→ Как это работает → Отзывы → Тарифы ниже</WireLabel>
      </div>
    ),
  },
  {
    id: "E",
    title: "Sticky cart",
    pin: "Длинный контент слева, закреплённый конфигуратор справа",
    layout: () => (
      <div style={{ display: "flex", gap: 6, padding: "10px 10px 8px" }}>
        <div style={{ flex: "1.5", display: "flex", flexDirection: "column", gap: 4 }}>
          <WireBar w="95%" h={7} accent />
          <WireBar w="75%" h={5} />
          <WireBar w="55%" h={5} />
          <WireBar w="100%" h={1} style={{ margin: "5px 0" }} />
          <WireLabel>Шаг 1 ↓ Шаг 2 ↓ Шаг 3 ↓</WireLabel>
          <WireBar w="100%" h={24} style={{ marginTop: 2 }} />
          <WireBar w="80%" h={24} />
        </div>
        <div style={{ flex: 1 }}>
          <WireBox style={{ padding: "6px 7px", border: "1px solid color-mix(in oklab, var(--accent) 50%, var(--line-2))" }}>
            <WireLabel>ЛИПКАЯ КОРЗИНА</WireLabel>
            <WireBar w="100%" h={6} style={{ marginTop: 4 }} />
            <WireBar w="100%" h={6} />
            <WireBar w="70%" h={5} style={{ marginTop: 5 }} />
            <WireBar w="100%" h={11} accent style={{ marginTop: 4, borderRadius: 2 }} />
          </WireBox>
          <WireLabel style={{ marginTop: 5 }}>→ следует за скроллом</WireLabel>
        </div>
      </div>
    ),
  },
];

function FunnelDirCard({ dir, chosen }) {
  return (
    <Reveal className={"mg-fdir" + (chosen ? " mg-fdir--chosen" : " mg-fdir--rejected")} data-stamp={chosen ? undefined : "Отклонено"}>
      <div className="mg-fdir-head">
        <span className="mg-fdir-id">{dir.id}</span>
        <div>
          <div className="mg-fdir-title">{dir.title}</div>
          {chosen && <span className="tag tag-accent" style={{ fontSize: ".64rem", marginTop: ".3rem", display: "inline-block" }}>Финальное направление</span>}
        </div>
      </div>
      <div className="mg-fdir-wire">
        <dir.layout />
      </div>
      <div className="mg-fdir-pin">{dir.pin}</div>
    </Reveal>
  );
}

/* ---- сториборд шагов теста ---- */
const QUIZ_STEPS = [
  { n: "Старт", q: "Подходит ли вам эта виза?", note: "4 вопроса · без регистрации · ~2 мин", cta: "Начать →" },
  { n: "В1", q: "Сколько вам лет?", opts: ["До 45", "45 и старше"] },
  { n: "В2", q: "Чем вы занимаетесь?", opts: ["Фриланс — IT, дизайн, преподавание…", "Малый бизнес — агентство, школа…"] },
  { n: "В3", q: "Какой у вас ежемесячный доход?", opts: ["До 1500 €", "1500–2000 €", "Больше 2000 €"] },
  { n: "В4", q: "Есть ли у вас клиенты в Германии?", opts: ["Да, есть", "Сейчас нет"] },
  { n: "Результат", q: "Отличные шансы!", note: "Запишитесь на бесплатную консультацию, чтобы узнать больше", cta: "Записаться →", result: true },
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

/* ---- основная статья ---- */
function MigroCase() {
  return (
    <div className="cs-view">

      {/* ── Hero ── */}
      <section className="cs-section cs-hero">
        <div className="cs-wrap">
          <div className="cs-kicker">
            <Reveal><MonoLabel>Кейс · MigroPlan</MonoLabel></Reveal>
            <Reveal as="span" className="mono-sm" style={{ color: "var(--ink-faint)" }}>· 2026 · 1,5 дня · клиентский проект</Reveal>
          </div>
          <div className="ax-hero-grid">
            <Reveal className="ax-hero-text">
              <h1 className="cs-title">Помощь с визой фрилансера.<br /><span className="accent">Запуск за 36 часов.</span></h1>
              <p className="cs-sub">Mobile-first лендинг для MigroPlan: с понятной воронкой, квизом первичной оценки и записью через Cal.eu в одном сценарии.</p>
              <p className="cs-lead">
                MigroPlan помогает фрилансерам подготовиться к подаче на визу для самозанятых в Германии. Ранее сервис в основном работал через Telegram, поэтому нужна была понятная точка входа в интернете, чтобы объяснить предложение, отсеять нерелевантные запросы и привести подходящих клиентов на консультацию.
              </p>
              <p className="cs-lead">
                Я выстроил воронку, собрал структуру страницы, доработал UX-тексты, спроектировал mobile-first интерфейс и подключил запись через сторонний сервис. Ресерч с помощью ИИ помог быстро сравнить несколько направлений, но финальная страница была доработана с учётом приоритетов клиента и практических задач сервиса.
              </p>
              <div className="ax-skip-wrap" style={{ display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
                <a href="https://migroplan.com/" target="_blank" rel="noopener noreferrer" className="btn btn-accent ax-skip-btn" data-hot>
                  Открыть сайт
                  <span className="btn-arrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </span>
                </a>
                <a href="#funnel" className="btn ax-skip-btn" data-hot>
                  Сразу к процессу
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
                src={MS + "Hero_Ru.png"}
                alt="MigroPlan — лендинг, hero"
                caption={<><strong>Финальная Hero Section.</strong> Это первая точка принятия решения в лендинговой воронке, поэтому большая часть ресерча и итераций ушла на поиск правильного угла подачи.</>}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="cs-section gm-stats-sec">
        <div className="cs-wrap">
          <div className="gm-statband mg-statband">
            <MigroStat pre="<" to={36} suf=" ч" label="ОТ БРИФА ДО ЗАПУСКА" />
            <MigroStat to={5} label="ВАРИАНТОВ ВОРОНКИ ПРОТЕСТИРОВАНО" />
            <MigroStat to={3} label="СЦЕНАРИЯ КВИЗА СПРОЕКТИРОВАНО" />
            <MigroStat to={2} label="ФЛОУ ЗАПИСИ ПОДКЛЮЧЕНО" />
          </div>
        </div>
      </section>

      {/* ── Nutshell ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h2 className="cs-h">Проект в двух словах</h2></div>
          <Reveal className="cs-meta">
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Моя роль</div>
              <div className="cs-meta-v">Стратегия воронки, UX лендинга, UI-дизайн, двуязычные UX-тексты и поддержка реализации</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Сроки</div>
              <div className="cs-meta-v">1,5 дня от первого wireframe до запуска</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Стек и инструменты</div>
              <div className="cs-meta-v">HTML/CSS/JS, Cal.eu, кастомный тест первичной оценки, RU/EN i18n, Claude (концепт + билд)</div>
            </div>
          </Reveal>
          <Reveal className="cs-chips cs-mt-m" style={{ justifyContent: "center" }}>
            {["Дизайн воронки", "Лендинг UX", "Двуязычный UI (RU/EN)", "Архитектура конверсии", "Интеграция Cal.eu", "Интерактивный тест", "AI-спринт"].map((c) => (
              <span className="tag" key={c}>{c}</span>
            ))}
          </Reveal>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel">
              <h4>Проделанная работа</h4>
              <MPlain items={[
                "Двуязычная лендинговая воронка на русском и английском",
                "Mobile-first макеты, спроектированные параллельно с десктопной версией",
                "Тест первичной оценки из 4 вопросов с мгновенным результатом и подходящими CTA",
                "Запись через Cal.eu для бесплатных и платных консультаций",
                "Цены, сравнение пакетов, FAQ и SEO-контент для обоих языков",
              ]} />
            </Reveal>
            <Reveal className="cs-panel cs-panel-accent">
              <h4>Результат</h4>
              <MPlain items={[
                "Telegram-based сервис получил понятную точку входа в вебе",
                "Пользователи могли разобраться в предложении до обращения за консультацией",
                "Квиз отделял подходящие заявки от нерелевантных запросов",
                "Запись перешла из ручной переписки в структурированный Cal.eu-флоу",
                "Полная RU/EN версия лендинга вышла в запуск меньше чем за 36 часов",
              ]} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Context & Brief ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Контекст и бриф</h3></div>
          <div className="cs-grid2 mg-ctx-grid">
            <div className="mg-ctx-col">
              <Reveal>
                <h4 className="gm-subh" style={{ marginTop: 0 }}>UX-задача</h4>
                <p className="cs-p">
                  MigroPlan помогает фрилансерам подготовиться к визе для самозанятых в Германии: бизнес-план,
                  финансовый прогноз, структура документов и пошаговое сопровождение до общения с ведомством. Это не
                  общий визовый блог и не юридическая фирма. Страница должна была быстро объяснить эту разницу.
                </p>
                <p className="cs-p">
                  Главная сложность была в доверии и релевантности. Посетителю нужно было сразу понять, подходит ли
                  сервис под его профессию, что именно он получит и есть ли смысл записываться на консультацию. При
                  этом клиенту не нужен был каждый любопытный пользователь в календаре. Воронка должна была
                  объяснять, отбирать и вести к записи, не превращая страницу в энциклопедию.
                </p>
              </Reveal>
              <Reveal className="ax-success ax-success-compact">
                <div className="ax-sub5" style={{ marginBottom: ".7rem" }}>Приоритеты клиента</div>
                <div className="ax-questions ax-questions-tight">
                  <p className="ax-q">«Запись на консультацию – <span className="accent">привести людей на звонок.</span>»</p>
                  <p className="ax-q">«Показать <span className="accent">комбо-пакет</span> как основной вариант.»</p>
                  <p className="ax-q">«Отсеять неподходящие запросы <span className="accent">как можно раньше.</span>»</p>
                </div>
                <p className="ax-success-note">
                  Мы согласовали эти приоритеты до работы над layout. Именно они задали направление воронки: сначала
                  показать, кому подходит сервис, затем объяснить процесс, провести первичную оценку через тест и
                  запланировать звонок с подходящими пользователями.
                </p>
              </Reveal>
            </div>
            <div className="mg-ctx-col">
              <Reveal className="ax-hero-media mg-ctx-media">
                <LiveShot
                  src={MS + "Funnel_Entry-RU.png"}
                  pos="top center"
                  alt="MigroPlan — для кого виза и четырёхшаговый процесс"
                  caption={<>Блоки с аудиторией и процессом стали костяком страницы: сначала показать, для кого сервис, затем объяснить путь в четыре шага.</>}
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
          <div className="cs-head"><h3 className="cs-h">Архитектура воронки: пять направлений</h3></div>
          <p className="cs-p">
            Прежде чем заняться разработкой hi-fi макета, я проработал пять структурно разных вариантов воронки.
            Каждый вариант проверял свою точку входа: начать с квиза, сразу показать предложение, дать сравнить
            пакеты, выстроить доверие через экспертный контент или сразу привести пользователя к кассе.
          </p>
          <p className="cs-p" style={{ marginTop: ".9rem" }}>
            Для каждого направления я сделал lo-fi wireframe и короткую гипотезу. Claude помог сократить время
            на эту проработку с нескольких дней до одного вечера. По итогу я представил пять направлений со своей
            рекомендацией и четкой аргументацией.
          </p>

          <div className="mg-fdirs cs-mt-l" data-deselect="stamp">
            {FUNNEL_DIRS.map((d) => (
              <FunnelDirCard key={d.id} dir={d} chosen={d.id === "A"} />
            ))}
          </div>

          <Reveal className="cs-panel cs-panel-accent cs-mt-l">
            <h4>Почему победило направление A</h4>
            <p className="cs-p" style={{ marginTop: ".6rem" }}>
              Главным приоритетом клиента было отсечь неподходящие запросы до попадания в календарь. Вариант A
              ставил этот фильтр в начало воронки: квиз становился Hero Section, а пакеты и цены уходили
              на один уровень ниже. При этом пользователи, которые уже понимали, что им нужно, всё равно
              имели прямой путь к предложению – с понятными пакетами, объёмом услуги и ценами.
            </p>
            <p className="cs-p" style={{ marginTop: ".8rem" }}>
              Так воронка работала для обеих групп. Неуверенные пользователи могли сначала проверить,
              подходит ли им сервис. Подходящие лиды доходили до записи с более ясным пониманием
              своих шансов, а нерелевантные запросы раньше получали более честный следующий шаг.
            </p>
            <p className="cs-p" style={{ marginTop: ".8rem" }}>
              B и E лучше подошли бы продукту в формате магазина с повторными покупками. C был
              безопасным стандартным вариантом для страницы сервиса. D требовал более сильного личного
              бренда. Для нового сервиса в теме, где пользователям сначала нужны доверие и понимание,
              направление A было самым правильным решением.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Turning the funnel into a page ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Как выбранная воронка стала страницей</h3></div>

          <div className="mg-stageflow cs-mt-l">
            <div className="mg-stage">
              <span className="mg-stage-n">01 · Вход</span>
              <span className="mg-stage-t">Одно обещание</span>
              <span className="mg-stage-d">Подготовка сильной заявки на визу для самозанятых в Германии.</span>
            </div>
            <div className="mg-stage">
              <span className="mg-stage-n">02 · Релевантность</span>
              <span className="mg-stage-t">Для кого</span>
              <span className="mg-stage-d">Страница называет подходящие профессии, чтобы посетитель понял, подходит ли ему предложение.</span>
            </div>
            <div className="mg-stage mg-stage--gate">
              <span className="mg-stage-n">03 · Отбор</span>
              <span className="mg-stage-t">Тест первичной оценки</span>
              <span className="mg-stage-d">Короткий тест отделяет сильные профили, пограничные случаи и нерелевантные запросы — и направляет каждый на подходящий следующий шаг.</span>
            </div>
            <div className="mg-stage">
              <span className="mg-stage-n">04 · Сравнение</span>
              <span className="mg-stage-t">Тарифы</span>
              <span className="mg-stage-d">Комбо-пакет — основной вариант, а альтернативные тарифы рядом помогают сравнить цены и объём услуги.</span>
            </div>
            <div className="mg-stage">
              <span className="mg-stage-n">05 · Запись</span>
              <span className="mg-stage-t">Консультация</span>
              <span className="mg-stage-d">Бесплатные и платные консультации ведут в разные типы событий Cal.eu – в паре кликов от главных CTA.</span>
            </div>
          </div>

          {/* eligibility quiz */}
          <Reveal className="cs-mt-l">
            <h4 className="gm-subh" style={{ marginTop: 0 }}>Тест первичной оценки</h4>
            <p className="cs-p">
              Тест помогает посетителю понять, подходит ли ему эта виза, и какой следующий шаг следует предпринять.
              Результат – конкретная рекомендация. Только после прохождения теста запрашиваются контактные данные.
            </p>
          </Reveal>
          <Reveal className="cs-panel cs-mt-m">
            <div className="ax-sub5" style={{ marginBottom: ".7rem" }}>Дизайн-логика</div>
            <MKL items={[
              ["Только 4 вопроса:", "возраст, тип деятельности, доход и клиенты в Германии."],
              ["3 сценария результата:", "сильный профиль, нестандартный случай или неподходящий визовый путь."],
              ["Сначала результат, потом контакт:", "данные запрашиваются только после рекомендации."],
              ["Modal-flow:", "тест открывается поверх лендинга и после закрытия возвращает пользователя в ту же точку страницы."],
            ]} />
          </Reveal>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal>
              <LiveShot
                fit
                src={MS + "Quiz_Engline_1_RU.png"}
                alt="Тест первичной оценки MigroPlan – первый вопрос"
                caption={<>Тест открывается поверх страницы: один вопрос за шаг, видимый прогресс, без регистрации.</>}
              />
            </Reveal>
            <Reveal>
              <LiveShot
                fit
                src={MS + "Quiz_Engline_2_RU.png"}
                alt="Тест первичной оценки MigroPlan – результат"
                caption={<>Результат сразу ведёт к следующему шагу: в этом примере сильный профиль попадает на бесплатную консультацию.</>}
              />
            </Reveal>
          </div>

          {/* pricing and booking */}
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel cs-panel-accent">
              <h4>Тарифы и запись</h4>
              <p className="cs-p" style={{ marginTop: ".6rem" }}>
                Блок тарифов продолжает логику воронки. Комбо-пакет выделяется визуальным акцентом, а альтернативы
                рядом помогают сравнить цены, объём услуг и понять ценность ключевого предложения.
              </p>
              <p className="cs-p" style={{ marginTop: ".8rem" }}>
                Путь к записи короткий: результат теста, карточки тарифов и CTA консультаций ведут в Cal.eu.
                Бесплатная 15-минутная консультация и платный 60-минутный разбор — разные типы событий: каждая
                заявка сразу приходит с нужным для заказчика контекстом.
              </p>
            </Reveal>
            <Reveal>
              <LiveShot
                src={MS + "Funnel_End_RU.png"}
                alt="MigroPlan – тарифные пакеты"
                caption={<>Комбо-пакет получает самый сильный CTA; отдельные документы рядом помогают показать его ценность.</>}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Mobile-first ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">UI с фокусом на мобильные устройства</h3></div>
          <p className="cs-p">
            Мы с клиентом с самого начала понимали, что страницу, скорее всего, будут открывать с телефона: из Telegram-чата, по ссылке или через быстрый поиск. Поэтому mobile стал основным направлением UI.
          </p>
          <p className="cs-p" style={{ marginTop: ".8rem" }}>
            Это повлияло на весь интерфейс. Блоки остаются узкими и легко сканируются. Тексты сделаны компактными. Каждый раздел держится на одной понятной мысли, а не пытается уместить слишком много информации на маленьком экране. Цветовая палитра тоже преднамеренно выбрана простая, чтобы красные CTA и ключевые акценты оставались заметными, не делая страницу перегруженной.
          </p>
          <p className="cs-p" style={{ marginTop: ".8rem" }}>
            Интеграции проверялись с учётом мобильного сценария. Тест открывается прямо на странице, Cal.eu позволяет перейти к записи без лишних шагов, а главная кнопка связи через Telegram ведёт сразу в мобильное приложение.
          </p>

          <div className="mg-phones cs-mt-l">
            <MobileShot
              src={MS + "Mobile_view_1_RU.png"}
              alt="MigroPlan mobile – Hero"
              caption={<>Компактный первый экран: короткий текст, один основной CTA и Telegram-кнопка, которая сразу работает на телефоне.</>}
            />
            <MobileShot
              src={MS + "Mobile_view_2_RU.png"}
              alt="MigroPlan mobile – как это работает"
              caption={<>Процесс превращается в узкий вертикальный flow: четыре шага в одной колонке, удобно читать на маленьком экране.</>}
            />
          </div>

          <Reveal className="cs-panel cs-panel-accent cs-mt-l">
            <h4>Мобильный фикс после запуска</h4>
            <p className="cs-p" style={{ marginTop: ".6rem" }}>
              После запуска я проверил страницу на реальных смартфонах и нашёл проблему в header. На очень узких экранах полная <span className="mg-tgchip">Telegram</span>-кнопка занимала слишком много места и сдвигала элементы.
            </p>
            <p className="cs-p" style={{ marginTop: ".8rem" }}>
              Для mobile я оставил в кнопке только иконку Telegram. Кнопка осталась узнаваемой, ссылка по-прежнему открывает Telegram напрямую, а header теперь нормально держится и на маленьких экранах. Icon-only версию видно на мобильных скриншотах выше.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── AI-Assisted Sprint ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Как я использовал Claude во время спринта</h3></div>
          <p className="cs-p">
            Я использовал Claude на протяжении всего 36-часового спринта: сначала для проработки возможных направлений, затем для текстов, layout-решений и быстрых итераций в сборке. При этом процесс оставался обычной клиентской работой: жёсткий срок, определенная бизнес-цель и необходимость сделать интерфейс максимально понятным.
          </p>
          <ol className="ax-steps cs-mt-l">
            {[
              ["Идеи воронки · часы 0–4.", "Я дал Claude контекст сервиса, аудиторию и первое направление дизайна, а затем проработал несколько возможных landing funnels. К концу первого вечера было пять вариантов, каждый с разной первой точкой принятия решения для посетителя, и одно направление, которое я был готов рекомендовать."],
              ["Синк с клиентом · час 5.", "Звонок длился примерно 30 минут. Мы утвердили, какие услуги нужно сильнее подсветить, выбрали комбо-пакет как основное предложение и согласовали, что тест должен фильтровать людей до попадания в календарь. Пять уже подготовленных направлений сделали разговор коротким и предметным."],
              ["Copy · часы 6–18.", "Когда позиционирование стало понятным, я писал и дорабатывал тексты по секциям. Русская и английская версии делались самобытно – с разным ритмом и немного разными акцентами."],
              ["Сборка и полировка · часы 18–30.", "Дальше я работал над layout, логикой теста, i18n-структурой и мобильными breakpoints. Каждый раунд обратной связи сразу превращался в следующую версию, поэтому спринт двигался быстро и без длинных пауз между итерациями."],
              ["Запуск · часы 30–36.", "В финальный отрезок вошли хостинг, деплой, последний проход по текстам на двух языках и подключение Cal.eu event types. К вечеру второго дня страница была онлайн."],
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
          <div className="cs-head"><h3 className="cs-h">Технические детали</h3></div>
          <div className="ax-dsys">
            <Reveal className="cs-panel">
              <h4>Одна статическая сборка</h4>
              <MKL items={[
                ["Лендинг работает как статическая HTML/CSS/JS-сборка.", "Обе языковые версии – RU и EN – находятся в одном файле."],
                ["Переключение языка происходит на стороне клиента через небольшой i18n key map.", "Строки с форматированием вынесены отдельно, чтобы красные акценты на ключевых словах сохранялись при смене языка."],
                ["Я оставил реализацию лёгкой:", "без фреймворков, без build step и без лишней поддержки после handoff."],
              ]} />
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Кастомная логика теста</h4>
              <MKL items={[
                ["Тест первичной оценки сделан на vanilla JS:", "четыре вопроса, три сценария результата и одно модальное окно."],
                ["Routing проверяет тип деятельности, уровень дохода и наличие клиентов в Германии.", "Простой score управляет финальной шкалой и определяет, какой result screen увидит пользователь."],
                ["У каждого результата свой CTA,", "связанный с подходящим Cal.eu event type."],
              ]} />
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Запись через Cal.eu</h4>
              <MKL items={[
                ["Запись работает через Cal.eu – EU-hosted инстанс Cal.com.", "Интеграция была простой, достаточно лёгкой для статического лендинга и закрыла задачу записи без лишнего overhead."],
                ["Бесплатная 15-минутная консультация и платный 60-минутный разбор используют разные типы событий,", "поэтому каждая запись сразу приходит с нужным контекстом."],
                ["Главные CTA ведут к свободному слоту в несколько кликов.", "Платная консультация также засчитывается в стоимость комбо-пакета."],
              ]} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Learnings ── */}
      <section className="cs-section">
        <div className="cs-prose">
          <div className="cs-head" style={{ justifyContent: "center" }}><h3 className="cs-h">Уроки</h3></div>
          <p className="cs-p" style={{ textAlign: "center" }}>
            Несколько вещей, которые я бы повторил в следующем спринте:
          </p>
          <ul className="cs-steps cs-mt-m">
            {[
              ["Подготовить рекомендацию для созвона с клиентом.", "Пять подготовленных направлений воронки заметно упростили первый звонок. Мы не начинали с абстрактных вопросов, а сразу сравнивали конкретные варианты, обсуждали компромиссы и быстро выбрали направление, которое имело больше всего смысла."],
              ["Честно говорить, если сервис не подходит.", "Тест не пытается удержать каждого посетителя в воронке. Если человеку больше подходит виза под Gewerbe или он не проходит базовый порог по доходу, страница говорит об этом прямо и предлагает более логичный следующий шаг. Так сервис становится полезнее, а обе стороны не тратят время на лишний звонок."],
              ["Продумывать mobile-детали заранее.", "Мобильный layout был частью работы с самого начала. Поэтому фиксы после запуска были небольшими: лейбл у кнопки, несколько отступов, пара breakpoints. После проверки на реальных смартфонах страницу не пришлось пересобирать заново."],
              ["Использовать дедлайн как фильтр.", "За 36 часов от брифа до запуска каждый раздел должен был оправдать своё место. В live ушли только те блоки, которые действительно были нужны сервису: оффер, релевантность, тест, пакеты, запись и FAQ. Жёсткий срок помог сделать лендинг сфокусированным."],
            ].map(([b, t], i) => <li className="cs-li" key={i}><strong>{b}</strong> {t}</li>)}
          </ul>
        </div>
      </section>

    </div>
  );
}

Object.assign(window, { MigroCase });
