/* bachata-content.ru.jsx – Russian edition of the Bachata School case study.
   Same structure & components as bachata-content.jsx, Russian copy sourced from the
   live ru/case-study-bachata.html. Exports <BachataCase/>.
   Depends on core.jsx + casestudy-shared.jsx. The page shell lives in casestudy-bachata.jsx. */

const BIMG = "https://alexmedved.com/assets/images/";

/* render **bold** markers inside a string */
function mb(text) {
  return String(text).split(/\*\*(.+?)\*\*/g).map((p, i) =>
    i % 2 ? <strong key={i}>{p}</strong> : p
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

/* интерактивное сравнение До / После */
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
        <div className="ba2-seg" role="tablist" aria-label={title + " до и после"}>
          <button type="button" role="tab" aria-selected={!isAfter} data-hot
            className={"ba2-seg-btn" + (!isAfter ? " on" : "")} onClick={() => setView("before")}>До</button>
          <button type="button" role="tab" aria-selected={isAfter} data-hot
            className={"ba2-seg-btn" + (isAfter ? " on" : "")} onClick={() => setView("after")}>После</button>
        </div>
      </div>
      <div className="ba2-body">
        <div className="ba2-stage">
          <button type="button" className="ba2-figbtn" data-hot
            onClick={() => open({ src: active.img, alt: active.alt })}
            aria-label={"Открыть экран «" + (isAfter ? "После" : "До") + "»: " + active.alt}>
            <span className={"cs-ba-tag" + (isAfter ? " is-after" : "")}>{isAfter ? "После" : "До"}</span>
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
          <div className="ba2-notes-k">{isAfter ? "Что изменилось" : "Найденные проблемы"}</div>
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
    title: "Основной сценарий",
    before: {
      img: BIMG + "Screenshot-Bachata-Doc33.jpg",
      alt: "До – Hero и основной сценарий",
      points: [
        "Нет явной кнопки **«Записаться»**",
        "Тяжёлый и малопонятный язык",
        "Карточки разного размера, несогласованная вёрстка",
        "Плохая читаемость для быстрых решений",
      ],
    },
    after: {
      img: BIMG + "Screenshot-Bachata-Doc44.png",
      alt: "После – Hero с кнопкой «Записаться» и улучшенным микротекстом",
      points: [
        "Добавлена чёткая кнопка **«Записаться»**",
        "«Package» заменено на **«Pass»** – ближе к пользователю",
        "Карточки приведены к единому размеру",
        "Тексты и структура переработаны, добавлены буллеты",
      ],
    },
  },
  {
    title: "Инфоблок",
    before: {
      img: BIMG + "Screenshot-Bachata-Doc55.jpg",
      alt: "До – перегруженный инфоблок",
      points: [
        "Большие однотипные текстовые блоки",
        "Нет визуальных акцентов, глазу не за что зацепиться",
        "Важные детали теряются в длинных абзацах",
      ],
    },
    after: {
      img: BIMG + "Screenshot-Bachata-Doc66.png",
      alt: "После – структурированный инфоблок с акцентами",
      points: [
        "Добавлены подходящие **эмодзи** для лёгкого восприятия",
        "Текст сокращён для удобства чтения",
        "Важные детали выделены **жирным** для быстрой навигации",
      ],
    },
  },
  {
    title: "Ключевые пункты / выгоды",
    before: {
      img: BIMG + "Screenshot-Bachata-Doc11.jpg",
      alt: "До – раздел ключевых пунктов и выгод",
      points: [
        "Слабые или отсутствующие заголовки",
        "Длинные строки без ритма",
        "Текст выглядел «ненативно» и воспринимался с трудом",
      ],
    },
    after: {
      img: BIMG + "Screenshot-Bachata-Doc22.png",
      alt: "После – чёткие выгоды с сильными заголовками",
      points: [
        "Добавлены чёткие и заметные заголовки",
        "Переписанные тексты выиграли в **ясности и тоне**",
        "Естественные формулировки сделали текст намного понятнее",
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
                <Reveal><MonoLabel>Кейс-стади · 04 – Школа бачаты</MonoLabel></Reveal>
                <Reveal as="span" className="mono-sm" style={{ color: "var(--ink-faint)" }}>2024 · один вечер</Reveal>
              </div>
              <Reveal as="h1" className="cs-title">Ясные тексты,<br /><span className="accent">удобный UX.</span></Reveal>
              <Reveal as="p" className="cs-sub">От перегруженных текстов к понятному сайту с конверсиями за один вечер</Reveal>
              <Reveal as="p" className="cs-lead">
                Этот проект – полноценный спринт по UX-райтингу, дизайну и структуре контента. Я просмотрел
                сайт от и до, выявил проблемные точки и переписал ключевые разделы так, чтобы посетители
                сразу увидели предложение, цены и без препятствий могли связаться с тренерами. Результат –
                более дружелюбный сайт, которым проще и удобнее пользоваться.
              </Reveal>
            </div>
            <Reveal>
              <ZoomImg src={BIMG + "Screenshot-Bachta.png"} alt="Раздел Hero сайта школы бачаты"
                caption="Раздел Hero сайта школы бачаты. Хотя клиент сохранил некоторые элементы интерфейса по своему вкусу, внесённые изменения заметно улучшили UX и общую привлекательность сайта." />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Animated stat band */}
      <section className="cs-section">
        <div className="cs-wrap">
          <Reveal className="cs-head">
            <h2 className="cs-h">В цифрах</h2>
          </Reveal>
          <div className="gm-statband">
            <Stat to={1} label="Вечер · полный ревью → в прод" />
            <Stat to={5} label="Ключевых разделов переписано" />
            <Stat to={11} suf="-страничный" label="Документ с правками" />
            <Stat to={2} pre="×" label="Обращений за неделю" />
          </div>
        </div>
      </section>

      {/* Nutshell */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h2 className="cs-h">Проект в двух словах</h2></div>

          <Reveal className="cs-meta">
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Моя роль</div>
              <div className="cs-meta-v">UX-райтинг и ревью, оптимизация IA, микротексты и CTA на английском</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Сроки</div>
              <div className="cs-meta-v">Один вечер: ревью → согласование правок → повторная QA-проверка</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Инструменты</div>
              <div className="cs-meta-v">Google Docs (спеки + обоснование), Tilda (платформа сайта), Figma (быстрые макеты)</div>
            </div>
          </Reveal>

          <Reveal className="cs-chips cs-mt-m" style={{ justifyContent: "center" }}>
            {["Аудит", "UX-райтинг", "IA / Структура", "CTA и формы", "Локализация (EN)"].map((c) => (
              <span className="tag" key={c}>{c}</span>
            ))}
          </Reveal>

          <div className="cs-grid2 cs-mt-l">
            <Reveal>
              <h3 className="cs-h" style={{ fontSize: "1.25rem", marginBottom: ".8rem" }}>Вызовы</h3>
              <p className="cs-p">
                Отсутствие доступа к Tilda-аккаунту клиента, поэтому все изменения нужно было фиксировать
                в понятном документе с примерами и пояснениями. После внесения обновлений клиентом я провёл
                повторный QA, чтобы устранить недочёты и убедиться, что не было пропущено никаких важных правок.
              </p>
            </Reveal>
            <Reveal>
              <h3 className="cs-h" style={{ fontSize: "1.25rem", marginBottom: ".8rem" }}>Задача</h3>
              <p className="cs-p">
                Сделать за короткий срок так, чтобы сайт было легко и удобно использовать: упростить структуру,
                выделить офферы, сделать цены и расписание понятнее, оптимизировать сценарий записи и написать
                доступные, профессиональные тексты на английском для новых пользователей.
              </p>
            </Reveal>
          </div>

          <div className="cs-grid2 cs-mt-l" style={{ alignItems: "stretch" }}>
            <Reveal className="cs-panel">
              <h4>Основные достижения</h4>
              <ul className="cs-steps">
                {["Определил проблемные зоны и переписал все блоки от Hero до FAQ и CTA",
                  "Консолидировал информацию, снизив когнитивную нагрузку на ключевых страницах",
                  "Пересобрал иерархию CTA и сделал путь клиента к записи понятнее",
                  "Подготовил плейбук в Google Docs с вариантами «до/после» и пояснениями",
                  "Провёл вторичную QA-проверку, чтобы убедиться в отсутствии ошибок"].map((t) => (
                  <li className="cs-li" key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="cs-panel">
              <h4>Результаты</h4>
              <ul className="cs-steps">
                {["Онбординг стал плавнее: посетители быстрее находят информацию и цены за меньше кликов",
                  "Выверенные тексты на английском добавляют профессионализма",
                  "Более чёткий пользовательский путь привёл к росту обращений и записей",
                  "Сайт теперь воспринимается как дружелюбное приглашение, а не как головоломка"].map((t) => (
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
          <div className="cs-head"><h3 className="cs-h">Прозрачный процесс правок</h3></div>
          <p className="cs-p">
            Все рекомендации я собрал в едином Google Doc в простом и компактном формате: скриншот с яркими
            пометками, исходный текст и сразу новый предлагаемый вариант. Если требовалось стратегическое
            решение, я предлагал 2–3 чётких версии. В остальных случаях хватало одного ясного варианта, чтобы
            не перегружать клиента выбором, – он мог быстро выбрать и внедрить лучшую опцию.
          </p>
          <div className="cs-grid3 cs-mt-l">
            <Reveal>
              <ZoomImg src={BIMG + "Screenshot-Bachata-Doc.png"} alt="Спек-документ: скриншот с пометками, исходный текст, предлагаемая версия"
                caption="Пример флоу: предлагаемые правки, пояснения – такая структура помогла уложиться в срок."
                capAccent="Спек →" />
            </Reveal>
            <Reveal>
              <ZoomImg src={BIMG + "Screenshot-Bachata-Doc2.png"} alt="Спек-документ: варианты заголовков и CTA с обоснованием"
                caption="Я шёл блок за блоком и в первую очередь прорабатывал ключевые сценарии – пробные занятия и адрес." />
            </Reveal>
            <Reveal>
              <ZoomImg src={BIMG + "Screenshot-Bachata-Doc3.png"} alt="Спек-документ: финальный вариант текста с нотатами по внедрению"
                caption="Результат был заметен сразу после первых правок. Лендинг стал понятнее и дружелюбнее." />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Before → After */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head">
            <h3 className="cs-h">До → После: ключевые правки</h3>
          </div>
          <p className="cs-p">
            Чтобы показать результат работы с текстами и UX-дизайном, я выбрал три важных раздела сайта.
            Каждый пример показывает, как размытые, несогласованные или трудно читаемые блоки превратились
            в понятный и удобный для пользователя опыт.
          </p>
          <div className="ba2-stack cs-mt-l">
            {BA_PAIRS.map((p, i) => <BAToggle key={p.title} index={i + 1} {...p} />)}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Результаты</h3></div>
          <p className="cs-p">
            Всего за один вечер сайт стал понятнее, удобнее и помог бизнесу. Переработка убрала UX-барьеры,
            упростила поиск важной информации и сделала онлайн-образ школы профессиональнее. И самое главное –
            изменения увеличили количество записей на занятия, так как связаться с тренерами и забронировать
            место стало кратно проще.
          </p>
          <div className="cs-grid2 cs-mt-m">
            <ul className="cs-steps">
              {[["Юзабилити.", "Понятные CTA, согласованная вёрстка, на голову выше сканируемость блоков."],
                ["Ясность.", "Упрощённый язык, меньше двусмысленностей, структурированный контент-флоу."],
                ["Согласованность.", "Единый размер карточек, стиль заголовков и CTA для профессионального вида."]].map(([b, t]) => (
                <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
              ))}
            </ul>
            <ul className="cs-steps">
              {[["Действия.", "Сценарий записи стал заметным на всём сайте и начал работать на бизнес."],
                ["Доступность.", "Человечные формулировки без лишнего жаргона – удобны для новичков."],
                ["Бизнес-эффект.", "Упрощение бронирования привело к росту записей на занятия (по словам клиента)."]].map(([b, t]) => (
                <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Learnings */}
      <section className="cs-section">
        <div className="cs-prose">
          <div className="cs-head" style={{ justifyContent: "center" }}><h3 className="cs-h">Уроки</h3></div>
          <p className="cs-p" style={{ textAlign: "center" }}>
            Этот проект вновь показал, как UX-райтинг способен изменить продукт всего за несколько часов,
            а не недель. Чёткая структура, удобные для быстрого чтения блоки и продуманные CTA превратили
            сайт из перегруженного в ясный и полезный.
          </p>
          <ul className="cs-steps cs-mt-m">
            {[["Структура и читаемость.", "Блоки должны легко восприниматься с первого взгляда."],
              ["Конкретные CTA.", "Кнопки вроде «Записаться» помогают пользователю пройти основной сценарий."],
              ["Малые точечные правки.", "Изменения заголовков, размеров карточек и микротекстов могут дать большой эффект."],
              ["Документированный процесс.", "Наглядные «до/после» документы ускоряют внедрение даже без доступа к CMS."]].map(([b, t]) => (
              <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { BachataCase });
