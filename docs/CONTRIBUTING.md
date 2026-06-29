# Contributing to Time Tracker

First off, thanks for taking the time to contribute! 🎉

Here are the guidelines for contributing to this project.

## How Can I Contribute?

### Reporting Bugs
If you find a bug, please open an issue providing as much detail as possible:
- Steps to reproduce.
- Expected behavior.
- Actual behavior.
- Screenshots or example data dumps (make sure they contain no personal or sensitive data!).

### Suggesting Enhancements
Enhancements suggestions are welcome! Please open an issue describing your idea, why it would be useful, and how it should work under the serverless and Sober UI philosophy.

### Pull Requests
1. Fork the repo and create your branch from `main`.
2. Implement your changes.
3. If you added logical code, add tests in `src/__tests__/`.
4. Ensure all tests pass (`npm run test`).
5. Ensure your code follows the existing style and architecture (100% framework-agnostic business logic in `/core`, decoupled UI components).
6. Submit your Pull Request!

## Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jaiver/time-tracker.git
   cd time-tracker
   ```

2. **Install dependencies:**
   This project uses `npm` as its package manager.
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Run unit tests:**
   We use Vitest to run unit tests for our `core/` business logic layer.
   ```bash
   npm run test
   ```

## Architecture Overview
Please read [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) to understand how the codebase is organized before making significant changes.
