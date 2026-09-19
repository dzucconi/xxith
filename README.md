# Multiple

His dreams were chaotic, but there was one constant: the ghostly countdown, suspended in midair. Even before he fell asleep, he had known he would dream of it. In his dreams, he attacked the countdown. Crazed, he tore at it, bit it, but every attempt failed to leave a mark. It continued to hang in the middle of his dream, steadily ticking away. Finally, just as the frustration became almost intolerable, he woke up. [...] Opening his eyes, he saw the ceiling, indistinct above him. The city lights outside the window cast a dim glow against it thougrough the curtains. But one thing did follow him from dream into reality: the countdown. It was still hovering before his eyes. The numbers were thin, but very bright with a burning, white glow.

## Meta

- **State**: production
- **Production**:
  - **URL**: https://www.xxith.com/
  - **URL**: https://xxith.work.damonzucconi.com/
- **Deploys**: Merged PRs to `master` are automatically deployed to production.

## Parameters

| Param     | Description                                    | Type     | Default     |
| --------- | ---------------------------------------------- | -------- | ----------- |
| `year`    | Target year                                    | `string` | `"1970"`    |
| `month`   | Target month (full name)                       | `string` | `"January"` |
| `day`     | Target day                                     | `string` | `"01"`      |
| `hour`    | Target hour (24-hour format)                   | `string` | `"00"`      |
| `minute`  | Target minute                                  | `string` | `"00"`      |
| `second`  | Target second                                  | `string` | `"00"`      |
| `format`  | Units to display (`y`/`o`/`w`/`d`/`h`/`m`/`s`) | `string` | `"yowdhms"` |
| `bgcolor` | Background color                               | `string` | `"white"`   |
| `color`   | Text color                                     | `string` | `"black"`   |

### Format String

The `format` parameter accepts a combination of the following characters:

- `y` — Years
- `o` — Months
- `w` — Weeks
- `d` — Days
- `h` — Hours
- `m` — Minutes
- `s` — Seconds

**Examples:**

- `yowdhms` — All units (default)
- `hms` — Hours, minutes, seconds only
- `dhms` — Days, hours, minutes, seconds

## Kiosk

Open `/?kiosk` to configure multiple counts. Enter one date or existing count URL per line. Dates use the kiosk computer's local timezone:

```text
1988-10-12
2030-01-01T00:00:00 | dhms
https://xxith.com/?year=2000&month=January&day=01&format=hms&bgcolor=black&color=white
```

The kiosk shows one count at a time, sized to the full screen, and loops through the list at the chosen interval (in seconds).

Press **E** to reopen the editor. Double-click the display to toggle fullscreen. Existing **B** / **F** color shortcuts set the overall background and foreground; colors in individual count URLs override those defaults.

The configuration is saved in the address, so bookmark or copy it to reopen the same display. Repeated `count` parameters store the entries, `interval` defaults to 10 seconds. A saved configuration starts displaying immediately; rotation restarts from the first count on reload. Ordinary single-count URLs continue to work.
