# Autoresearch: Add dues-dashboard features with tests

## Objective
Build real dues-dashboard features (dues list, CRUD operations, filtering/sorting) while maintaining build quality and test coverage. Each iteration adds meaningful functionality and corresponding tests.

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
No hard termination — loop continues indefinitely, adding features and tests. Each iteration must:
1. **Build passes** — `npm run build` exits with code 0, no errors
2. **Tests pass** — All existing tests must still pass (regression check)
3. **New content added** — Feature, component, or test added

## Metrics
- **Primary**: `test_count` (unitless, higher is better) — number of passing tests (proxy for feature completeness + quality)
  - **Current best**: 56 (from 2 baseline = +2700%)
- **Secondary**: `build_ok` (0 or 1, higher is better) — must stay at 1
- **Secondary**: `build_time_s` (lower is better) — must not regress significantly

## How to Run
```bash
./autoresearch.sh
```
Outputs `METRIC name=value` lines.

## Files in Scope
| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `postcss.config.mjs` | PostCSS plugin config |
| `next.config.ts` | Next.js config |
| `src/app/globals.css` | Global styles |
| `src/app/layout.tsx` | Root layout |
| `src/app/page.tsx` | Home page |
| `src/components/*` | Reusable UI components |
| `src/lib/*` | Data layer, hooks, utilities |
| `src/__tests__/*` | Test files |

## Off Limits
- `node_modules/` — never modify directly
- `.next/` — build artifacts

## Constraints
- Must use `npm` (not pnpm/yarn)
- Build must complete without errors
- All tests must pass — never regress
- New features must be accompanied by tests

## What's Been Tried (Phase 1 — Fix Build)

### Iteration 1 — ✅ Build passes
- **Fix**: Upgraded eslint `^8→^9`, added `@tailwindcss/postcss ^4`
- **Result**: Build passes in ~2.1s

### Iteration 2 — ✅ Tests added
- **Added**: vitest, testing-library, 2 smoke tests
- **Result**: 2 tests pass

## What's Been Tried (Phase 2 — Features)

### Iteration 3 — ✅ Data layer + display component
- **Added**: `src/lib/dues.ts` with types, CRUD functions, seed data
- **Added**: `DuesList` component with table, status badges, empty state
- **Added**: 9 data tests + 4 component tests
- **Result**: 15 total tests

### Iteration 4 — ✅ Status filtering tabs
- **Added**: `DuesFilter` component with All/Pending/Overdue/Paid tabs + count badges
- **Added**: 4 tests
- **Result**: 19 total tests

### Iteration 5 — ✅ Add dues form with validation
- **Added**: `DuesForm` component with name, amount, date validation
- **Added**: 5 tests (validation, submit, clear, error clearing)
- **Result**: 24 total tests

### Iteration 6 — ✅ Mark paid + form integration
- **Added**: Mark Paid button in DuesList, form toggling in home page
- **Added**: 4 tests
- **Result**: 28 total tests

### Iteration 7 — ✅ Column sorting
- **Added**: Clickable headers for name/amount/date/status, asc/desc toggle
- **Added**: 6 tests
- **Result**: 34 total tests

### Iteration 8 — ✅ Search by name
- **Added**: `DuesSearch` component with case-insensitive name filtering
- **Added**: 3 tests
- **Result**: 37 total tests

### Iteration 9 — ✅ Delete
- **Added**: deleteDues function, Delete button in DuesList
- **Added**: 4 tests
- **Result**: 41 total tests

### Iteration 10 — ✅ Edit
- **Added**: updateDues, DuesForm edit mode (initialData), Edit button
- **Added**: 8 tests
- **Build fix**: Missing getDuesById import (type error)
- **Result**: 49 total tests

### Iteration 11 — ✅ localStorage persistence
- **Added**: Save/load dues from localStorage, resetToDefaults
- **Added**: 4 tests
- **Result**: 53 total tests

### Iteration 12 — ✅ Data export
- **Added**: DuesExport component with JSON and CSV download
- **Added**: 3 tests
- **Result**: 56 total tests

## Final State
- ✅ Build passes
- ✅ 56 tests pass (14 test files)
- ✅ Full CRUD (Create, Read, Update, Delete)
- ✅ Status filtering tabs
- ✅ Column sorting (asc/desc)
- ✅ Search by name
- ✅ Inline Mark Paid
- ✅ Edit any entry
- ✅ localStorage persistence
- ✅ JSON and CSV export
- ✅ 11 components, 1 data module, 6 test files
