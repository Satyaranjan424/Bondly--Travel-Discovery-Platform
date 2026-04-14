import { createContext, useCallback, useMemo, useRef, useState } from "react";

const toastStyles = {
  signup: { title: "Account created", accent: "from-emerald-400 via-cyan-300 to-sky-500", ring: "ring-emerald-300/40" },
  login: { title: "Welcome back", accent: "from-sky-400 via-cyan-300 to-emerald-300", ring: "ring-sky-300/40" },
  update: { title: "Updated", accent: "from-amber-300 via-orange-300 to-rose-300", ring: "ring-amber-200/40" },
  submit: { title: "Submitted", accent: "from-fuchsia-300 via-pink-300 to-rose-300", ring: "ring-pink-200/40" },
  delete: { title: "Removed", accent: "from-rose-400 via-red-300 to-orange-300", ring: "ring-rose-300/40" },
  publish: { title: "Published", accent: "from-violet-400 via-fuchsia-300 to-pink-300", ring: "ring-violet-300/40" },
  save: { title: "Saved", accent: "from-yellow-300 via-amber-300 to-orange-300", ring: "ring-yellow-200/40" },
  follow: { title: "Connected", accent: "from-cyan-300 via-teal-300 to-emerald-300", ring: "ring-cyan-200/40" },
  unfollow: { title: "Unfollowed", accent: "from-slate-300 via-slate-200 to-zinc-100", ring: "ring-slate-200/40" },
  message: { title: "Message sent", accent: "from-indigo-300 via-sky-300 to-cyan-300", ring: "ring-indigo-200/40" },
};

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    const timeout = timeoutRef.current.get(id);
    if (timeout) {
      window.clearTimeout(timeout);
      timeoutRef.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(({ type = "submit", message }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const style = toastStyles[type] || toastStyles.submit;

    setToasts((current) => [
      ...current.slice(-2),
      { id, type, message, ...style },
    ]);

    const timeout = window.setTimeout(() => removeToast(id), 3400);
    timeoutRef.current.set(id, timeout);
  }, [removeToast]);

  const value = useMemo(() => ({ showToast, removeToast }), [removeToast, showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[120] flex justify-center px-4">
        <div className="flex w-full max-w-md flex-col gap-3">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className={`group w-full overflow-hidden rounded-[1.6rem] border border-white/15 bg-[#06101d]/92 text-left shadow-[0_28px_80px_rgba(2,6,23,0.44)] ring-1 backdrop-blur-2xl ${toast.ring}`}
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${toast.accent}`} />
                <div className="flex items-start gap-4 p-4">
                  <div className={`mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-sm font-semibold text-slate-950 ${toast.accent}`}>
                    {toast.title.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">{toast.title}</p>
                    <p className="mt-1 text-sm leading-6 text-white/72">{toast.message}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.24em] text-white/35 transition group-hover:text-white/60">Close</span>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
