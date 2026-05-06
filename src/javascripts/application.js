import "@hotwired/turbo";
import Alpine from "alpinejs";
import videoPlayer from "./video_player";
import './controllers';

Alpine.data("videoPlayer", videoPlayer);
window.Alpine = Alpine;

// Matrix interactions
Alpine.store("matrixModal", {
  opened: null,
  open(id) {
    this.opened = id;
  },
  close() {
    this.opened = null;
  },
});

Alpine.store("matrixPlayer", {
  audio: null,
  title: null,
  ensure() {
    if (!this.audio) {
      this.audio = new Audio();
    }
  },
  play(url, title) {
    this.ensure();
    this.audio.src = url;
    this.title = title || null;
    this.audio.play();
  },
  pause() {
    if (this.audio) this.audio.pause();
  },
});

Alpine.store("matrixCalendar", {
  add({ title, start, end, location }) {
    const text = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Baklib Matrix//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${(title || "").replaceAll("\n", " ")}`,
      start ? `DTSTART:${start.replaceAll(/[-:]/g, "").replaceAll(".000Z", "Z")}` : "",
      end ? `DTEND:${end.replaceAll(/[-:]/g, "").replaceAll(".000Z", "Z")}` : "",
      location ? `LOCATION:${location.replaceAll("\n", " ")}` : "",
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\n");

    const blob = new Blob([text], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "event.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
});

window.matrixTagFilter = function matrixTagFilter() {
  const normalize = (t) => (t || "").trim();
  const parseCsv = (s) =>
    (s || "")
      .split(",")
      .map((x) => normalize(x))
      .filter(Boolean);

  const api = {
    activeTags: [],
    toggle(tag) {
      const t = normalize(tag);
      if (!t) return;
      const i = this.activeTags.indexOf(t);
      if (i >= 0) this.activeTags.splice(i, 1);
      else this.activeTags.push(t);
      this.apply();
    },
    isActive(tag) {
      const t = normalize(tag);
      return this.activeTags.includes(t);
    },
    clear() {
      this.activeTags = [];
      this.apply();
    },
    apply() {
      const container =
        this.$root?.closest("[data-matrix-filter-container]") ||
        document.querySelector("[data-matrix-filter-container]");
      const root = container?.parentElement || document;
      const items = root.querySelectorAll("[data-matrix-item]");
      items.forEach((el) => {
        if (this.activeTags.length === 0) {
          el.classList.remove("hidden");
          return;
        }
        const tags = parseCsv(el.getAttribute("data-tags"));
        const ok = this.activeTags.every((t) => tags.includes(t));
        el.classList.toggle("hidden", !ok);
      });
    },
  };

  return api;
};

Alpine.start();

(function () {
  // 定义 themeSwitcher class，用于切换主题
  class ThemeSwitcher {
    toggleTheme(name) {
      // console.log("toggleTheme", name)
      if (name === "dark" || name === "light") {
        document.documentElement.dataset.theme = name;
        localStorage.theme = name;
      } else {
        document.documentElement.removeAttribute("data-theme");
        localStorage.removeItem("theme");
      }
    }

    get storedTheme() {
      const theme = localStorage.theme;
      if (theme === "dark" || theme === "light") {
        return theme;
      }
      return null;
    }

    init() {
      // console.log("init theme switcher", this.storedTheme)
      const theme = this.storedTheme;
      if (theme) {
        this.toggleTheme(theme);
      }
      document
        .querySelectorAll(
          'input.theme-controller[type="checkbox"][value="dark"]',
        )
        .forEach((controller) => {
          controller.checked = this.storedTheme === "dark";
          this.mount(controller);
        });
    }

    mount(controller) {
      // console.log("mount theme controller")
      controller.addEventListener("click", (e) => {
        // console.log("click theme controller")
        localStorage.theme = e.target.checked ? "dark" : "light";
        this.toggleTheme(localStorage.theme);
      });
      const theme = this.storedTheme;
      if (theme) {
        this.toggleTheme(theme);
        controller.checked = theme === "dark";
      } else {
        controller.checked = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
      }
    }
  }

  window.themeSwitcher = new ThemeSwitcher();
  window.themeSwitcher.init();
  document.addEventListener("turbo:load", () => {
    window.themeSwitcher.init();
  });
})();
