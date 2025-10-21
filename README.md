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
