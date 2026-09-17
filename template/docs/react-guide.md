# React and TypeScript guide

This guide introduces the conventions used by the generated application. It is not a
replacement for the React and TypeScript documentation; it explains how those concepts
map to this repository.

## Components and JSX

A React component is a function that returns a description of user interface elements.
The HTML-like syntax inside TypeScript is JSX, which is why component files use the
`.tsx` extension.

```tsx
export type GreetingProps = {
  /** Name displayed by the greeting. */
  name: string;
};

/** Renders a greeting for the supplied name. */
export function Greeting({ name }: GreetingProps) {
  return <p>Hello, {name}.</p>;
}
```

Custom components start with an uppercase letter and are rendered like HTML elements:

```tsx
<Greeting name="Ada" />
```

Keep component declarations at module scope. Do not declare one component inside
another component.

## Props, state, and hooks

Props are read-only input supplied by a parent component. Describe props with a
TypeScript type and document behavior, constraints, and defaults where they are not
obvious from the type.

State is data owned by a mounted component. React hooks such as `useState`, `useEffect`,
and `useContext` connect a function component to state, browser APIs, or shared context.
Custom hooks in `src/hooks` and feature folders start with `use` and may call other
hooks. Hooks must be called unconditionally at the top level of a component or another
hook.

Effects synchronize React with systems outside React, such as the document title,
media-query listeners, storage, or network connections. Avoid using an effect when a
value can be derived directly during rendering.

## Application composition

`src/main.tsx` is the browser entry point. It finds the `root` element from `index.html`
and mounts `AppProviders`.

`AppProviders` composes application-wide concerns:

```text
ErrorBoundary
`-- ThemeProvider
    `-- RouterProvider
        `-- App
            |-- Header
            |-- Outlet (active route)
            `-- Footer
```

`App` is the persistent layout. React Router replaces `Outlet` with the component that
matches the current URL; it does not replace the header or footer.

## Routing

Routes are declared in `src/app/router.tsx`. Page components live in `src/pages` and
are loaded lazily so routes not needed for the first render can be downloaded later.

To add a page:

1. Create a component in `src/pages`.
2. Import it lazily in `src/app/router.tsx`.
3. Add a route object to the root route's `children` array.
4. Add navigation only where users need a link to the page.
5. Add a browser test for critical navigation behavior.

Keep pages focused on arranging components and features. Business behavior belongs in
`src/features`, while broadly reusable visual building blocks belong in
`src/components/ui`.

`src/features/README.md` intentionally preserves the extension point before the first
product feature exists. This keeps the directory name consistent across projects. A
feature should represent a user- or business-facing capability; application-wide theme,
layout, and error handling belong under `src/app` instead.

## Imports and the source alias

Imports beginning with `@/` are resolved relative to `src`:

```tsx
import { Button } from '@/components/ui/Button';
```

Use the alias across architectural folders. Use relative imports for files that form a
small local unit, such as a component and its CSS Module.

## Styling

Global design tokens, the reset, and utility classes live in `src/styles`. A component's
local styles live beside it in a `*.module.css` file.

```tsx
import styles from './Greeting.module.css';

export function Greeting() {
  return <p className={styles.message}>Hello.</p>;
}
```

CSS Module class names are scoped during the build, preventing accidental collisions
between unrelated components. Prefer design tokens over repeating raw colors, spacing,
or typography values.

## Assets

Place files in `public` only when they must retain a fixed URL or be copied unchanged.
Import images, fonts, and other assets used by a component or feature from a nearby
folder so Vite can include them in the dependency graph. Introduce `src/assets` only
when an imported asset is genuinely shared across unrelated parts of the application.

## Data and API access

Browser environment variables must start with `VITE_`. Declare and validate them in
`src/lib/env.ts`, and add non-secret example values to `.env.example`.

Use `apiRequest` at the HTTP boundary. Its generic response type is a compile-time
expectation, not runtime validation. Validate untrusted server data with Zod before a
feature relies on it.

## Tests

Keep unit and component tests near the source as `*.test.ts` or `*.test.tsx`. Test
observable behavior rather than component implementation details. Shared render helpers
live in `src/test`, and end-to-end browser tests live in `tests/e2e`.

## Source documentation

Documentation comments use the TSDoc/JSDoc block form and are displayed by VS Code on
hover. Document exported components, hooks, types, and infrastructure when their
purpose or contract is not fully expressed by the TypeScript signature.

```ts
/**
 * Reads a persisted setting.
 *
 * @param key - Storage key to read.
 * @param fallback - Value returned when no valid stored value is available.
 * @returns The stored value or the supplied fallback.
 */
```

Comments should explain purpose, behavior, side effects, defaults, constraints, and
failure modes. Do not repeat TypeScript types or narrate obvious syntax. Inline comments
should explain why a decision exists, especially for accessibility, security, and
browser compatibility.

Generate navigable HTML API documentation from the source comments with:

```powershell
npm run docs:api
```

The output is written to `docs/api` and intentionally excluded from version control.
The complete `npm run check` command verifies that API documentation can be generated
without validation warnings.

## Where code belongs

| Location | Responsibility |
| --- | --- |
| `src/app` | Startup composition, routing, concrete shell layout, providers, and errors |
| `src/app/layout` | Header, footer, and other concrete shell components |
| `src/app/providers` | Application-wide React contexts and their controls |
| `src/app/errors` | Application-level error handling and fallbacks |
| `src/components/layout` | Generic application-independent layout primitives |
| `src/components/ui` | Generic reusable visual components |
| `src/features` | Stable extension point for cohesive product capabilities |
| `src/hooks` | Generic reusable hooks |
| `src/lib` | Framework-independent infrastructure and adapters |
| `src/pages` | Route-level composition |
| `src/styles` | Global styling foundations and design tokens |
| `src/test` | Shared test setup and helpers |
| `tests/e2e` | User-visible browser workflows |

Prefer starting locally within a page or feature. Move code into a shared folder only
after its responsibility is clear and more than one consumer benefits from it.

## Further reading

- [React documentation](https://react.dev/learn)
- [React Router documentation](https://reactrouter.com/)
- [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeDoc documentation](https://typedoc.org/)
- [TSDoc specification](https://tsdoc.org/)
