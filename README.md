
# PomodorU

A desktop application built with **Tauri 2**, **React**, and **TypeScript** using **Vite**.

---

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or newer recommended)
- **npm** or **pnpm**
- **Rust** (install from [rustup.rs](https://rustup.rs/))

---

## System Dependencies

### Linux

Tauri requires native system libraries depending on your Linux distribution.

#### Ubuntu / Debian

```bash
sudo apt update && sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
````

#### Fedora

```bash
sudo dnf install -y \
  webkit2gtk4.1-devel \
  openssl-devel \
  curl \
  wget \
  file \
  libXdo-devel \
  libappindicator-gtk3-devel \
  librsvg2-devel
```

#### Arch Linux

```bash
sudo pacman -S --needed \
  webkit2gtk-4.1 \
  base-devel \
  curl \
  wget \
  file \
  openssl \
  appmenu-gtk-module \
  gtk3 \
  libappindicator-gtk3 \
  librsvg
```

---

### Windows

For Windows development, install the following:

* **Microsoft Visual Studio C++ Build Tools**

  * During installation, enable **Desktop development with C++**
* **Microsoft Edge WebView2**

  * Usually already installed on Windows 10/11
* **Rust (MSVC toolchain)**
* **Node.js**

#### Install Rust on Windows

Using `winget`:

```powershell
winget install --id Rustlang.Rustup
rustup default stable-msvc
rustc --version
cargo --version
```

#### Verify Node.js

```powershell
node -v
npm -v
```

---

## Dependencies to Install

### 1. Install Node dependencies

From the project root:

```bash
npm install
```

This installs the project dependencies, including:

#### Runtime dependencies

* `react`
* `react-dom`
* `@tauri-apps/api`
* `@tauri-apps/plugin-opener`

#### Development dependencies

* `typescript`
* `vite`
* `@vitejs/plugin-react`
* `@tauri-apps/cli`
* `@types/react`
* `@types/react-dom`

---

### 2. Rust dependencies

Rust dependencies are managed automatically by **Cargo**.

The first time you run a Tauri command such as:

```bash
npm run tauri dev
```

Cargo will automatically download and compile the required Rust crates.

---

## How to Run

### Development mode (desktop app with hot reload)

```bash
npm run tauri dev
```

This starts the **Vite dev server** and opens the **Tauri desktop window**.

---

### Frontend only (browser mode)

```bash
npm run dev
```

Runs only the Vite development server in the browser without launching Tauri.

---

### Build for production

```bash
npm run tauri build
```

Production binaries will be generated in:

* `src-tauri/target/release/`
* or `src-tauri/target/release/bundle/` for installers

---

### Preview production frontend build

```bash
npm run build
npm run preview
```

Builds the frontend and serves it locally for preview.

---

## Recommended IDE Setup

* [VS Code](https://code.visualstudio.com/)
* [Tauri VS Code Extension](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
* [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

---

## Quick Start

Clone the project and install dependencies:

```bash
git clone https://github.com/UrielP-Dev/pomodorU
cd pomodorU
npm install
npm run tauri dev
```

---

## Notes

* On **Linux**, make sure the required WebKitGTK packages are installed before running the app.
* On **Windows**, make sure you are using the **MSVC Rust toolchain**.
* If this is your first Tauri project, the first build may take longer because Cargo downloads and compiles native dependencies.

---

## Project Stack

* **Tauri 2**
* **React**
* **TypeScript**
* **Vite**

---

## License

This project is for personal and educational use unless otherwise specified.

---

I love you mucy ❤️​

