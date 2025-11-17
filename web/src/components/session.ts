import { atom } from "nanostores";

interface SessionState {
  locale: string;
  damageMode: string;
  cronExpression: string;
}

// Función para parsear el hash
function parseHash(): SessionState {
  const hash = window.location.hash.slice(1); // Remover el #
  const params = new URLSearchParams(hash);

  return {
    locale: params.get("locale") || "en",
    damageMode: params.get("damagemode") || "normal",
    cronExpression: params.get("cron") || "* * * * *",
  };
}

// Función para actualizar el hash
function updateHash(state: SessionState): void {
  const params = new URLSearchParams();
  params.set("locale", state.locale);
  params.set("damagemode", state.damageMode);
  params.set("cron", state.cronExpression);

  window.location.hash = params.toString();
}

// Crear el átomo con el estado inicial
export const sessionStore = atom<SessionState>(parseHash());

// Escuchar cambios en el hash
if (typeof window !== "undefined") {
  let isUpdatingFromHash = false;

  window.addEventListener("hashchange", () => {
    if (!isUpdatingFromHash) {
      sessionStore.set(parseHash());
    }
  });

  // Suscribirse a cambios en el store para actualizar el hash
  sessionStore.subscribe((state) => {
    const currentHash = window.location.hash.slice(1);
    const params = new URLSearchParams();
    params.set("locale", state.locale);
    params.set("damagemode", state.damageMode);
    params.set("cron", state.cronExpression);

    const newHash = params.toString();

    // Solo actualizar si el hash es diferente para evitar loops
    if (currentHash !== newHash) {
      isUpdatingFromHash = true;
      updateHash(state);
      setTimeout(() => {
        isUpdatingFromHash = false;
      }, 0);
    }
  });
}
