# Time Tracker ⏱️

*Leer esto en [Español](README-es.md).*

A fast, private, and serverless time tracking web tool designed for developers and technical users. It helps you track your daily workday duration and assign time to specific tasks.

All processing is done locally in your browser, ensuring **total privacy** for your data. Built with **Vue 3 (Composition API)**, **TypeScript**, and a clean, framework-agnostic business logic core.

## ✨ Key Features
- **Workday Totalizer:** The large timer displays the total accumulated time for the selected day.
- **Relational Task Database:** Tasks have their own entity in `localStorage` to avoid duplication. You can associate the same task to multiple days and retrieve them easily.
- **Click-to-Track:** Click directly on any task in the daily list to set it as active and start or switch the timer immediately.
- **Adjustable Times:** Easily add or subtract time (e.g. +15m, -30m) from any task using the "Edit" modal. Corrections are saved as transparent adjustment events in the timeline.
- **History Recovery:** Loads the last active task worked on for any day, allowing you to resume tracking instantly.
- **Window Safety:** Automatically pauses active tracking if the browser tab or window is accidentally closed or reloaded, preventing data corruption.
- **Total Privacy:** Everything happens 100% client-side. Your logs never leave your browser.

## 🛠️ Built With
- **Vue.js 3** (Composition API) + **Vite**
- **TypeScript** for robust, typed code.
- **Vue-i18n** for multi-language support (ES/EN).
- **Vanilla CSS** following the **Sober UI** design tokens (dark/light support).

## 📁 Project Architecture
The project strictly separates business logic from the view layer to ensure readability and easy migration to shared libraries. You can check the details in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## 🚀 How to Run Locally
Please see our detailed guide in [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

## 🗺️ Project Roadmap
Future features planned for development:
- [ ] **Cloud Sychronization:** Sychronize local logs with a secure cloud database (monetizable backoffice feature).
- [ ] **Advanced Analytics:** Detailed dashboards analyzing productivity, tasks distribution, and time metrics (monetizable backoffice feature).
- [ ] **CSV & Custom Export Standards:** Adapt export files to be compatible with other major time reporting systems.
- [ ] **Past Register Limitations:** Set configurable limits to avoid editing timestamps beyond a certain date.
- [ ] **Auto-deletion Policy:** Configurable automatic removal of local history logs to free browser storage.

## 📄 License
This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**. See the `LICENSE` file for more details.
