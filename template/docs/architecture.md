# Architecture

The project starts small but defines explicit dependency directions so it can grow
without becoming a collection of unrelated global components.

```text
main.tsx
   |
   v
app/  --------> pages/
 |                 |
 |                 v
 |              features/
 |                 |
 +-------> components/ <------+
                   |           |
                   v           v
                  hooks/      lib/
```

Dependencies should generally point down this diagram:

- `app` composes providers, routes, and application-wide configuration.
- `pages` are route-level compositions and should remain thin.
- `features` own cohesive application behavior and domain-facing UI.
- `components/ui` contains generic controls with no application knowledge.
- `components/layout` contains application-wide layout primitives.
- `hooks` contains generic reusable React behavior.
- `lib` contains infrastructure and code that should not render UI.

Avoid importing a page from a feature or a generic UI component. Avoid a single global
`utils.ts`; give infrastructure a name that describes its responsibility.

## Feature organization

Start with a single file when a feature is small. Expand it only as needed:

```text
features/
`-- account-settings/
    |-- api/
    |-- components/
    |-- hooks/
    |-- model/
    `-- tests/
```

Do not create all of these directories preemptively. The boundary is prepared by the
template; the generated application should add only directories that contain real
code.

## Application providers

`AppProviders.tsx` is the composition point for cross-cutting React contexts. Add
providers there for concerns such as localization, authentication, server-state
caching, notifications, or feature flags. Keep provider-specific configuration in its
own feature or library module.

## Routing

Routes are configured centrally in `app/router.tsx` and route modules are lazy-loaded.
For a large application, route groups can be extracted into separate files without
changing the page or feature boundaries.

The default Vite build is a client-rendered SPA. If a project requires public pages
with strict search-engine or first-load requirements, evaluate static generation or
server rendering early rather than adding it after the routing and hosting strategy is
fixed.

## Data boundaries

Treat browser storage, HTTP responses, URL parameters, environment variables, and form
input as untrusted data. Validate important values with Zod at the boundary. Components
should receive parsed application values rather than repeatedly interpreting raw API
responses.

The provided API client intentionally wraps the platform `fetch` API only lightly. Add
authentication, tracing, retries, or a server-state library when actual requirements
justify them; avoid embedding those policies separately in every component.

## Styling

Use global CSS only for resets, design tokens, document defaults, and genuinely global
utilities. Keep component-specific styles in CSS Modules next to the component. This
preserves ordinary CSS skills and prevents accidental selector coupling between
unrelated features.

## Testing strategy

- Unit tests cover pure transformation and validation logic.
- React Testing Library covers behavior visible to a component user.
- Playwright covers a small number of critical cross-page browser flows.

Prefer observable behavior over implementation details. A feature should not require a
browser test for every branch when faster unit or component tests provide the same
confidence.

## Documentation strategy

Repository documentation is written in English. Curated guides in `docs` explain
architecture and development workflows, while TSDoc-compatible source comments define
the contracts of exported components, hooks, types, and infrastructure.

TypeDoc generates navigable HTML API documentation in `docs/api`. Generated output is
ignored by Git because it is reproducible with `npm run docs`. The complete quality gate
also generates the documentation and treats TypeDoc validation warnings as errors.

Document purpose, behavior, side effects, defaults, constraints, and failure modes. Do
not repeat information already expressed by TypeScript types, and use inline comments
only when the reason for an implementation decision is not evident from the code.

## Security and operations

Never expose secrets through `VITE_` variables; Vite embeds them in browser assets. A
backend should validate all input independently, set explicit request size limits, and
apply authorization at the server boundary. The optional Express foundation adds
Helmet, compression, a JSON limit, and a health endpoint, but application-specific
rate limiting, authentication, logging, and monitoring remain project decisions.
