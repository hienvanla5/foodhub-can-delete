const containerId = "___toast_container";

function ensureContainer() {
  let c = document.getElementById(containerId);
  if (!c) {
    c = document.createElement("div");
    c.id = containerId;
    c.className = "toast-container";
    c.setAttribute("role", "status");
    c.setAttribute("aria-live", "polite");
    c.setAttribute("aria-atomic", "true");
    document.body.appendChild(c);
  }
  return c;
}

class ToastManager {
  constructor() {
    this.container = ensureContainer();
    this.toasts = new Map();
    this.counter = 0;
  }

  show(options = {}) {
    const {
      message = "",
      type = "info",
      timeout = 3000,
      dismissible = true,
      pauseOnHover = true,
    } = options;

    const id = `toast_${++this.counter}`;
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.setAttribute("role", "alert");
    el.setAttribute("tabindex", "0");
    el.dataset.id = id;

    const msgEl = document.createElement("div");
    msgEl.className = "message";
    msgEl.textContent = message;
    el.appendChild(msgEl);

    if (dismissible) {
      const btn = document.createElement("button");
      btn.className = "close";
      btn.type = "button";
      btn.setAttribute("aria-label", "Dismiss notification");
      btn.textContent = "×";
      btn.addEventListener("click", () => this._close(id));
      el.appendChild(btn);
    }

    this.container.appendChild(el);
    // force reflow then show
    requestAnimationFrame(() => el.classList.add("show"));

    let removed = false;
    let remaining = timeout;
    let started = Date.now();
    let timer = null;

    const startTimer = () => {
      if (timeout === 0) return;
      started = Date.now();
      timer = setTimeout(() => this._close(id), remaining);
    };

    const clearTimer = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      const elapsed = Date.now() - started;
      remaining = Math.max(0, remaining - elapsed);
    };

    if (pauseOnHover) {
      el.addEventListener("mouseenter", () => {
        clearTimer();
      });
      el.addEventListener("mouseleave", () => {
        startTimer();
      });
    }

    const closeFn = () => {
      if (removed) return;
      removed = true;
      el.classList.remove("show");
      el.classList.add("hide");
      el.addEventListener("transitionend", () => el.remove(), { once: true });
      this.toasts.delete(id);
    };

    this.toasts.set(id, { el, close: closeFn });
    // start timer
    if (timeout > 0) timer = setTimeout(() => this._close(id), remaining);

    return new Promise((resolve) => {
      this.toasts.get(id).resolve = resolve;
      this.toasts.get(id).timer = timer;
    });
  }

  _close(id) {
    const item = this.toasts.get(id);
    if (!item) return;
    const { el, close, timer, resolve } = item;
    if (timer) clearTimeout(timer);
    close();
    if (typeof resolve === "function") resolve(id);
  }

  clearAll() {
    for (const id of Array.from(this.toasts.keys())) this._close(id);
  }
}

const manager = new ToastManager();

export const toast = {
  show(msg, opts = {}) {
    return manager.show(Object.assign({ message: msg }, opts));
  },
  success(msg, timeout = 3000) {
    return manager.show({ message: msg, type: "success", timeout });
  },
  error(msg, timeout = 3000) {
    return manager.show({ message: msg, type: "error", timeout });
  },
  info(msg, timeout = 3000) {
    return manager.show({ message: msg, type: "info", timeout });
  },
  warn(msg, timeout = 3000) {
    return manager.show({ message: msg, type: "warn", timeout });
  },
  clearAll() {
    return manager.clearAll();
  },
};
