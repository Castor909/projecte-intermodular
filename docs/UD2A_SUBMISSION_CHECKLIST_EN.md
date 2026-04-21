# UD2A Submission Checklist

## 1. Mandatory Deliverables (from UD2A brief)

1. Updated GitHub repository.
2. Updated project documentation (PDF or Markdown).
3. Updated Trello board.
4. Functional demonstration.

## 2. Current Repository Status

### 2.1 Code and Feature Status

Done and verifiable in code:
1. Catalog loaded from backend API.
2. Album detail page with cover, metadata, and Add to Cart.
3. Cart with quantity controls (+/-), remove, clear, total calculation, and persistence.
4. Stock-aware cart limits with user warning messages.
5. Basic MetaMask wallet connect/disconnect and account badge.
6. Catalog search, genre filter, and sorting.
7. API error contract hardening (400 invalid id, 404 missing id).

Not implemented (accepted if out of current scope):
1. Full on-chain payment transaction flow.
2. User authentication/registration.
3. Admin panel.

### 2.2 Verification Status

Last local verification:
1. `npm --prefix client run lint` passed with 1 non-blocking warning.
2. `npm --prefix client run build` passed.
3. `npm --prefix client run test:cart` passed.
4. `npm --prefix server run test:contracts` passed.

## 3. Documentation Package to Submit

Include these files in the repository and reference them in your final hand-in:
1. `docs/README.md` (project overview, status, setup, runtime notes).
2. `docs/UD2A_ENG.md` (translated UD2A assignment brief).
3. `docs/UD2A_PROGRESS_REPORT_EN.md` (UD2A implementation report).

Optional but useful for context:
1. `docs/UD1B_SPRINT_PLAN_EN.md` (previous phase planning).
2. `docs/Projecte_Intermodular_UD1B_EN.md` (previous phase criteria/context).

## 4. Trello Update Checklist (manual)

Before submission, update Trello cards so they match actual code state.

Recommended status mapping:
1. Move to Done: BK-01, BK-03, BK-05.
2. Move to In Progress / Partial: BK-02, BK-04, BK-06.
3. Keep in To Do: BK-07, BK-08, BK-09, BK-10, BK-11, BK-12.

For each completed card, add:
1. Short result summary.
2. Commit link (or PR link).
3. Completion date.

## 5. Demo Preparation (3-5 minutes)

Suggested flow:
1. Start backend and frontend.
2. Show catalog loading from API.
3. Open one album detail page.
4. Add item(s) to cart and change quantity.
5. Show stock limit warning behavior.
6. Open/close wallet connection in header.
7. Show cart persistence after page reload.

## 6. Final Pre-Submit Steps (manual)

1. Ensure Trello board is updated and public/accessible as required.
2. Ensure GitHub repository is pushed with latest commits.
3. Ensure docs are committed and match current behavior.
4. Perform one full demo rehearsal without manual fixes.
5. Submit repository link + documentation package according to class instructions.
