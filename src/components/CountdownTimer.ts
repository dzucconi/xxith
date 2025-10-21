import countdown from "../lib/countdown";
import { Renderer } from "./Renderer";

export class CountdownTimer {
  private el: HTMLElement;
  private timerId: number;

  constructor(selector: string, date: Date, formatString?: string) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element ${selector} not found`);
    }
    this.el = element as HTMLElement;

    const renderer = new Renderer(formatString || "yowdhms");

    this.timerId = countdown(
      date,
      (ts) => {
        this.el.innerHTML = renderer.html(ts);
      },
      renderer.units
    ) as number;
  }

  public stop(): void {
    if (typeof this.timerId === "number") {
      countdown(this.timerId);
    }
  }
}
