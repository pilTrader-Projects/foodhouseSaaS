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

## 🛤️ Roadmap & Progress Status

| Step | phase | Description | Status | Updated |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Design** | System Design (DB Schema, RBAC Model) | ✅ **Completed** | 2026-04-27 |
| **2** | **Core** | SaaS Core (Auth, Tenant, RBAC, Feature Flags) | ✅ **Completed** | 2026-04-27 |
| **3** | **Vertical** | POS-lite (Products, Orders, Sales) | 🔄 **In Progress** | 2026-04-27 |
| **4** | **Vertical** | Inventory (Raw Materials, Stock Tracking) | 🔄 **In Progress** | 2026-04-27 |
| **5** | **Scale** | Aggregation Logic (Cross-branch reporting) | 📅 **Planned** | - |
| **6** | **UI** | Dashboard (Owner view, KPIs) | 📅 **Planned** | - |
| **7** | **SaaS** | Subscription System (Limits, Plan Enforcement) | 🟡 **Partial** | 2026-04-27 |
| **8** | **Fin** | Billing Integration (Payments) | 📅 **Planned** | - |
| **9** | **Admin** | SaaS Global Admin Panel | 📅 **Planned** | - |

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
