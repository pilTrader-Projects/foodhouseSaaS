# Refactoring Plan - Navigation & Context Modularization

## 1. Objective
Refactor the current navigation and authentication implementation to be more modular, DRY (Don't Repeat Yourself), and maintainable, while strictly adhering to existing security boundaries and visual styles.

## 2. Core Principles
- **Separation of Concerns**: UI components should only worry about rendering. Logic for permissions and menu generation should live in hooks/services.
- **DRY (Don't Repeat Yourself)**: Shared UI patterns (like sidebar links) should be extracted into small, focused components.
- **Zero Regression**: NO changes to colors, layout arrangement, or functional behaviors (especially SaaS Admin filtering).

## 3. Planned Changes

### A. Modular Navigation (config & hooks)
- **`src/hooks/use-navigation.ts`**: Create a custom hook that wraps `useUser` and provides the pre-filtered `navigation` items. This removes the need for components to know about `getAuthorizedNavItems`.

### B. UI Component Refactoring
- **`src/components/layout/nav-item.tsx`**: Extract the sidebar link logic into a standalone component.
- **`src/components/layout/sidebar-footer.tsx`**: Extract theme toggle and sign-out buttons.
- **`src/components/layout/user-profile-widget.tsx`**: Extract the user profile section (currently in both Sidebar and Header).

### C. Context Optimization
- **`src/context/user-context.tsx`**: 
    - Clean up `fetchUser` by moving the logic to a dedicated service call if possible.
    - Ensure `navigation` remains a memoized property of the context.

### D. Security Audit
- Verify that `system:admin` permissions are still strictly required for the SaaS Admin menu.
- Verify that onboarding does not grant sweeping permissions.

## 4. Guardrails & Verification
- **Visual Check**: Compare UI before and after refactor (no color shifts).
- **Security Check**: Login with a non-admin account and verify "SaaS Admin" is NOT visible.
- **Sanity Test**: Run `npm run sanity` to ensure routing and core files are intact.
- **TDD**: Write/update tests for `useNavigation` to ensure role-based filtering remains exact.
