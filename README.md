# Price calculator

Desktop app for estimating **machining part prices** (peso do material, passos, diâmetros, etc.). Built with **Tauri** (Rust shell) and **React** + **Vite**, with **shadcn/ui** and **Tailwind CSS**.

## Requirements

- **Node.js** (LTS recommended)
- **pnpm** 9.x (`corepack enable` or install from [pnpm.io](https://pnpm.io/installation))
- **Rust** via [rustup](https://rustup.rs/) (stable)
- **Windows**: [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (MSVC + Windows SDK) and **WebView2** (usually already installed on Windows 10/11)

## Install

```bash
pnpm install
```

## Run (development)

**Desktop (recommended — full features, persistent tables on disk):**

```bash
pnpm tauri dev
```

**Browser only** (UI at [http://localhost:1420](http://localhost:1420)):

```bash
pnpm dev
```

Some behavior depends on Tauri (file-backed tables, window sizing). Use `pnpm tauri dev` when testing the real app.

## Using the app

- **Calculator** — main screen for price/weight calculations.
- **Configurações** (ícone de engrenagem no canto) — edit reference tables (materiais, passos, etc.). Changes persist on disk in the desktop app.
- **Theme** — light/dark toggle where provided.

## Tests

```bash
pnpm test
pnpm test:coverage
```

## Build a Windows `.exe` / installer (Tauri)

Production build (runs `pnpm build` for the frontend, then compiles Rust and bundles the app):

```bash
pnpm tauri build
```

Artifacts appear under:

- `src-tauri/target/release/` — main **`calcular-preco.exe`** (and related files)
- `src-tauri/target/release/bundle/` — **MSI / NSIS** installers and bundled outputs (exact folders depend on enabled bundle targets)

Share the installer from `bundle/` for end users, or ship the `.exe` from `release/` if you handle dependencies yourself.

### Tips

- First `tauri build` downloads Rust crates and can take several minutes.
- Bump version in `package.json`, `src-tauri/tauri.conf.json`, and `src-tauri/Cargo.toml` together when releasing.

## Project layout (short)

| Path | Role |
|------|------|
| `src/` | React UI, forms, tables JSON |
| `src-tauri/` | Rust backend, Tauri config, icons |
