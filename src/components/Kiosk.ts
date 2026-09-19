import countdown, { type Timespan } from "../lib/countdown";
import { Renderer } from "./Renderer";
import { toDate } from "../utils/date";

interface Count {
  date: Date;
  renderer: Renderer;
  slide: HTMLDivElement;
  text: HTMLDivElement;
  aspect: number;
}

export function setupKiosk(): void {
  const container = document.querySelector<HTMLElement>("#container")!;
  container.className = "kiosk";
  container.replaceChildren();

  const dialog = document.createElement("dialog");
  dialog.className = "kiosk-editor";
  dialog.setAttribute("aria-label", "Kiosk settings");
  dialog.innerHTML = `
    <form method="dialog">
      <label for="kiosk-counts">Counts</label>
      <p id="kiosk-help">One date per line: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.<br>
      Optionally add a format, e.g. 1988-10-12 | dhms, or paste a count URL.</p>
      <textarea id="kiosk-counts" aria-describedby="kiosk-help" rows="10" spellcheck="false" required></textarea>
      <div class="kiosk-options">
        <label>Seconds per count <input name="interval" type="number" min="1" step="1" value="10" required></label>
      </div>
      <p class="kiosk-error" role="alert"></p>
      <footer><span>E to edit · Double-click for fullscreen</span><button type="submit">Display</button></footer>
    </form>`;
  document.body.append(dialog);
  dialog.addEventListener("dblclick", (event) => event.stopPropagation());
  const input = dialog.querySelector("textarea")!;
  const error = dialog.querySelector<HTMLElement>(".kiosk-error")!;
  const params = new URLSearchParams(location.search);
  const saved = params.getAll("count");
  const intervalInput = dialog.querySelector<HTMLInputElement>(
    'input[name="interval"]',
  )!;
  const savedInterval = Number(params.get("interval") || 10);
  intervalInput.value = String(
    Number.isInteger(savedInterval) && savedInterval >= 1 ? savedInterval : 10,
  );
  input.value = (
    saved.length
      ? saved
      : [
          "1970-01-01",
          "1988-10-12",
          "2000-01-01",
          "2010-01-01",
          "2020-01-01",
          "2030-01-01",
        ]
  ).join("\n");
  let counts: Count[] = [];
  let interval = 10;
  let started = Date.now();
  let active = 0;

  function layout(): void {
    if (!counts.length) return;
    const fontSize = Math.min(
      (container.clientWidth * 0.9) / counts[active].aspect,
      (container.clientHeight * 0.8) / 1.2,
    );
    counts.forEach((count, i) => {
      count.slide.hidden = i !== active;
      count.text.style.fontSize = `${fontSize}px`;
    });
  }

  function render(): void {
    counts.forEach((count) => {
      count.text.innerHTML = count.renderer.html(
        countdown(count.date, null, count.renderer.units) as Timespan,
      );
    });
  }

  function measure(): void {
    // Reserve the widest digit in each position so ticking does not change
    // the type size. Measure using the actual font.
    const probe = document.createElement("div");
    probe.className = "kiosk-measure";
    container.append(probe);
    let widestDigit = "0";
    let digitWidth = 0;
    for (const digit of "0123456789") {
      probe.textContent = digit;
      const width = probe.getBoundingClientRect().width;
      if (width > digitWidth) {
        widestDigit = digit;
        digitWidth = width;
      }
    }
    counts.forEach((count) => {
      probe.innerHTML = count.text.innerHTML.replace(/\d/g, widestDigit);
      count.aspect = probe.getBoundingClientRect().width / 100;
    });
    probe.remove();
    layout();
  }

  function apply(): boolean {
    const lines = input.value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    try {
      if (!lines.length) throw new Error("Add at least one date.");
      const parsed = lines.map((line, i) => {
        const [value, shortFormat = "yowdhms", ...extra] = line
          .split("|")
          .map((part) => part.trim());
        const config = /^https?:\/\//.test(value)
          ? new URL(value).searchParams
          : null;
        const format = config?.get("format") || shortFormat;
        const date = config
          ? toDate({
              year: config.get("year") || "1970",
              month: config.get("month") || "January",
              day: config.get("day") || "01",
              hour: config.get("hour") || "00",
              minute: config.get("minute") || "00",
              second: config.get("second") || "00",
            })
          : new Date(value.length === 10 ? `${value}T00:00:00` : value);
        if (
          (!config &&
            !/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?)?$/.test(value)) ||
          !Number.isFinite(+date)
        ) {
          throw new Error(
            `Line ${i + 1}: enter a valid date as YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.`,
          );
        }
        if (!config) {
          const [year, month, day] = value.slice(0, 10).split("-").map(Number);
          if (
            date.getFullYear() !== year ||
            date.getMonth() + 1 !== month ||
            date.getDate() !== day
          ) {
            throw new Error(
              `Line ${i + 1}: that calendar date does not exist.`,
            );
          }
        }
        if (
          extra.length ||
          !/^[yowdhms]+$/.test(format) ||
          new Set(format).size !== format.length
        ) {
          throw new Error(
            `Line ${i + 1}: use each format letter at most once: y, o, w, d, h, m, s.`,
          );
        }
        return {
          date,
          renderer: new Renderer(format),
          bgcolor: config?.get("bgcolor"),
          color: config?.get("color"),
        };
      });
      interval = Number(intervalInput.value);
      started = Date.now();
      active = 0;
      container.replaceChildren();
      counts = parsed.map((item) => {
        const slide = document.createElement("div");
        slide.className = "kiosk-slide";
        slide.style.backgroundColor = item.bgcolor || "";
        slide.style.color = item.color || "";
        const text = document.createElement("div");
        text.className = "kiosk-count";
        slide.append(text);
        container.append(slide);
        return { ...item, slide, text, aspect: 1 };
      });
      render();
      measure();
      const url = new URL(location.href);
      url.searchParams.set("kiosk", "");
      url.searchParams.delete("layout");
      url.searchParams.set("interval", String(interval));
      url.searchParams.delete("count");
      lines.forEach((line) => url.searchParams.append("count", line));
      history.replaceState({}, "", url);
      error.textContent = "";
      return true;
    } catch (cause) {
      error.textContent = (cause as Error).message;
      return false;
    }
  }

  dialog.querySelector("form")!.addEventListener("submit", (event) => {
    event.preventDefault();
    if (apply()) dialog.close();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key.toLowerCase() === "e" &&
      !dialog.open &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey
    ) {
      event.preventDefault();
      dialog.showModal();
    }
  });
  const valid = apply();
  if (!saved.length || !valid) dialog.showModal();
  window.addEventListener("resize", layout);
  document.fonts.ready.then(() => {
    if (counts.length) measure();
  });
  setInterval(() => {
    const lengths = counts
      .map((count) => count.text.textContent!.length)
      .join(",");
    render();
    if (counts.length) {
      const next =
        Math.floor((Date.now() - started) / (interval * 1000)) % counts.length;
      if (next !== active) {
        active = next;
        layout();
      }
    }
    if (
      lengths !==
      counts.map((count) => count.text.textContent!.length).join(",")
    )
      measure();
  }, 1000);
}
