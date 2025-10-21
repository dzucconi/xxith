export function fitText(element: HTMLElement, compressor: number = 1): void {
  const resizer = () => {
    const width = element.offsetWidth;
    element.style.fontSize = `${Math.max(
      Math.min(width / (compressor * 10), 1000),
      10
    )}px`;
  };

  resizer();
  window.addEventListener("resize", resizer);
  window.addEventListener("orientationchange", resizer);
}
