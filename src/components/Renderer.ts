import countdown from "countdown";
import { simpleTemplate } from "../utils/template";

interface UnitMap {
  [key: string]: keyof typeof countdown;
}

interface Periods {
  [key: string]: string;
}

export class Renderer {
  private formatString: string;
  public units: number;
  private periods: Periods;

  private readonly map: UnitMap = {
    y: "YEARS",
    o: "MONTHS",
    w: "WEEKS",
    d: "DAYS",
    h: "HOURS",
    m: "MINUTES",
    s: "SECONDS",
  };

  constructor(formatString: string) {
    this.formatString = formatString;
    this.units = this.parse(formatString);
    this.periods = this.createPeriods();
  }

  private parse(formatString: string): number {
    return formatString.split("").reduce((memo, unit) => {
      const unitKey = this.map[unit];
      const unitValue = countdown[unitKey] as number;
      return unitValue | memo;
    }, 0);
  }

  private pad(n: number): string {
    return n.toString().length === 1 && n < 10 ? `0${n}` : n.toString();
  }

  private wrap(unit: string): string {
    return `<span class="countdown__unit countdown__unit--${unit}"><%= ${unit} %></span>`;
  }

  private createPeriods(): Periods {
    return {
      y: this.wrap("years") + "y ",
      o: this.wrap("months") + "m ",
      w: this.wrap("weeks") + "w ",
      d: this.wrap("days") + "d ",
      h: this.wrap("hours"),
      m: this.wrap("minutes"),
      s: this.wrap("seconds"),
    };
  }

  public html(ts: countdown.Timespan): string {
    const separator =
      '<span class="countdown__separator countdown__separator--blink">:</span>';
    const data: Record<string, string | number> = {};

    ["hours", "minutes", "seconds"].forEach((period) => {
      const key = period as keyof countdown.Timespan;
      const value = ts[key];
      if (value !== undefined) {
        data[period] = this.pad(value as number);
      }
    });

    ["years", "months", "weeks", "days"].forEach((period) => {
      const key = period as keyof countdown.Timespan;
      const value = ts[key];
      if (typeof value === "number") {
        data[period] = value;
      }
    });

    const fragments: Periods = {};
    this.formatString.split("").forEach((unit) => {
      fragments[unit] = this.periods[unit];
    });

    const dateUnits: string[] = [];
    const timeUnits: string[] = [];

    Object.keys(fragments).forEach((key) => {
      if (["h", "m", "s"].includes(key)) {
        timeUnits.push(fragments[key]);
      } else {
        dateUnits.push(fragments[key]);
      }
    });

    const fragment = dateUnits.join("") + timeUnits.join(separator);

    return simpleTemplate(fragment, data);
  }
}
