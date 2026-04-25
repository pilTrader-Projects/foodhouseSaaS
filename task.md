# Project: FoodHouse SaaS - Phase 5 (Dashboard Layer)

## Status: IN PROGRESS
**Persona in Charge:** PM

## Objective
Visualize the transaction pipeline and consolidated analytics through a modern, responsive web dashboard.

## Task List
- [ ] **Task 5.1: API Route Handlers (Developer)**
  - Create Next.js API routes (`/api/analytics/...`) to expose `AnalyticsService` data.
  - TDD: Test that API routes return correct JSON and respect tenant session.
- [ ] **Task 5.2: Layout & Navigation (Architect)**
  - Define a sidebar-based layout with "Overview", "Inventory", and "Sales" sections.
  - Implement a basic "Tenant/Branch Switcher" for simulation purposes.
- [ ] **Task 5.3: Global Sales Widget (Developer)**
  - Build a visual card showing Total Revenue across all branches.
- [ ] **Task 5.4: Branch Comparison Chart (Developer)**
  - Use a simple bar chart or list to show performance ranked by branch.
- [ ] **Task 5.5: Critical Stock Alert System (Developer)**
  - Build a table/list showing ingredients that are below the threshold.
- [ ] **Task 5.6: Final E2E Validation (QA)**
  - Verify that clicking "Branch A" updates the dashboard context correctly.

## Success Criteria
- [ ] Data from the database is visible in the browser.
- [ ] Dashboard correctly aggregates multi-branch data.
- [ ] UI is clean, responsive, and follows modern SaaS design principles.
