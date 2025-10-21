export interface DateParams {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
}

export function toDate(options: DateParams): Date {
  return new Date(
    `${options.month} ${options.day}, ${options.year} ${options.hour}:${options.minute}:${options.second}`
  );
}
