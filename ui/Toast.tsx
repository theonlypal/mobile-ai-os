"use client";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

type ToastMessage = { id: string; title: string; description?: string; tone?: "info" | "success" | "warn" };

interface ToastContextValue {
  toasts: ToastMessage[];
  push: (toast: Omit<ToastMessage, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const push = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, push, dismiss }}>
      {children}
      <div className="fixed bottom-24 left-0 right-0 flex flex-col gap-2 items-center z-50 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto card px-4 py-3 w-[90%] max-w-sm border ${
              toast.tone === "success"
                ? "border-emerald-500/50"
                : toast.tone === "warn"
                ? "border-amber-500/40"
                : "border-slate-700"
            }`}
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="font-semibold text-sm">{toast.title}</p>
                {toast.description && <p className="text-xs text-slate-300 mt-1">{toast.description}</p>}
              </div>
              <button className="text-xs text-slate-400" onClick={() => dismiss(toast.id)}>
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("ToastProvider missing");
  return ctx;
}
