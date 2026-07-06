import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Check, AlertCircle, Info, X } from "lucide-react";
import { font } from "../theme";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

const ToastCtx = createContext<(msg: string, type?: ToastType) => void>(() => {});

export function useToast() {
  return useContext(ToastCtx);
}

const ICON = {
  success: Check,
  error:   AlertCircle,
  info:    Info,
  warning: AlertCircle,
};

const COLORS = {
  success: { bg: "#00C896", text: "#000" },
  error:   { bg: "#FF4D4D", text: "#fff" },
  info:    { bg: "#FFFFFF", text: "#0D0D0D" },
  warning: { bg: "#F5A623", text: "#000" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2800);
  }, []);

  const dismiss = (id: number) => setToasts(t => t.filter(x => x.id !== id));

  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div style={{
        position: "fixed", bottom: 88, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 8, pointerEvents: "none", zIndex: 9999, padding: "0 24px",
      }}>
        {toasts.map(t => {
          const Icon = ICON[t.type];
          const c = COLORS[t.type];
          return (
            <div key={t.id} style={{
              background: c.bg, color: c.text,
              padding: "12px 18px", borderRadius: 32,
              display: "flex", alignItems: "center", gap: 10,
              fontFamily: font, fontSize: 14, fontWeight: 600,
              boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
              pointerEvents: "auto", cursor: "pointer",
              animation: "toastIn 200ms ease-out",
              maxWidth: 340,
            }} onClick={() => dismiss(t.id)}>
              <Icon size={16} strokeWidth={2.5} color={c.text} />
              <span>{t.message}</span>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes toastIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </ToastCtx.Provider>
  );
}
