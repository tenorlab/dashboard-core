# @tenorlab/dashboard-core

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Template: Pro](https://img.shields.io/badge/Template-Pro--Available-gold.svg)](https://www.tenorlab.com)

The framework-agnostic engine powering the Tenorlab dashboard ecosystem.

## Ecosystem Architecture

This package serves as the foundational layer for our framework-specific libraries. It contains the shared logic, TypeScript interfaces, and utilities that ensure consistent behavior across different rendering engines.

  - **@tenorlab/dashboard-core**: (this package) Base types, state logic, and math utilities.

## These are the packages extending to specific frameworks
  - **[@tenorlab/react-dashboard](https://www.npmjs.com/package/@tenorlab/react-dashboard)**: React-specific components (re-exports the dashboard-core as well).
  - **[@tenorlab/vue-dashboard](https://www.npmjs.com/package/@tenorlab/vue-dashboard)**: Vue-specific components (re-exports the dashboard-core as well).

## Purpose

The core library ensures that whether you are building in **React** or **Vue**, the underlying data structures for widgets, layouts, and configuration remain identical.

> **Note for Developers**: If you are using React or Vue, you do **not** need to install this package directly. Install `@tenorlab/react-dashboard` or `@tenorlab/vue-dashboard` instead, as they re-export everything found here.

## Core Features

  - **Unified Interfaces**: Standardized types for Dashboard Layouts, Widget Configurations, etc.
  - **Zero Dependencies**: Extremely lightweight with no runtime framework requirements.
  - **Type Safety**: Shared TypeScript definitions to prevent "type-drift" between different framework implementations.

## Usage (Internal/Advanced)

While primarily consumed by our framework wrappers, you could use the core for vanilla TypeScript projects:

```typescript
// TODO: no-framework example
```

## Development

This project uses **Vite** and **TypeScript 5.8+**.

------

## Links

### Open source core packages
 - [@tenorlab/react-dashboard](https://www.npmjs.com/package/@tenorlab/react-dashboard): React-specific components
 - [@tenorlab/vue-dashboard](https://www.npmjs.com/package/@tenorlab/vue-dashboard): Vue-specific components

### Pro Template Demos
 - [React Demo](https://react.tenorlab.com) (built with @tenorlab/react-dashboard)
 - [Vue Demo](https://vue.tenorlab.com) (built with @tenorlab/vue-dashboard)
 - [Nuxt Demo](https://nuxt.tenorlab.com) (built with @tenorlab/vue-dashboard)

### Others
 - [Buy a License](https://payhip.com/b/gPBpo)
 - [Follow on BlueSky](https://bsky.app/profile/tenorlab.bsky.social)
 - [Official Website](https://www.tenorlab.com)


------


## ⚖️ Licensing & Usage

**@tenorlab/vue-dashboard** is [MIT licensed](https://opensource.org/licenses/MIT). 

It provides the foundational components and logic for building dashboards. You are free to use it in any project, personal or commercial.

## ⚡️ Go Pro and Save Time: Tenorlab App Template

A commercial license for a full-blown professional app template is available for purchase [**here**](https://www.tenorlab.com) and comes with:

* **Full Application Shell:** A clean, optimized Vite + TypeScript project structure (with either React, Vue or Nuxt).
* **Dashboard Management:** Production-ready logic for creating, listing, renaming, and deleting multiple user-defined dashboards.
* **Implementation Examples:** Best patterns for both "Read-Only" (Analyst view) and "User-Editable" (Admin view) dashboard modes, a dynamic dashboard menu, etc.
* **Tenorlab Theme Engine:** A sophisticated Tailwind-based system supporting multiple custom themes (not just Light/Dark mode).

