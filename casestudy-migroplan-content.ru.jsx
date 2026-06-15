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
    pin: "Главный крючок = сначала проверь шансы, потом покупай",
    layout: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 10px 8px" }}>
        <WireBar w="65%" h={8} accent />
        <WireBar w="80%" h={5} />
        <WireBar w="55%" h={5} />
        <WireBox style={{ padding: "7px 8px", marginTop: 4, border: "1px solid color-mix(in oklab, var(--accent) 50%, var(--line-2))" }}>
          <WireLabel>[ ПРОЙТИ ТЕСТ — 2 МИН ]</WireLabel>
          <WireBar w="90%" h={14} accent style={{ marginTop: 5, borderRadius: 2 }} />
          <WireBar w="55%" h={8} style={{ marginTop: 3 }} />
        </WireBox>
        <WireBar w="35%" h={7} style={{ marginTop: 3 }} />
        <WireBar w="100%" h={1} style={{ marginTop: 6, marginBottom: 6 }} />
        <WireLabel>→ Как это работает → Цены</WireLabel>
      </div>
    ),
  },
  {
    id: "B",
    title: "Сначала магазин",
    pin: "Конфигуратор как герой — покупка уже на первом экране",
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
          <WireLabel>СОБРАТЬ ПАКЕТ</WireLabel>
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
    pin: "Классические тарифы — средний выделен",
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
    title: "Эксперт / редакционный",
    pin: "Сначала доверие — продукт только после прогрева",
    layout: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 10px 8px" }}>
        <WireBar w="95%" h={7} accent />
        <WireBar w="85%" h={7} />
        <WireBar w="60%" h={7} />
        <WireBar w="100%" h={40} style={{ marginTop: 4, borderRadius: 3, background: "var(--line)" }} />
        <WireLabel style={{ marginTop: 4 }}>ПОРТРЕТ ЭКСПЕРТА + БИО</WireLabel>
        <WireBar w="100%" h={1} style={{ marginTop: 5, marginBottom: 4 }} />
        <WireLabel>→ Как работает → Отзывы → Цены (поздно)</WireLabel>
      </div>
    ),
  },
  {
    id: "E",
    title: "Липкая корзина",
    pin: "Контент слева скроллится, конфигуратор справа остаётся sticky",
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
    <Reveal className={"mg-fdir" + (chosen ? " mg-fdir--chosen" : "")}>
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
            <Reveal><MonoLabel>Кейс · 02 — MigroPlan</MonoLabel></Reveal>
            <Reveal as="span" className="mono-sm" style={{ color: "var(--ink-faint)" }}>2025 · 1,5 дня · клиентский проект</Reveal>
          </div>
          <div className="ax-hero-grid">
            <Reveal className="ax-hero-text">
              <h1 className="cs-title">Помощь с визой для фрилансеров.<br /><span className="accent">В продакшене за 36 часов.</span></h1>
              <p className="cs-sub">Архитектура воронки, экспресс-тест визовых шансов и запись через Cal.eu для MigroPlan — собрано mobile-first и выпущено за полтора дня</p>
              <p className="cs-lead">
                MigroPlan помогает фрилансерам подготовить сильную заявку на немецкую визу для самозанятых.
                Сервис уже работал и вёлся через Telegram — ему быстро нужна была веб-витрина.
                Я пришёл с дизайн-концептом, с помощью Claude проработал пять направлений воронки,
                согласовал приоритеты с клиентом и довёл страницу шаг за шагом.
                Сайт вышел в продакшен меньше чем за 36 часов.
              </p>
              <div className="ax-skip-wrap" style={{ display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
                <a href="https://migroplan.com/" target="_blank" rel="noopener noreferrer" className="btn btn-accent ax-skip-btn" data-hot>
                  Смотреть вживую
                  <span className="btn-arrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </span>
                </a>
                <a href="#funnel" className="btn ax-skip-btn" data-hot>
                  Сразу к процессу
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
                src={MS + "Hero_Ru.png"}
                alt="MigroPlan — лендинг, hero"
                caption={<><strong>Продакшен-страница, русская сборка.</strong> Кликните, чтобы увеличить, или откройте migroplan.com, чтобы посмотреть вживую.</>}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="cs-section gm-stats-sec">
        <div className="cs-wrap">
          <div className="gm-statband mg-statband">
            <MigroStat pre="<" to={36} suf=" ч" label="От брифа до продакшена" />
            <MigroStat to={5} label="Направлений воронки проработано" />
            <MigroStat to={3} label="Сценариев результата в тесте" />
            <MigroStat to={2} label="Языка на старте (RU / EN)" />
          </div>
        </div>
      </section>

      {/* ── Nutshell ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h2 className="cs-h">Проект коротко</h2></div>
          <Reveal className="cs-meta">
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Моя роль</div>
              <div className="cs-meta-v">UX-концепт, архитектура воронки, UI-дизайн, RU/EN-микрокопирайт и технические интеграции — от и до</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Сроки</div>
              <div className="cs-meta-v">1,5 дня от первого вайрфрейма до деплоя в продакшен</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Стек и инструменты</div>
              <div className="cs-meta-v">Чистый HTML / CSS / JS, mobile-first, запись через Cal.eu, собственный движок теста, RU/EN-i18n, Claude для проработки идей</div>
            </div>
          </Reveal>
          <Reveal className="cs-chips cs-mt-m" style={{ justifyContent: "center" }}>
            {["Дизайн воронки", "Лендинг UX", "Двуязычный UI (RU/EN)", "Архитектура конверсии", "Интеграция Cal.eu", "Интерактивный тест", "Спринт с AI"].map((c) => (
              <span className="tag" key={c}>{c}</span>
            ))}
          </Reveal>
          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="cs-panel">
              <h4>Что я выпустил</h4>
              <MPlain items={[
                "Полноценный лендинг-воронка — русский и английский в одной сборке",
                "Нативный мобильный макет, нарисованный в одном заходе с десктопом",
                "Экспресс-тест визовых шансов — 4 вопроса, мгновенный результат, релевантная CTA",
                "Запись через Cal.eu на бесплатные и платные консультации",
                "Цены с сравнением пакетов, плюс FAQ и SEO-статья на двух языках",
              ]} />
            </Reveal>
            <Reveal className="cs-panel cs-panel-accent">
              <h4>Результат</h4>
              <MPlain items={[
                "В продакшене меньше чем за 36 часов от первого вайрфрейма",
                "Переключение RU / EN без перезагрузки и без скачков вёрстки",
                "Нерелевантные лиды отсеяны тестом ещё до календаря",
                "Запись в 2 клика: CTA → встроенный Cal.eu",
                "Приоритеты и позиционирование согласованы с клиентом до первой строки кода",
              ]} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Context & Brief ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Контекст и бриф</h3></div>
          <div className="cs-grid2 ax-equal">
            <Reveal>
              <h4 className="gm-subh" style={{ marginTop: 0 }}>Сервис</h4>
              <p className="cs-p">
                Немецкая виза для фрилансеров — один из самых реалистичных способов для IT-специалистов, дизайнеров,
                преподавателей и переводчиков из третьих стран легально жить и работать в Германии. Заявка
                держится на документах — бизнес-плане, финансовом прогнозе и пакете бумаг ровно в той форме,
                которую ждут ведомства. Именно эту подготовку и продаёт клиент.
              </p>
              <p className="cs-p">
                Сервис уже работал — реальные клиенты, реальные одобрения, — но вёлся целиком через Telegram и
                сарафанное радио, без чего-либо, что можно показать новому лиду, который сначала хочет разобраться.
                Бриф: лендинг, который объясняет предложение, набирает достаточно доверия для записи и честно
                отсеивает тех, кому виза не подходит — и всё это без места для процесса длиной в недели.
              </p>
            </Reveal>
            <Reveal className="ax-hero-media mg-ctx-media">
              <LiveShot
                src={MS + "Funnel_Entry-RU.png"}
                pos="top center"
                alt="MigroPlan — для кого виза и четырёхшаговый процесс"
                caption={<><strong>Целевая аудитория названа прямо на странице.</strong> «Для кого» перечисляет профессии, которым виза подходит, а «Как это работает» раскладывает путь из четырёх шагов — каркас, которому должен был служить весь бриф.</>}
              />
            </Reveal>
          </div>

          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal className="ax-success ax-success-compact" style={{ margin: 0 }}>
              <div className="ax-sub5" style={{ marginBottom: ".7rem" }}>Что клиент хотел приоритизировать</div>
              <div className="ax-questions ax-questions-tight">
                <p className="ax-q">«Запись на консультацию — <span className="accent">приведи их на звонок.</span>»</p>
                <p className="ax-q">«Покажи <span className="accent">комбо-пакет</span> как опцию по умолчанию.»</p>
                <p className="ax-q">«Отсеивай тех, кто <span className="accent">не подходит,</span> ещё на входе.»</p>
              </div>
              <p className="ax-success-note">
                Эти приоритеты мы прошли в одном созвоне, прежде чем я тронул макет. Этот разговор выбрал
                направление воронки и сэкономил как минимум целую итерацию.
              </p>
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Рабочее название → финальное имя</h4>
              <p className="cs-p">
                Проект стартовал как <strong>Freiberufler·Weg</strong> — корректный немецкий ярлык и
                скороговорка, на которой споткнётся половина аудитории. <strong>MigroPlan</strong> победил,
                потому что проходит проверки, которые здесь важны:
              </p>
              <div className="cs-mt-m">
                <MKL items={[
                  ["Читается одинаково на русском и английском", "— никаких ловушек транслитерации в обе стороны."],
                  ["Говорит, что делает", "— миграция плюс план, понятно без объяснений."],
                  ["Достаточно короткое", "для логотипа, домена и Telegram-хендла."],
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
          <div className="cs-head"><h3 className="cs-h">Архитектура воронки: пять направлений</h3></div>
          <p className="cs-p">
            До единой строки продакшен-кода я набросал пять структурно разных воронок — каждая своя ставка на то,
            куда первым делом упадёт внимание посетителя и как рано он увидит цену. Каждое направление получило
            lo-fi вайрфрейм и однострочную гипотезу.
          </p>
          <p className="cs-p" style={{ marginTop: ".9rem" }}>
            Этот заход стоил одного вечера с Claude вместо привычных нескольких дней — и именно здесь AI помог
            больше всего. К созвону с клиентом у меня были разложены все пять, понятный фаворит и аргументация наготове.
          </p>

          <div className="mg-fdirs cs-mt-l">
            {FUNNEL_DIRS.map((d) => (
              <FunnelDirCard key={d.id} dir={d} chosen={d.id === "A"} />
            ))}
          </div>

          <Reveal className="cs-panel cs-panel-accent cs-mt-l">
            <h4>Почему победило направление A</h4>
            <p className="cs-p" style={{ marginTop: ".6rem" }}>
              Главным приоритетом клиента было отсеивать лиды до того, как они дойдут до календаря — и направление A
              ставит именно этот фильтр в центр: тест — это герой, продукт сидит на одно решение глубже. Посетители,
              которым виза не подходит, получают честный ответ и другой следующий шаг ещё до того, как увидят цены.
              Те, кому подходит, доходят до записи, уже зная свои шансы — звонки начинаются теплее и идут короче.
            </p>
            <p className="cs-p" style={{ marginTop: ".8rem" }}>
              B и E подошли бы магазину с повторными покупками; C — безопасный стандарт для сервисного бизнеса;
              D требует эксперта с уже сложившимся личным брендом. Для нового имени в нише, где аудитории сначала
              нужно просвещение, прежде чем она решится, A был правильным выбором.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Funnel in production ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Вниз по воронке, в продакшене</h3></div>
          <p className="cs-p">
            Направление A на реальной странице. Вайрфрейм обещал воронку, которая квалифицирует, прежде чем
            продавать — вот как каждый этап выглядит в выпущенной сборке и что каждый тихо делает с посетителем,
            пока тот спускается вниз.
          </p>

          <div className="mg-stageflow cs-mt-l">
            <div className="mg-stage">
              <span className="mg-stage-n">01 · Приход</span>
              <span className="mg-stage-t">Одно обещание</span>
              <span className="mg-stage-d">Hero делает одно предложение: сильная заявка на визу фрилансера в Германию.</span>
            </div>
            <div className="mg-stage">
              <span className="mg-stage-n">02 · Прицел</span>
              <span className="mg-stage-t">Для кого</span>
              <span className="mg-stage-d">Называет подходящие профессии. Все остальные отсеивают себя сами.</span>
            </div>
            <div className="mg-stage mg-stage--gate">
              <span className="mg-stage-n">03 · Квалификация</span>
              <span className="mg-stage-t">Экспресс-тест</span>
              <span className="mg-stage-d">Четыре вопроса сортируют сильные, пограничные и неподходящие случаи до календаря.</span>
            </div>
            <div className="mg-stage">
              <span className="mg-stage-n">04 · Конверсия</span>
              <span className="mg-stage-t">Цены</span>
              <span className="mg-stage-d">Комбо-пакет по умолчанию; отдельные документы à la carte вокруг него.</span>
            </div>
            <div className="mg-stage">
              <span className="mg-stage-n">05 · Запись</span>
              <span className="mg-stage-t">Консультация</span>
              <span className="mg-stage-d">Два типа звонка, оба в двух кликах от слота Cal.eu.</span>
            </div>
          </div>

          <div className="cs-grid2 ax-equal cs-mt-l" style={{ alignItems: "center" }}>
            <Reveal className="cs-order-2">
              <h4 className="gm-subh" style={{ marginTop: 0 }}>Конверсия на условиях клиента</h4>
              <p className="cs-p">
                Клиент хотел прежде всего одного: сделать комбо-пакет очевидным выбором. Только он несёт стикер
                «Лучшее предложение» и единственную красную кнопку; три отдельных документа à la carte вокруг
                обрамляют комбо как полную, продуманную опцию — а не как дорогую.
              </p>
              <p className="cs-p" style={{ marginTop: ".8rem" }}>
                Тихая кнопка <strong>«Не уверен, что мне нужно»</strong> под ними ловит всех, кто ещё сомневается,
                и возвращает их в консультацию, вместо того чтобы дать им уйти.
              </p>
            </Reveal>
            <Reveal className="cs-order-1">
              <LiveShot
                src={MS + "Funnel_End_RU.png"}
                alt="MigroPlan — тарифные пакеты"
                caption={<><strong>Этап 04 — конверсия.</strong> Только комбо-пакет несёт акцентную кнопку; остальные задают его ценность.</>}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Express Test ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Экспресс-тест</h3></div>
          <p className="cs-p">
            Тест визовых шансов — это первая CTA на странице и ключевой шаг квалификации в воронке. Он должен был
            ощущаться как быстрый самопроверочный чек, что-то, что делаешь из любопытства: четыре вопроса, без
            регистрации, результат с конкретной рекомендацией меньше чем за две минуты.
          </p>

          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal>
              <h4 className="gm-subh" style={{ marginTop: 0 }}>Дизайн-решения</h4>
              <MKL items={[
                ["Только 4 вопроса.", "Возраст, тип деятельности, уровень дохода, клиенты в Германии — минимум, чтобы вывести человека на один из трёх исходов. Каждый лишний вопрос стоит завершений."],
                ["Три сценария результата.", "Сильный профиль → бесплатная 15-минутная консультация. Нестандартный случай → платный глубокий разбор. Не тот тип визы или доход ниже порога → честное перенаправление с другим следующим шагом. Никто не попадает в тупик."],
                ["Без регистрации.", "Контакты собираются позже, после того как посетитель уже получил что-то полезное."],
                ["Модалка, а не отдельная страница.", "Тест открывается поверх лендинга и закрывается обратно в ту же позицию скролла, так что никто не теряет своё место."],
              ]} />
            </Reveal>
            <Reveal>
              <h4 className="gm-subh" style={{ marginTop: 0 }}>Маршрутизация результата</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: ".7rem", marginTop: ".3rem" }}>
                <div className="cs-panel" style={{ padding: "1rem 1.2rem" }}>
                  <div className="ax-sub5" style={{ marginBottom: ".4rem", color: "var(--accent)" }}>Отличные шансы</div>
                  <p className="cs-p" style={{ fontSize: ".94rem" }}>
                    Фриланс-профессия + доход ≥ 1500 € + немецкий клиент. CTA: бесплатная 15-мин консультация → Cal.eu.
                  </p>
                </div>
                <div className="cs-panel" style={{ padding: "1rem 1.2rem" }}>
                  <div className="ax-sub5" style={{ marginBottom: ".4rem" }}>Умеренные шансы</div>
                  <p className="cs-p" style={{ fontSize: ".94rem" }}>
                    Хороший профиль, нестандартный случай — пока нет немецкого клиента или пограничный доход. CTA: платный 60-мин глубокий разбор → Cal.eu.
                  </p>
                </div>
                <div className="cs-panel" style={{ padding: "1rem 1.2rem" }}>
                  <div className="ax-sub5" style={{ marginBottom: ".4rem" }}>Другая виза / рано</div>
                  <p className="cs-p" style={{ fontSize: ".94rem" }}>
                    Малый бизнес вместо фриланса или доход ниже порога. Честное перенаправление, которое экономит звонок обеим сторонам.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal className="cs-mt-l">
            <h4 className="gm-subh" style={{ marginTop: 0 }}>Сториборд флоу теста</h4>
          </Reveal>
          <div className="mg-qboard cs-mt-m">
            {QUIZ_STEPS.map((s, i) => <QuizFrame key={i} step={s} />)}
          </div>

          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal>
              <LiveShot
                src={MS + "Quiz_Engline_1_RU.png"}
                alt="MigroPlan — тест на соответствие, первый вопрос"
                caption={<><strong>Вопрос 1 из 4.</strong> Тест открывается модалкой поверх лендинга — прогресс-бар, по одному вопросу за раз, без регистрации. Закрывается обратно в ту же позицию скролла.</>}
              />
            </Reveal>
            <Reveal>
              <LiveShot
                src={MS + "Quiz_Engline_2_RU.png"}
                alt="MigroPlan — тест на соответствие, экран результата"
                caption={<><strong>Результат.</strong> Оценённый профиль управляет шкалой и CTA — здесь сильные 8/8 ведут прямо к бесплатной 15-минутной консультации.</>}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Booking / Cal.eu ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">От CTA до забронированного слота</h3></div>
          <p className="cs-p">
            Каждая CTA на странице — результат теста, тарифные карточки, блок консультации — ведёт в одно место:
            слот Cal.eu. Две точки входа на странице, один лист записи за ними.
          </p>

          <div className="cs-grid2 ax-equal cs-mt-l">
            <Reveal>
              <LiveShot
                fit
                src={MS + "Consultation_RU.png"}
                alt="MigroPlan — варианты консультаций"
                caption={<><strong>На странице.</strong> Бесплатная 15-минутная экспресс-оценка и платный 60-минутный разбор случая — два отдельных предложения.</>}
              />
            </Reveal>
            <Reveal>
              <LiveShot
                fit
                src={MS + "Cal_EU_integration.png"}
                alt="MigroPlan — лист записи Cal.eu"
                href="https://migroplan.com/"
                caption={<><strong>Что открывается.</strong> Лист Cal.eu, оформленный под MigroPlan, с живой доступностью в часовом поясе Europe/Berlin.</>}
              />
            </Reveal>
          </div>
          <p className="mg-paircap">↑ Каждая точка входа на странице ведёт к своему типу события Cal.eu, так что записи приходят уже размеченными</p>

          <Reveal className="cs-panel cs-mt-l">
            <h4>Почему Cal.eu</h4>
            <div className="cs-mt-m">
              <MKL items={[
                ["EU-хостинг намеренно.", "Запись идёт через Cal.eu — европейский инстанс Cal.com, — чтобы данные о встречах для сервиса о переезде в Германию оставались в ЕС. Небольшая деталь, которая попадает в аудиторию."],
                ["Два типа события, заранее размечены.", "Бесплатное 15-минутное интро и платный 60-минутный разбор лежат за отдельными ссылками, так что каждая запись приходит с тегом, какой это звонок."],
                ["Два клика до слота.", "От любой CTA на странице — и FAQ прямо говорит, что платный звонок засчитывается в стоимость комбо-пакета."],
              ]} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Mobile-first ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Сделано сначала для смартфона</h3></div>
          <p className="cs-p">
            Большинство людей, которые изучают визу, делают это со смартфона, в свободные минуты между делами —
            поэтому мобильный макет никогда не был запоздалой мыслью. Десктоп и мобайл рисовались в одном заходе,
            и весь UI собран так, чтобы <strong>динамически перетекать</strong>, а не прыгать по нескольким
            фиксированным ширинам.
          </p>

          <div className="mg-phones cs-mt-l">
            <MobileShot
              src={MS + "Mobile_view_1_RU.png"}
              alt="MigroPlan мобайл — hero"
              caption={<><strong>Hero, в стопку.</strong> Подсказка с немецким флагом поднимается над заголовком; CTA становится во всю ширину и под большой палец.</>}
            />
            <MobileShot
              src={MS + "Mobile_view_2_RU.png"}
              alt="MigroPlan мобайл — как это работает"
              caption={<><strong>«Как это работает», вертикально.</strong> Лента из четырёх шагов разворачивается в одну колонку с коннектором, идущим по левому краю.</>}
            />
          </div>

          <Reveal className="cs-panel cs-panel-accent cs-mt-l">
            <h4>Поправлено уже в бою</h4>
            <p className="cs-p" style={{ marginTop: ".6rem" }}>
              После запуска я сделал отдельный заход по багфиксу на реальных устройствах, а не в симуляторе. Одна
              находка: полноразмерная кнопка <span className="mg-tgchip">Telegram</span> ниже определённой ширины
              вылезала из шапки и ломала вёрстку.
            </p>
            <p className="cs-p" style={{ marginTop: ".8rem" }}>
              Решением было убрать подпись на мобайле и оставить только иконку-самолётик — на смартфоне более чем
              достаточно, где глиф Telegram читается мгновенно, — так что шапка держится вплоть до самых маленьких
              экранов. Кнопку-иконку видно на шотах выше.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── AI-Assisted Sprint ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Как на самом деле выглядел спринт с AI</h3></div>
          <p className="cs-p">
            Этот проект был заодно и боевым тестом Claude в настоящей клиентской поставке — с жёстким дедлайном,
            клиентом со своим мнением и деньгами на кону. Примерно по часам:
          </p>
          <ol className="ax-steps cs-mt-l">
            {[
              ["Проработка воронки · часы 0–4.", "Я описал Claude сервис, аудиторию и свой дизайн-концепт и прорабатывал структурно разные варианты воронки. В итоге их стало пять, у каждой своя гипотеза о том, что посетитель видит первым. К концу вечера у меня был фаворит."],
              ["Синк с клиентом · час 5.", "Полчаса по телефону. Мы зафиксировали, какие услуги продвигать, поставили комбо-пакет опцией по умолчанию и сошлись на том, что тест должен отсеивать лиды до календаря. Прийти с пятью разложенными направлениями сделало этот разговор коротким и конкретным."],
              ["Тексты · часы 6–18.", "Все тексты секций написаны и переработаны при зафиксированном позиционировании. Русский и английский писались как два отдельных захода — английская версия не перевод, у неё свой ритм и слегка другие акценты."],
              ["Сборка и доводка · часы 18–30.", "Вёрстка, маршрутизация теста, слой i18n, мобильные брейкпоинты. Каждый круг моего фидбэка шёл сразу в следующий заход — именно отсюда сжатый срок, без ожидания между итерациями."],
              ["Поставка · часы 30–36.", "Домен, деплой, последний проход по текстам на двух языках, подключены типы событий Cal.eu. Вживую на второй вечер."],
            ].map(([b, t], i) => (
              <li className="ax-step" key={i}>
                <span className="ax-step-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="ax-step-t"><strong>{b}</strong> {t}</span>
              </li>
            ))}
          </ol>

          <Reveal className="cs-panel cs-panel-accent cs-mt-l">
            <h4>О работе с Claude</h4>
            <p className="cs-p" style={{ marginTop: ".6rem" }}>
              Для меня выигрышем был темп. Больше направлений на столе в первые часы, проходы по текстам, которые
              идут за минуты, эксперименты с вёрсткой, которые я мог оценить на экране, а не воображать. Я по-прежнему
              принимал каждое финальное решение и выбросил немалую часть того, что вернулось, — но расстояние между
              идеей и тем, что можно оценить, схлопнулось, и именно это сделало 36 часов достаточными.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Tech stack ── */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Технические детали</h3></div>
          <div className="ax-dsys">
            <Reveal className="cs-panel">
              <h4>Два языка, одна сборка</h4>
              <MKL items={[
                ["Один HTML-файл", "несёт обе полные языковые версии, переключаемые на клиенте через i18n-карту ключей."],
                ["Rich-строки лежат отдельно,", "так что инлайновые красные акценты на ключевых словах переживают смену языка без потерь."],
                ["Без немецкого намеренно.", "Тому, кто уже живёт в Германии, виза фрилансера не нужна. Русский покрывает аудиторию СНГ, английский — остальной мир."],
              ]} />
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Движок теста</h4>
              <MKL items={[
                ["Свой чистый JS,", "без зависимостей — четыре вопроса, три сценария результата, одна модалка."],
                ["Логика ветвления", "маршрутизирует по типу деятельности, доходу и наличию немецкого клиента; оценённый профиль управляет финальным экраном."],
                ["CTA результата", "ведут на типы событий Cal.eu, соответствующие исходу."],
              ]} />
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Запись через Cal.eu</h4>
              <MKL items={[
                ["EU-хостинг (Cal.eu)", "— европейский инстанс Cal.com, так что данные записи аудитории на Германию остаются в ЕС."],
                ["Отдельные типы событий", "для бесплатной 15-минутной и платной 60-минутной консультации — записи приходят уже размеченными."],
                ["Два клика до слота", "от любой CTA, и платный звонок засчитывается в стоимость комбо-пакета."],
              ]} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Learnings ── */}
      <section className="cs-section">
        <div className="cs-prose">
          <div className="cs-head" style={{ justifyContent: "center" }}><h3 className="cs-h">Выводы</h3></div>
          <p className="cs-p" style={{ textAlign: "center" }}>
            Несколько вещей из этого спринта, которые я забираю в следующий:
          </p>
          <ul className="cs-steps cs-mt-m">
            {[
              ["Приходи на созвон с клиентом с рекомендацией.", "Пять разложенных направлений и один фаворит превратили возможную двухчасовую дискавери-сессию в тридцать решительных минут. Сначала сформировать гипотезу и провалидировать её вместе лучше, чем сидеть в комнате с чистым листом."],
              ["Честное «нет» строит больше доверия, чем мягкое «может быть».", "Тест прямо говорит владельцу малого бизнеса, что эта виза для него не сработает, и направляет в другое место. Этот ответ стоит одного лида и зарабатывает репутацию."],
              ["Проверяй имя на каждом языке, прежде чем фиксировать.", "Freiberufler·Weg умер в момент, когда я представил русскоязычного человека, вбивающего его в поисковую строку. Имя, которое работает только на одном языке, тихо ограничивает всё, что строится поверх."],
              ["Карта ключей сильнее фреймворка на таком масштабе.", "Для одного двуязычного лендинга несколько строк чистого JS сделали то, ради чего иначе берут i18n-библиотеку — без шага сборки и без того, что пришлось бы объяснять при передаче."],
              ["Проектируй мобильный макет в одном заходе, а не после.", "Поскольку мобайл и десктоп рисовались вместе, правки после запуска были небольшими — подпись кнопки тут, брейкпоинт там — а не вторым редизайном, когда за дело взялись реальные смартфоны."],
              ["Жёсткий дедлайн — хороший редактор.", "Каждая секция должна была оправдать себя в пределах 36 часов, так что страница вышла без единого «было бы неплохо». Ограничение сделало продукт собраннее, а качество не просело."],
            ].map(([b, t], i) => <li className="cs-li" key={i}><strong>{b}</strong> {t}</li>)}
          </ul>
        </div>
      </section>

    </div>
  );
}

Object.assign(window, { MigroCase });
