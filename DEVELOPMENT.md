# FoodHouse SaaS: Development Master Documentation

This document tracks the evolution of the FoodHouse SaaS platform, ensuring all developments align with the core **"SaaS Foundation First"** directives.

## 🎯 Project Vision
**Not just a POS system** — but a multi-tenant business platform for Filipino SME food chains where POS is a single modular component.

---

## 🏛️ Core Architectural Directives
1.  **Multi-Tenant Model**: `tenant_id` and `branch_id` mandatory for all business data.
2.  **RBAC (Role-Based Access Control)**: Permission-based access from day one.
3.  **Modular Architecture**: Bounded contexts (POS, Inventory, Orders, Suppliers).
4.  **SaaS Foundation FIRST**: Identity, Subscription, and Gating before features.
5.  **Vertical Slices**: End-to-end functionality per module.

---

## 🏛️ Critical Path Sequence (Dependency-Aware)

This list defines the order of building blocks to ensure zero technical debt and logical data flow. Items are prioritized based on their foundational importance to the SaaS platform.

### **I. SaaS Infrastructure (Foundation Layer)**
*   **[S-1] Multi-Tenant DB Schema** (✅ DONE)
*   **[S-2] Auth & Context Resolution** (✅ DONE)
    *   *Rationale*: Prevents cross-tenant data leaks before any feature code is written.
*   **[S-3] RBAC: Initial Roles & Permissions** (✅ DONE)
*   **[S-4] Feature Gating System** (✅ DONE)
    *   *Rationale*: Sets the stage for monetization through plans (Basic, Pro, etc.).

### **II. Operational Engine (Vertical Slices)**
*   **[P-1] Product Management** (✅ DONE)
*   **[P-2] Order & Sale Transaction Flow** (✅ DONE)
*   **[I-1] Raw Material Registry** (✅ DONE)
*   **[I-2] Automated Ingredient Deduction** (✅ DONE)
*   **[S-5] Subscription Limits Enforcement** (✅ **DONE**)
    *   *Rationale*: Prevents abuse of plan tiers (e.g., branch count) before scaling to reporting features.
*   **[I-3] Supplier Linkage & Procurement** (✅ **DONE**)
    *   *Rationale*: Completes the operational data chain (Procurement -> Inventory -> Sale).

### **III. Branch Operational Context (Refinement Layer)**
*   **[S-7] Team Management & Branch Assignment** (✅ **DONE**)
    *   *Rationale*: Allows owners to delegate operations to staff (Cashiers, Managers, Chefs) with strict role isolation.
*   **[S-8] UI-Level RBAC Enforcement** (✅ **DONE**)
    *   *Rationale*: Ensures staff only access modules relevant to their role and branch.
*   **[P-3] Branch-Specific Menus & Overrides** (✅ **DONE**)
    *   *Rationale*: Allows localized pricing and items, enabling branches to adapt to local stock and demand.
*   **[K-1] Kitchen Display System (KDS)** (✅ **DONE**)
*   **[K-2] Hybrid Production Tracking** (✅ **DONE**)
    *   *Rationale*: Supports both batch-cooked items (Chef logs production) and on-demand items (automatic recipe deduction) in a single unified system.
*   **[I-5] Wastage & Spoilage Tracking** (📅 PLANNED)

### **IV. Commercial Expansion (Monetization Layer)**
*   **[M-1] Billing Integration (Stripe / PayMongo)** (📅 PLANNED)
*   **[S-6] Global SaaS Admin Panel** (✅ **DONE**)
    *   *Rationale*: The final layer for platform operators to manage all tenants globally. Includes platform-wide stats and subscription management.

---

## 🛣️ Roadmap & Progress Status (Audit: 2026-04-29)

