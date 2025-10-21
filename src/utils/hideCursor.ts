export function hideCursor(element: HTMLElement, delay: number = 3000): void {
  let timeoutId: number | null = null;

  const hide = () => {
    element.classList.add("hide-cursor");
  };

  const show = () => {
    element.classList.remove("hide-cursor");
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(hide, delay);
  };

  element.addEventListener("mousemove", show);
  timeoutId = window.setTimeout(hide, delay);
}
