# ReactWebTemplate

This repository is both a GitHub template repository and a
[Copier](https://copier.readthedocs.io/) template for modern React and TypeScript web
applications.

GitHub creates the repository first so that the generated project retains the
**generated from Dingola/ReactWebTemplate** relationship. Copier then renders the
project metadata and optional infrastructure into that repository.

The generated application provides a deliberately neutral foundation rather than a
portfolio, dashboard, or business-specific example. It includes React, strict
TypeScript, Vite, React Router, CSS Modules, theme support, validated environment
configuration, an API client, generated API documentation, automated tests, and
continuous integration. Express, Docker, and deployment files are optional.

## Create a project

### 1. Create the repository on GitHub

1. Open this repository on GitHub.
2. Select **Use this template** and then **Create a new repository**.
3. Enter the final repository name, for example `CustomerPortal`.
4. Select the owner and visibility and create the repository.

Do not rename the local project directory before initialization unless you also pass
an explicit `-ProjectName` to the initialization script.

### 2. Install local prerequisites

Install the following tools:

- Git
- Node.js 24 LTS or newer
- a stable Python release supported by Copier
- pipx
- Copier 9 or newer

Check the installed versions:

```powershell
node --version
```

```powershell
npm --version
```

```powershell
py -0p
```

Install Copier through pipx. The example uses Python 3.14; replace it with another
installed stable version when necessary:

```powershell
py -3.14 -m pip install --upgrade pip
```

```powershell
py -3.14 -m pip install --user pipx
```

```powershell
py -3.14 -m pipx ensurepath
```

Open a new PowerShell window and install Copier:

```powershell
py -3.14 -m pipx install --python 3.14 copier
```

```powershell
copier --version
```

### 3. Clone and initialize the repository

```powershell
git clone https://github.com/<OWNER>/CustomerPortal.git
```

```powershell
cd CustomerPortal
```

```powershell
.\initialize.cmd
```

On Linux or macOS, make the bootstrap executable and run it from the cloned repository:

```bash
chmod +x initialize.sh
./initialize.sh
```

The script uses the repository directory as the human-readable project name and
converts it to a lowercase npm package name. It validates the Git working tree, runs
Copier against `gh:Dingola/ReactWebTemplate`, and removes the bootstrap-only files
after successful generation.

To test an unreleased template revision:

```powershell
.\initialize.cmd -VcsRef HEAD
```

Use released template versions for normal projects. `HEAD` is intended for template
development and testing.

### 4. Answer the Copier questions

| Question | Purpose | Example |
| --- | --- | --- |
| Project name | Repository and technical project name | `CustomerPortal` |
| Display name | Human-readable application name | `Customer Portal` |
| npm package name | Lowercase package identifier | `customer-portal` |
| Description | Package, page, and README description | `A customer self-service portal.` |
| Author | Package metadata | `Dingola` |
| Repository owner | Generated GitHub links | `Dingola` |
| HTML language | Root document BCP 47 language tag | `en` |
| Package manager | Commands and CI configuration | `npm` |
| Express API | Optional Node.js API and production server | `false` |
| Docker | Optional multi-stage production image | `false` |
| Deployment | Optional GitHub Pages or Vercel configuration | `none` |
| Default theme | System, light, or dark initial preference | `system` |

After successful generation, `.copier-answers.yml` is created. Keep this file under
version control because Copier requires it for future template updates. Do not edit it
manually.

### 5. Install, verify, and commit

For npm:

```powershell
npm install
```

```powershell
npm run check
```

For pnpm, enable Corepack first and use `pnpm install` and `pnpm check`.

Review and commit the generated project, including its lock file:

```powershell
git status
```

```powershell
git add .
```

```powershell
git commit -m "Initialize project from ReactWebTemplate"
```

```powershell
git push
```

Package lock files contain resolved dependency versions, registry locations, and
integrity hashes and are intended to be committed.

## Generated project

The standard project contains:

- React with React Router and route-level code splitting;
- strict TypeScript with additional correctness checks;
- Vite for the development server and production build;
- CSS Modules and a small design-token foundation;
- accessible application layout, skip navigation, focus styles, reduced-motion support,
  JSX accessibility linting, and an Axe browser check;
- persistent light, dark, and system theme preferences;
- Zod-validated environment variables and a typed API boundary;
- ESLint, Stylelint, Prettier, Vitest, Testing Library, and Playwright;
- TypeDoc with validated English source documentation;
- VS Code extension, task, formatting, and browser-debugging recommendations; and
- GitHub Actions checks for formatting, linting, types, tests, documentation, builds,
  and a browser smoke test.

Optional Express projects add Helmet, compression, size-limited JSON parsing, a health
endpoint, a Vite development proxy, and production serving of the built application.
Server construction, validated environment loading, infrastructure routes, and process
startup are separated so the Express application can be imported without opening a
network port. Generated projects do not contain invented authentication or business
features.

See the generated `README.md`, `docs/architecture.md`, and `docs/react-guide.md` for
project-specific usage and extension guidance.

## Update a generated project

Generated projects contain `.copier-answers.yml`. Start from a clean Git working tree:

```powershell
git status
```

```powershell
copier update
```

Review all changes and resolve possible conflicts before committing:

```powershell
git diff
```

```powershell
git add .
```

```powershell
git commit -m "Update project from ReactWebTemplate"
```

## Template maintenance

All files that must appear in generated projects belong under `template/`. Files whose
names or contents contain Copier expressions use the `.jinja` suffix; Copier removes
that suffix while rendering.

```text
.
|-- .github/
|   `-- workflows/
|       `-- validate_template.yml
|-- copier.yml
|-- initialize.cmd
|-- initialize.ps1
|-- initialize.sh
|-- README.md
`-- template/
    |-- .github/workflows/
    |-- .vscode/
    |-- docs/
    |-- public/
    |-- server/                 # optional app, bootstrap, config, and routes
    |-- src/
    |-- tests/e2e/
    |-- {{ _copier_conf.answers_file }}.jinja
    |-- Dockerfile.jinja        # optional
    |-- package.json.jinja
    |-- typedoc.json.jinja
    `-- vite.config.ts.jinja
```

After changing the template:

1. Generate the default configuration.
2. Generate an Express/Docker configuration.
3. Install dependencies in both generated projects.
4. Generate and verify the pnpm variant and an answer set containing special characters.
5. Run `npm run check` or `pnpm check` in every generated project.
6. Verify `copier update` against a clean generated repository.
7. Review and commit the template changes.
8. Push `main` and wait for **Validate Copier Template**.
9. Create a new PEP 440-compatible template tag.

Example local generation:

```powershell
copier copy --defaults . .\_build\DefaultApp
```

```powershell
copier copy --defaults --data include_express=true --data include_docker=true . .\_build\FullApp
```

Example template release:

```powershell
git tag -a 1.0.0 -m "Release template 1.0.0"
```

```powershell
git push origin 1.0.0
```

Template-version tags such as `1.0.0` belong to this repository. Generated application
release tags can follow the owning project's own convention.

## Troubleshooting initialization

### PowerShell blocks scripts

Use the command wrapper:

```powershell
.\initialize.cmd
```

It applies `ExecutionPolicy Bypass` only to the child PowerShell process and does not
change the persistent user or machine policy.

### Node.js is too old

The generated toolchain targets Node.js 24 LTS or newer. Install a current LTS release,
open a new terminal, and verify `node --version` before installing dependencies.

### Copier is not found

Run `py -3.14 -m pipx ensurepath`, open a new terminal, and verify `copier --version`.

### Initialization reports a dirty working tree

Initialization intentionally refuses to overwrite uncommitted work. Commit or
intentionally discard unrelated changes before running it again.

### Copier fails

Bootstrap files are retained when Copier fails. Correct the reported problem and run
`.\initialize.cmd` again. Do not manually remove `template/` or `copier.yml`.

## GitHub Actions compatibility

The workflows intentionally use `actions/checkout@v4` and `actions/setup-node@v4`.
Major version 5 and newer use the Node.js 24 action runtime and require GitHub Actions
Runner 2.327.1 or newer. Keeping version 4 preserves compatibility with older
self-hosted and GitHub Enterprise Server runners. Revisit this decision when those
runners are no longer supported by projects generated from this template.
