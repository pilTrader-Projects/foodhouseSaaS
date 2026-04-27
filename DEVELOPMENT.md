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

## � Critical Path Sequence (Dependency-Aware)

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
*   **[S-6] Global SaaS Admin Panel** (📅 PLANNED)
    *   *Rationale*: The final layer for platform operators to manage all tenants globally.

---

## �🛤️ Roadmap & Progress Status

| Step | phase | Description | Status | Updated |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Design** | System Design (DB Schema, RBAC Model) | ✅ **Completed** | 2026-04-27 |
| **2** | **Core** | SaaS Core (Auth, Tenant, RBAC, Feature Flags) | ✅ **Completed** | 2026-04-27 |
| **3** | **Vertical** | POS-lite (Products, Orders, Sales) | 🔄 **In Progress** | 2026-04-27 |
| **4** | **Vertical** | Inventory (Raw Materials, Stock Tracking, Suppliers) | ✅ **Completed** | 2026-04-27 |
| **5** | **Scale** | Aggregation Logic (Cross-branch reporting) | ✅ **Completed** | 2026-04-27 |
| **6** | **UI** | Dashboard (Owner view, KPIs) | ✅ **Completed** | 2026-04-27 |
| **7** | **Team** | Personnel Management (Roles, Branch Assignment) | ✅ **Completed** | 2026-04-27 |
| **8** | **SaaS** | Subscription System (Limits, Plan Enforcement) | ✅ **Completed** | 2026-04-27 |
| **9** | **Fin** | Billing Integration (Payments) | 📅 **Planned** | - |
| **10** | **Admin** | SaaS Global Admin Panel | 📅 **Planned** | - |

---

## 📦 Module Deep Dives

### [SaaS Foundation (Core Layer)]
*   **Status**: ✅ Production-Ready Foundation
*   **Rationale**: To prevent mid-project rewrites, multi-tenancy was baked into the `BaseService`.
*   **Key Components**:
    *   `BaseService`: Enforces search scoping for `tenantId` and `branchId`.
    *   `AuthService`: Manages multi-tenant context resolution and branch switching.
    *   `FeatureService`: Universal gatekeeper for modular functionality (Feature Flags).
*   **Latest Update (2026-04-27)**: Architecture audit confirmed 100% compliance with multi-tenant isolation.

### [POS Module]
*   **Status**: 🔄 Functional Transaction Pipeline
*   **Rationale**: Implementation of the first vertical slice to prove the transaction engine.
*   **Key Features**:
    *   Integrated with Inventory to deduct raw materials automatically upon sale.
    *   Tenant/Branch scoped order creation.
*   **Latest Update (2026-04-27)**: Refined `createOrder` logic to use Prisma transactions for atomicity between Order and Stock updates.

### [Inventory Module]
*   **Status**: 🔄 Basic Stock Tracking
*   **Rationale**: Essential for food businesses to track raw materials (ingredients) vs. final products.
*   **Key Features**:
    *   Recipe-based deduction (Product -> Ingredients).
    *   Branch-level stock isolation.
*   **Latest Update (2026-04-27)**: Validated scoping logic in `InventoryService` to ensure branch A cannot deduct stock from branch B.

---

## 🛠️ Tech Stack & Standards
*   **Backend**: Next.js (App Router), Prisma (ORM), PostgreSQL.
*   **Logic**: Modular Monolith with DDD-inspired services.
*   **Testing**: Vitest (TDD mandatory).
*   **Guiding Rule**: Every query MUST use `getScope()` from `BaseService`.

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
