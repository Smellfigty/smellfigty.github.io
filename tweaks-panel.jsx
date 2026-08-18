/* tweaks-panel.jsx — production settings store.

   app.jsx depends on the useTweaks() hook to hold a few site settings
   (theme palette, accent, card style, about-photo, motion). This file
   provides that hook. The interactive dev-only Tweaks panel UI is not
   shipped to production; this keeps a small, localStorage-persisted
   store so in-page controls (e.g. the light/dark theme toggle in the
   nav) keep working and survive a reload.

   Loaded before app.jsx, so `useTweaks` is in scope when <App> renders.
   `useState`/`useCallback` come from core.jsx's `const {…} = React;`. */

const TWEAKS_STORE_KEY = "alexmedved.tweaks";

function useTweaks(defaults) {
  const read = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(TWEAKS_STORE_KEY) || "{}");
      return { ...defaults, ...(saved && typeof saved === "object" ? saved : {}) };
    } catch (e) {
      return { ...defaults };
    }
  };

  const [tweaks, setTweaks] = useState(read);

  const setTweak = useCallback((keyOrObj, value) => {
    setTweaks((prev) => {
      const next =
        keyOrObj && typeof keyOrObj === "object"
          ? { ...prev, ...keyOrObj }
          : { ...prev, [keyOrObj]: value };
      try {
        localStorage.setItem(TWEAKS_STORE_KEY, JSON.stringify(next));
      } catch (e) {
        /* storage unavailable (private mode) — keep state in memory */
      }
      return next;
    });
  }, []);

  return [tweaks, setTweak];
}
