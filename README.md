# @tenorlab/dashboard-core

The framework-agnostic engine powering the Tenorlab dashboard ecosystem.

## Ecosystem Architecture

This package serves as the foundational layer for our framework-specific libraries. It contains the shared logic, TypeScript interfaces, and utilities that ensure consistent behavior across different rendering engines.

- **@tenorlab/dashboard-core**: Base types, state logic, and math utilities.
- **@tenorlab/vue-dashboard**: Vue-specific components (re-exports dashboard-core).
- **@tenorlab/react-dashboard**: React-specific components (re-exports dashboard-core).

## Purpose

The core library ensures that whether you are building in **Vue 3** or **React**, the underlying data structures for widgets, layouts, and financial data remain identical.

> **Note for Developers**: If you are using Vue or React, you do **not** need to install this package directly. Install `@tenorlab/vue-dashboard` or `@tenorlab/react-dashboard` instead, as they re-export everything found here.

## Core Features

- **Unified Interfaces**: Standardized types for Dashboard Layouts, Widget Configurations, etc.
- **Zero Dependencies**: Extremely lightweight with no runtime framework requirements.
- **Type Safety**: Shared TypeScript definitions to prevent "type-drift" between different framework implementations.

## Usage (Internal/Advanced)

While primarily consumed by our framework wrappers, you can use the core for vanilla TypeScript projects:

```typescript
// TODO: example
```

## Development

This project uses **Vite** and **TypeScript 5.8+**.
