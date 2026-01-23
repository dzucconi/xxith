/**
 * Creates a hidden color input that triggers a callback on change.
 */
function createColorPicker(onInput: (color: string) => void): HTMLInputElement {
  const input = document.createElement("input");
  input.type = "color";
  input.style.position = "absolute";
  input.style.bottom = "0";
  input.style.left = "20px";
  input.style.opacity = "0";
  input.style.pointerEvents = "none";
  document.body.appendChild(input);

  input.addEventListener("input", (e) => {
    onInput((e.target as HTMLInputElement).value);
  });

  return input;
}

/**
 * Updates a query parameter without reloading the page.
 */
function updateQueryParam(key: string, value: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.replaceState({}, "", url.toString());
}

/**
 * Sets up keyboard shortcuts for color pickers.
 * - 'b' opens background color picker
 * - 'f' opens foreground (text) color picker
 */
export function setupColorPickers(): void {
  const bgPicker = createColorPicker((color) => {
    document.body.style.backgroundColor = color;
    updateQueryParam("bgcolor", color);
  });

  const fgPicker = createColorPicker((color) => {
    document.body.style.color = color;
    updateQueryParam("color", color);
  });

  const openPicker = (
    picker: HTMLInputElement,
    getCurrentColor: () => string,
  ) => {
    picker.value = rgbToHex(getCurrentColor());
    picker.click();
  };

  document.addEventListener("keydown", (e) => {
    // Ignore if user is typing in a text input
    if (
      (e.target instanceof HTMLInputElement && e.target.type !== "color") ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    if (e.key === "b" || e.key === "B") {
      openPicker(
        bgPicker,
        () => getComputedStyle(document.body).backgroundColor,
      );
    } else if (e.key === "f" || e.key === "F") {
      openPicker(fgPicker, () => getComputedStyle(document.body).color);
    }
  });
}

/**
 * Converts an RGB color string to hex format.
 */
function rgbToHex(rgb: string): string {
  // Handle already-hex values
  if (rgb.startsWith("#")) {
    return rgb;
  }

  // Parse rgb(r, g, b) format
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!match) {
    return "#000000";
  }

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);

  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}
