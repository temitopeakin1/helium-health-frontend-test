# NOTES

**AI tools:** Cursor (Claude) for scaffolding, async race handling, Vitest setup, and test fixes.

**Commands & results:**
- `npm test` — 2 mock contract tests pass; 2 app tests pass (account-switch race, rejected create).
- `npm run build` — succeeds.
- `npm start` → http://127.0.0.1:4173 (manual: create/approve, Tab through controls, `workplaceApi.failNext(503|422)` in DevTools).

**Time spent:** ~60 minutes (setup, implementation, tests, NOTES).

**Known limits:** Singleton mock API state persists across Vitest runs; no E2E browser automation in CI. Approve errors show a shared banner, not per-row.

**AI suggestion verified:** Initial tests used `waitFor` with fake timers and timed out; replaced with `act` + `vi.advanceTimersByTimeAsync` and synchronous assertions. Also moved `failNext(422)` after the initial list load so it targets create, not list.

**State ownership:** `useWorkplaceBoard` owns account index, list phase/records, create/approve pending flags, and `sessionRef` for stale-response guards. Form title draft lives in the hook (cleared on account change); idempotency key lives in a ref (stable on retry, rotated after success).
