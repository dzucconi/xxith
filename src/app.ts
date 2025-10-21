import { configure } from "queryparams";
import { toDate, type DateParams } from "./utils/date";
import { fitText } from "./utils/fitText";
import { CountdownTimer } from "./components/CountdownTimer";

interface DisplayOptions {
  bgcolor: string;
  color: string;
}

interface AppParams extends DateParams, Partial<DisplayOptions> {
  format?: string;
}

export const App = {
  displayOptions(options: Partial<DisplayOptions>): void {
    const defaults: DisplayOptions = {
      bgcolor: "white",
      color: "black",
    };

    const finalOptions: DisplayOptions = { ...defaults, ...options };

    document.body.style.backgroundColor = finalOptions.bgcolor;
    document.body.style.color = finalOptions.color;
    fitText(document.body, 1.5);
  },

  initialize(): void {
    const { params } = configure<AppParams>({
      year: "1970",
      month: "January",
      day: "01",
      hour: "00",
      minute: "00",
      second: "00",
      format: "yowdhms",
      bgcolor: "white",
      color: "black",
    });

    new CountdownTimer("#count", toDate(params), params.format);

    this.displayOptions({
      color: params.color,
      bgcolor: params.bgcolor,
    });
  },
};