| Step | phase | Description | Status | Updated |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Design** | System Design (DB Schema, RBAC Model) | ✅ **Completed** | 2026-04-27 |
| **2** | **Core** | SaaS Core (Auth, Tenant, RBAC, Feature Flags) | ✅ **Completed** | 2026-04-27 |
| **3** | **Vertical** | POS-lite (Products, Orders, Sales) | ✅ **Completed** | 2026-04-29 |
| **4** | **Vertical** | Inventory (Raw Materials, Stock Tracking, Suppliers) | ✅ **Completed** | 2026-04-29 |
| **5** | **Scale** | Aggregation Logic (Cross-branch reporting) | ✅ **Completed** | 2026-04-27 |
| **6** | **UI** | Dashboard (Owner view, KPIs, Fluid UI) | ✅ **Completed** | 2026-04-29 |
| **7** | **Team** | Personnel Management (Roles, Branch Assignment) | ✅ **Completed** | 2026-04-27 |
| **8** | **SaaS** | Subscription System (Limits, Plan Enforcement) | ✅ **Completed** | 2026-04-27 |
| **9** | **UX** | Robust Error Handling (Connection vs Restriction) | ✅ **Completed** | 2026-04-29 |
| **10** | **Fin** | Billing Integration (Payments) | 📅 **Planned** | - |
| **11** | **Admin** | SaaS Global Admin Panel | ✅ **Completed** | 2026-04-29 |

---

## 📦 Module Deep Dives

### [SaaS Foundation (Core Layer)]
*   **Status**: ✅ Production-Ready Foundation
*   **Key Components**:
    *   `BaseService`: Enforces search scoping for `tenantId` and `branchId`.
    *   `AuthService`: Manages multi-tenant context resolution and branch switching.
    *   `FeatureService`: Universal gatekeeper for modular functionality (Feature Flags).
*   **Latest Update (2026-04-29)**: Hardened error handling to distinguish between subscription gates and database connectivity failures.

### [POS Module]
*   **Status**: ✅ Production-Ready Transaction Engine
*   **Key Features**:
    *   Integrated with Inventory to deduct raw materials automatically upon sale.
    *   Branch-specific menus and localized pricing.
    *   Framer-motion powered UI.
*   **Latest Update (2026-04-29)**: Confirmed 100% stability in multi-branch transaction routing.

### [Inventory Module]
*   **Status**: ✅ Full Stock Lifecycle Tracking
*   **Key Features**:
    *   Recipe-based deduction (Product -> Ingredients).
    *   Supplier Linkage and Purchase Record tracking.
    *   Automated Production Tracking for Kitchens.
*   **Latest Update (2026-04-29)**: Integrated with Owner Dashboard for real-time stock health visuals.

---

## 🛠️ Tech Stack & Standards
*   **Backend**: Next.js (App Router), Prisma (ORM), PostgreSQL.
*   **Logic**: Modular Monolith with DDD-inspired services.
*   **Testing**: Vitest (TDD mandatory).
*   **UI**: Vanilla CSS + Framer Motion (Premium Aesthetics).

---

## 📜 Update Log & Audit Trail

| Date | Module | Action | Rationale |
| :--- | :--- | :--- | :--- |
| 2026-04-27 | Global | Architecture Audit | Verified compliance with "SaaS-First" directives. |
| 2026-04-27 | POS | Service Refactor | Grouped order creation and inventory deduction in transactions. |
| 2026-04-27 | SaaS | Feature Gating | Implemented `PLAN_FEATURES` system in `FeatureService`. |
| 2026-04-27 | SaaS | Limit Enforcement | Implemented `max_branches` enforcement in `TenantService`. |
| 2026-04-27 | Inventory | Supplier & Procurement | Implemented `Supplier` model, `SupplierService`, and `PurchaseRecord`. |
| 2026-04-27 | Analytics | Aggregation Logic | Exposed cross-branch sales and stock analytics via API routes. |
| 2026-04-27 | POS | Menu Overrides | Implemented `BranchProduct` model and `MenuService` to resolve localized pricing/availability. |
| 2026-04-27 | UI | Executive Dashboard | Built a premium, data-driven dashboard using Lucide React and Glassmorphism. |
| 2026-04-27 | Team | Personnel & RBAC | Implemented `UserService`, `/api/auth/me`, and guarded `Sidebar` with `RoleSwitcher`. |
| 2026-04-27 | Core | Visibility Fix | Changed `featureService` visibility to `protected` in `BaseService` to support sub-services. |
| 2026-04-29 | UI | Dashboard Revamp | Upgraded to Premium Fluid UI with Glassmorphism. |
| 2026-04-29 | Core | Error Hardening | Added specific handling for DB connection failures vs restrictions. |
| 2026-04-29 | Admin | SaaS Global Admin | Implemented GlobalAdminService, secured API routes, and Premium Admin UI. |
| 2026-04-29 | Documentation | Feature Audit | Conducted full platform audit and updated feature map. |
