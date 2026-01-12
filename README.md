# @tenorlab/dashboard-core

The framework-agnostic engine powering the Tenorlab dashboard ecosystem.

## Ecosystem Architecture

This package serves as the foundational layer for our framework-specific libraries. It contains the shared logic, TypeScript interfaces, and utilities that ensure consistent behavior across different rendering engines.

- **@tenorlab/dashboard-core**: (this package) Base types, state logic, and math utilities.

## These are some package extending to specific frameworks
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
 - [@tenorlab/react-dashboard](https://www.npmjs.com/package/@tenorlab/react-dashboard): React-specific components
 - [@tenorlab/vue-dashboard](https://www.npmjs.com/package/@tenorlab/vue-dashboard): Vue-specific components
 - [Official Website](https://www.tenorlab.com)
 - [React Demo](https://react.tenorlab.com) (built with @tenorlab/react-dashboard)
 - [Vue Demo](https://vue.tenorlab.com) (built with @tenorlab/vue-dashboard)
 - [Buy a License](https://payhip.com/b/gPBpo)
 - [Follow on BlueSky](https://bsky.app/profile/tenorlab.bsky.social)

