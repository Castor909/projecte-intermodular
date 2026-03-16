# UD1B Sprint Plan (VinylEth)

## Sprint Goal

Build and demonstrate one complete vertical slice of functionality so the project looks like a product in development, not only a prototype.

Main UD1B user flow:
1. The user opens the catalog.
2. The catalog is loaded from the backend API.
3. The user opens an album detail view.
4. The user adds the album to the cart.
5. The cart calculates totals and persists locally.

This directly addresses real progress, integration, and coherent application flow.

## Scope (This Sprint)

### Core Functionality
1. Backend + MongoDB with album data.
2. API endpoints for album list and album details.
3. Frontend integration with API instead of mock data.
4. Album detail page.
5. Local cart (add/remove/total + localStorage persistence).

### Out of Scope (Not in This Sprint)
1. Full blockchain payment flow.
2. User authentication.
3. Admin panel.

## Work Plan (5 Days)

## Day 1 - Backend Foundation

Tasks:
1. Configure environment variables: PORT, MONGO_URI.
2. Add MongoDB connection in a dedicated config module.
3. Create the Album model.
4. Add seed data (3-8 albums).

Expected outcome:
1. Server starts consistently.
2. Database connection is working.
3. The albums collection contains initial records.

Definition of Done:
1. No MongoDB connection errors at startup.
2. The database contains album documents.

## Day 2 - API Endpoints

Tasks:
1. Implement GET /api/albums.
2. Implement GET /api/albums/:id.
3. Add centralized error handling.
4. Verify CORS and response formats.

Expected outcome:
1. API returns album list and details.
2. Errors are handled in a predictable way.

Definition of Done:
1. GET /api/albums returns an array.
2. GET /api/albums/:id returns one object.
3. Invalid id returns a proper 4xx response.

## Day 3 - Frontend Integration

Tasks:
1. Move API calls into a service layer.
2. Remove mock data from the UI.
3. Load catalog from backend API.
4. Add loading/error/empty states.

Expected outcome:
1. Catalog renders from real API data.

Definition of Done:
1. If API is unavailable, the user sees a clear error message.
2. If catalog is empty, an empty state is displayed.

## Day 4 - Product Flow (Details + Cart)

Tasks:
1. Add album detail page.
2. Add Add to Cart action.
3. Implement cart logic: add/remove/qty/total.
4. Persist cart in localStorage.

Expected outcome:
1. End-to-end user flow from browsing to action is available.

Definition of Done:
1. At least 2 different albums can be added to the cart.
2. Total price is recalculated correctly.
3. Cart restores after page reload.

## Day 5 - Polish + Docs + Presentation

Tasks:
1. Refactor folder structure (components/pages/services).
2. Fix obvious UI/UX issues and verify mobile layout.
3. Update technical documentation.
4. Prepare Trello and demo script.

Expected outcome:
1. The project clearly shows progression from UD1A to UD1B.

Definition of Done:
1. Documentation is up to date and explains key decisions.
2. Trello matches the real task state.
3. A 3-5 minute demo rehearsal is completed.

## Architecture Changes

## Backend (Target Structure)

- server/
- server/config/db.js
- server/models/Album.js
- server/controllers/albumController.js
- server/routes/albumRoutes.js
- server/index.js

## Frontend (Target Structure)

- client/src/components/AlbumCard.jsx
- client/src/components/CartPanel.jsx
- client/src/pages/CatalogPage.jsx
- client/src/pages/AlbumDetailPage.jsx
- client/src/services/api.js
- client/src/App.jsx

## Git Strategy and Commit Examples

Principles:
1. One logical change set = one commit.
2. Commit message should state what changed and why.

Recommended commit style:
- feat: add albums api endpoints
- feat: connect catalog to backend api
- feat: implement album detail page
- feat: add local cart with persistence
- refactor: split app into pages and components
- docs: update ud1b technical documentation
- fix: handle api error states in catalog

Minimum for UD1B:
1. 6-10 meaningful commits.
2. Avoid large mixed commits that include unrelated changes.

## Trello Checklist (Minimum)

Done cards should include:
1. MongoDB connected and seeded.
2. API list/details for albums.
3. Frontend fetch integration.
4. Album detail page.
5. Cart logic and persistence.
6. Documentation updated.
7. Demo script prepared.

For each card:
1. Short result description.
2. Link to commit or PR.
3. Completion date.

## Technical Documentation Updates

Required sections:
1. What existed in UD1A and what was added in UD1B.
2. Architecture and module structure.
3. API contract (endpoints + response examples).
4. Problems and solutions (for example: CORS, error handling, data structure decisions).
5. What remains for the next phase.

## Demo Script (3-5 Minutes)

1. Briefly explain product goal.
2. Start backend and frontend.
3. Show catalog loaded from database (not mock data).
4. Open an album detail page.
5. Add multiple items to the cart.
6. Show total recalculation and persistence after reload.
7. Close with a clear UD1A vs UD1B improvement summary.

## Risks and Plan B

Risk 1: MongoDB availability issues.
- Plan B: local JSON seed + fallback read layer.

Risk 2: Not enough time for full routing/details page.
- Plan B: detail modal inside catalog page.

Risk 3: Not enough time for full cart flow.
- Plan B: minimum add/remove + total without quantity controls.

## Final UD1B Readiness Criteria

The sprint is considered ready when all conditions below are true:
1. At least one complete core flow exists from data source to user action.
2. Data comes from backend, and backend uses database.
3. Architecture is cleaner and clearer than in UD1A.
4. Trello, Git, and docs confirm actual progress.
5. Demo runs smoothly without manual workarounds.
