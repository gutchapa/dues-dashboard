# Autoresearch: Fix dues-dashboard Build & Tests

## Objective
Resolve all build errors, timeouts, and configuration issues in the Next.js dues-dashboard project. The app must build successfully and test cases must pass.

## Tools Used in Loop Engg
| Tool | Purpose |
|------|---------|
| `read` | Examine source files to understand root cause of errors |
| `bash` | Run shell commands (install, build, test) |
| `edit` | Make precise code/config changes |
| `write` | Create new files (autoresearch.sh, new test files, new components) |
| `init_experiment` | Initialize session with metric config |
| `run_experiment` | Run the benchmark command with timing |
| `log_experiment` | Record result (keep/discard) with ASI annotations |

## Termination Condition
The loop terminates when ALL of:
1. **Build passes** — `npm run build` exits with code 0, no errors
2. **Test cases pass** — All project test cases run successfully

Once both conditions are met, the loop stops and reports success.

## Metrics
- **Primary**: `build_ok` (0 or 1, higher is better) — 1 = build passes
- **Secondary**: `build_time_s` (lower is better, once build works)
- **Secondary**: `tests_ok` (0 or 1, higher is better) — 1 = tests pass
- **Secondary**: `tests_count` (number of test cases that passed)

## How to Run
```bash
./autoresearch.sh
```
Outputs `METRIC name=value` lines.

## Files in Scope
| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts — needs `@tailwindcss/postcss` added |
| `postcss.config.mjs` | PostCSS plugin config — references `@tailwindcss/postcss` |
| `tailwind.config.js` | Tailwind config — may need updates for v4 |
| `next.config.ts` | Next.js config — may need `turbopack.root` to fix workspace warning |
| `src/app/globals.css` | Global styles — uses `@import "tailwindcss"` (v4 syntax) |
| `src/app/layout.tsx` | Root layout |
| `src/app/page.tsx` | Home page |
| Any new test files added |

## Off Limits
- `node_modules/` — never modify directly
- `.next/` — build artifacts

## Constraints
- Must use `npm` (not pnpm/yarn)
- Must not remove existing dependencies — only add what's missing
- Build must complete without errors
- All tests must pass

## Current Errors (Baseline)
1. **Missing dependency**: `@tailwindcss/postcss` is not installed but required by `postcss.config.mjs`
2. **npm workspace warning**: Next.js detects multiple lockfiles — suggests setting `turbopack.root`
3. **Tailwind v4 config**: `tailwind.config.js` uses old v3 `module.exports` format, while `globals.css` uses new v4 `@import "tailwindcss"` syntax

## What's Been Tried
*(Initially empty — filled as experiments accumulate)*
