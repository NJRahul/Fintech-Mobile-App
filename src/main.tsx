import { createRoot } from "react-dom/client";
import { AppProvider } from "./store/AppContext";
import { ToastProvider } from "./app/components/Toast";
import App from "./app/App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </AppProvider>
);
