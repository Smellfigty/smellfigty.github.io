/* gaming-content.ru.jsx – Russian edition of the B2B mobile gaming platform case study.
   Same structure & components as gaming-content.jsx / .de.jsx, Russian copy sourced from the
   live ru/case-study-gaming.html. Exports <GamingCase/>.
   Depends on core.jsx + casestudy-shared.jsx. The page shell lives in casestudy-gaming.jsx. */

const GIMG = "../assets/";

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

const CYCLE = ["Empathize", "Define", "Ideate", "Prototype", "Test"];
function CycleStrip() {
  return (
    <Reveal className="gm-cycle" role="list" aria-label="Цикл дизайн-мышления" style={{ justifyContent: "center" }}>
      {CYCLE.map((s, i) => (
        <React.Fragment key={s}>
          <span className="gm-cycle-step" role="listitem">
            <span className="gm-cycle-n">{String(i + 1).padStart(2, "0")}</span>{s}
          </span>
          {i < CYCLE.length - 1 && <span className="gm-cycle-arr" aria-hidden="true">→</span>}
        </React.Fragment>
      ))}
      <span className="gm-cycle-loop" aria-hidden="true" title="Повторять до решения">↻</span>
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
                <Reveal><MonoLabel>Кейс · B2B Mobile Gaming</MonoLabel></Reveal>
                <Reveal as="span" className="mono-sm" style={{ color: "var(--ink-faint)" }}>· 2024 · NDA</Reveal>
              </div>
              <Reveal as="h1" className="cs-title">Игровая платформа,<br /><span className="accent">построенная с нуля.</span></Reveal>
              <Reveal as="p" className="cs-sub">Новый старт и большой вызов</Reveal>
              <Reveal as="p" className="cs-lead">
                Название бренда, маскот и довольно абстрактное направление – вот и весь бриф. Всё остальное,
                от тона коммуникации (ToV) до готового продукта, нужно было создавать с нуля. NeoGroup доверила
                мне и команде воплотить идею в жизнь – с продуманным UX с самого первого решения.
              </Reveal>
              <Reveal as="p" className="gm-nda-note">
                <span className="gm-nda">NDA</span> По соображениям конфиденциальности я не могу показывать реальные рабочие материалы – но здесь достаточно, чтобы проследить мой вклад, процесс и подход к открытой дизайнерской задаче.
              </Reveal>
            </div>
            <Reveal>
              <Fig src={GIMG + "B2B-Platform-UI.png"} alt="Полу-lo-fi вайрфрейм UI платформы"
                caption="Фрагмент полу-lo-fi вайрфрейма для проверки структуры, отступов и поведения компонентов перед созданием финального hi-fi-прототипа." />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Animated stat band */}
      <section className="cs-section gm-stats-sec">
        <div className="cs-wrap">
          <Reveal className="cs-head">
            <h2 className="cs-h">В цифрах</h2>
          </Reveal>
          <div className="gm-statband">
            <Stat pre="~" to={4} suf=" мес" label="До MVP1 – запущен в срок" />
            <Stat to={3} label="Языка запуска · EN / DE / RU" />
            <Stat to={20} label="Страниц ToV" />
            <Stat to={3} label="ключевых флоу проработано (ownership)" />
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
              <div className="cs-meta-v">UX-дизайнер и писатель · Ответственный за Tone of Voice · Лид локализации (EN → DE/RU)</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Сроки</div>
              <div className="cs-meta-v">MVP1 за ~4 месяца → дальнейшее итеративное улучшение</div>
            </div>
            <div className="cs-meta-cell">
              <div className="cs-meta-k">Рынки</div>
              <div className="cs-meta-v">Фокус на ЕС (DE, ES, IT, FR) + СНГ</div>
            </div>
          </Reveal>

          <Reveal className="cs-chips cs-mt-m" style={{ justifyContent: "center" }}>
            {["Tone of Voice", "Регистрация и онбординг", "Платежи", "Лояльность и кешбэк", "Рефералы",
              "Достижения", "Сезонные ивенты", "Локализация"].map((c) => (
              <span className="tag" key={c}>{c}</span>
            ))}
          </Reveal>

          <div className="cs-grid2 cs-mt-l" style={{ alignItems: "stretch" }}>
            <Reveal className="cs-panel" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h4>Команда и взаимодействие</h4>
              <p className="cs-p">
                Работа с Head of UX, <span className="accent">2</span> UX-исследователями,{" "}
                <span className="accent">2</span> дизайнерами, координатором платформ и{" "}
                <span className="accent">3</span> разработчиками.
              </p>
              <p className="cs-p">
                Был одним из <strong>трёх членов команды UX-ревью</strong>, наставником{" "}
                <strong>4 джуниоров</strong> и согласовывал работу с юристами, комплаенсом и менеджерами по странам.
              </p>
            </Reveal>
            <Reveal className="cs-panel cs-panel-accent">
              <h4>Мои основные достижения</h4>
              <ul className="cs-steps">
                {["Определил Tone of Voice, ставший корпоративным стандартом для всех локалей",
                  "Запустил MVP1 в срок на EN/DE/RU с доведёнными до идеала ключевыми сценариями",
                  "Выпустил функции вовлечения – достижения, рефералы – повысившие удержание",
                  "Сократил локализацию с дней до часов за счёт масштабируемого процесса"].map((t) => (
                  <li className="cs-li" key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal className="gm-tools cs-mt-m">
            <span className="gm-tools-k">Инструменты</span>
            <span className="gm-tools-v">Figma · Miro · Jira · Notion · Trello · внутренние микросервисы для локализации · GPT-4 / 3.5 для генерации идей</span>
          </Reveal>
        </div>
      </section>

      {/* Starting point */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-grid2">
            <div>
              <div className="cs-head"><h3 className="cs-h">Отправная точка</h3></div>
              <p className="cs-p">
                Первая фаза была про ответы: за что должен стоять бренд, какой опыт создать и как говорить
                с аудиторией на одном языке. Настоящий вызов был не в производстве ассетов, а в том, чтобы
                задавать правильные вопросы, тестировать подходы и выстроить понятный план для решений
                в дизайне, контенте и продукте на месяцы вперёд.
              </p>
              <h4 className="gm-subh">Главные приоритеты</h4>
              <p className="cs-p">
                Определить роль бренда, исследовать направления и выстроить фундамент, который сочетал бы
                аутентичность, требования регуляторов и вовлечённость пользователей – как базу для всего, что последует.
              </p>
            </div>
            <Reveal className="cs-panel">
              <h4>Ключевые цели</h4>
              <ul className="cs-steps">
                {[["Привлечь регистрации.", "Сделать регистрацию очевидным шагом с минимальным трением."],
                  ["Стимулировать первые депозиты.", "Быстро и уверенно приводить новых пользователей к ценности."],
                  ["Соответствовать требованиям.", "Выполнять регуляторные нормы целевых рынков – Германия, Испания, Италия, Франция…"]].map(([b, t]) => (
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
          <div className="cs-head"><h3 className="cs-h">Итеративный принцип работы</h3></div>
          <p className="cs-p" >
            На первом этапе тестирования я подробно описал и проанализировал пользовательские сценарии.
            Это выявило, что вредило UX – несостыковки во флоу, технические баги и UI-решения, делавшие
            опыт менее интуитивным, чем хотелось бы. Мы прорабатывали их в структурированном цикле
            дизайн-мышления, повторяя его, пока проблемы не были решены, а продукт оставался согласован
            с реальными потребностями пользователей.
          </p>
          <CycleStrip />
          <p className="cs-p cs-mt-m" >
            Благодаря этому процессу команда в рекордные сроки выпустила <span className="accent">качественный,
            полностью готовый к запуску продукт</span> – без компромиссов в UX и доступности.
          </p>
          <Reveal className="cs-mt-l">
            <Fig src={GIMG + "Screenshot-Figma.png"} alt="Реконструкция ранних этапов проекта в Figma"
              caption="Реконструкция первых этапов: сторифреймы, первоначальное определение Tone of Voice и lo-fi прототипы с черновыми текстами. Иллюстративный пример, поскольку контракт запрещает делиться оригинальными внутренними файлами."
              capAccent="Ранние этапы →" />
          </Reveal>
        </div>
      </section>

      {/* Tone of Voice */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-grid2" style={{ alignItems: "center" }}>
            <Reveal>
              <Fig src={GIMG + "Screenshot-Figma2.png"} alt="Реконструкция фазы определения ToV"
                caption="Реконструкция первой фазы (define), где мы заложили основу Tone of Voice – опору для каждого последующего решения в дизайне и контенте." />
            </Reveal>
            <div>
              <div className="cs-head"><h3 className="cs-h">Голос продукта (Tone of Voice)</h3></div>
              <p className="gm-quote">Ясность превыше <span className="accent">желаемых фривольностей.</span></p>
              <p className="cs-p cs-mt-s">
                Голос бренда я определил рано – всегда инклюзивный, дружелюбный и ориентированный на пользователя.
                Полный документ по ToV насчитывал <span className="accent">более 20 страниц</span>: основы, правила,
                примеры, пунктуация и даже «писать ли Ё или нет?». Понимая, что никто не прочтёт такое от начала
                до конца, я превратил его в <span className="accent">краткий справочник из 17 слайдов</span> для всей компании.
              </p>
              <p className="cs-p">
                Под моим руководством он был локализован и адаптирован под каждый рынок при участии менеджеров
                стран и переводчиков – сохраняя последовательность и культурную релевантность для каждого пользователя.
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
              <div className="cs-head"><h3 className="cs-h">MVP1 – не предел</h3></div>
              <p className="cs-p">
                Для MVP1 я отвечал за ключевые флоу: регистрацию, онбординг, платежи, первые промо и локализацию
                на английский, немецкий и русский. Релиз вышел в срок и в полном соответствии требованиям регуляторов.
              </p>
              <p className="cs-p">
                После запуска работа не закончилась. Как один из трёх участников команды UX-ревью, я проверял
                каждую новую фичу перед разработкой. Параллельно я отвечал за ключевые сценарии –{" "}
                <strong>программу лояльности, реферальную программу, достижения, адвент-календарь</strong> – и
                несколько пока неанонсированных функций, каждая из которых проходила исследование → прототипирование → тестирование → доработку.
              </p>
              <p className="cs-p">
                Я следил, чтобы продукт развивался
                <span className="accent"> естественно и удобно для пользователей</span> – как опыт, созданный
                конвертировать и удерживать игроков, оставаясь интуитивным.
              </p>
            </div>
            <Reveal>
              <Fig src={GIMG + "Important-Lo-Fi.png"} alt="Воссозданные lo-fi вайрфреймы – мобильный лидерборд и веб-флоу"
                caption="Воссозданные lo-fi вайрфреймы: эксперимент с лидербордом на телефоне и веб-прототип инструкций для работы с приложением." />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="cs-section">
        <div className="cs-wrap">
          <div className="cs-head"><h3 className="cs-h">Результаты</h3></div>
          <p className="cs-p" >
            Это был междисциплинарный проект – шанс примерить новые роли и определять дизайн, контент и продукт
            в целом, влияя и на пользовательский опыт, и на коммуникацию бренда. Ключевые результаты:
          </p>
          <div className="cs-grid2 cs-mt-m">
            <ul className="cs-steps">
              {[["Рост вовлечённости и удержания.", "Функции вроде достижений привели к заметному росту регистраций, первых депозитов и недельного удержания."],
                ["Установлен голос бренда.", "ToV стал корпоративным стандартом в продукте, маркетинге и поддержке – придав бренду человечность и доверие."],
                ["Ускоренная локализация.", "Масштабируемый процесс сократил локализацию новых фич с дней до часов без потери качества и соответствия."]].map(([b, t]) => (
                <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
              ))}
            </ul>
            <ul className="cs-steps">
              {[["Межкомандное взаимодействие.", "Работа на стыке UX, дизайна и комплаенса, чтобы фичи соответствовали опыту, бизнесу и требованиям регуляторов."],
                ["Развитие команды.", "Обучил и направлял 4 джуниоров, внедрил практики ревью и превратил контент в стратегический актив продукта."],
                ["Реализация ключевых флоу.", "Совместно вёл решения по лояльности, рефералам и сезонным промо – делая контент и UX неотъемлемой частью стратегии."]].map(([b, t]) => (
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
            Создание этой платформы стало настоящим интенсивом по выпуску и продукта, и бренда с нуля. Оно
            вырастило меня из UX-дизайнера в стратегического партнёра по дизайну, комплаенсу и развитию.
          </p>
          <ul className="cs-steps cs-mt-m">
            {[["Баланс креатива и требований.", "Делать коммуникацию живой и при этом соблюдать строгие правила и бизнес-требования – решения, которые устраивают всех."],
              ["Масштабировать единый голос.", "Написать гайдлайны ToV – одно; сохранить их по странам и языкам, не теряя сути – совсем другое."],
              ["Мыслить как владелец продукта.", "Команда UX-ревью научила меня решать как стратег – взвешивая потребности пользователей, бизнес-цели и техническую реализуемость."],
              ["Лидерство через контент.", "Наставничество и кросс-функциональная работа показали: лидерство в контенте формирует процессы, фичи и даже культуру."]].map(([b, t]) => (
              <li className="cs-li" key={b}><strong>{b}</strong> {t}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { GamingCase });
