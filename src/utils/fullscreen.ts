/**
 * Toggles fullscreen mode for the document.
 * If currently in fullscreen, exits fullscreen.
 * If not in fullscreen, enters fullscreen mode.
 */
export function toggleFullscreen(): void {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}

/**
 * Sets up a double-click listener to toggle fullscreen mode.
 * @param element - The element to listen for double-clicks on (defaults to document.body)
 */
export function setupFullscreenOnDoubleClick(
  element: HTMLElement = document.body
): void {
  element.addEventListener("dblclick", toggleFullscreen);
}
