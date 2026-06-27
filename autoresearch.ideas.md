# Deferred Ideas

## Implemented
- ✅ Search/filter by name (DuesSearch component, 3 tests)
- ✅ Edit dues entry (DuesForm edit mode, updateDues, 8 tests)
- ✅ Delete dues entry (deleteDues, Delete button, 4 tests)
- ✅ Column sorting (name/amount/date/status, asc/desc toggle, 6 tests)
- ✅ Status filtering tabs (All/Pending/Overdue/Paid, 4 tests)
- ✅ Add dues form with validation (DuesForm, 5 tests)
- ✅ Mark as paid button (in DuesList, 4 tests)

## Future
- **LocalStorage persistence** — save/load dues from localStorage so data survives page refresh
- **MongoDB persistence** — mongoose already in deps. Requires API routes, env vars, async refactoring
- **Data export** — download dues as CSV or JSON file
- **Pagination** — for large numbers of dues entries
- **Dark mode toggle** — manual toggle (currently follows system preference)
