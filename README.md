# Harry Potter - Character Explorer

> A React application developed for a technical challenge, allowing users to explore characters from the Harry Potter universe, built with a modern, high-performance tech stack.

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a>
</p>

---

## ✨ Features

- **Character Lists**: Browse dedicated pages for all characters, students, and staff members.
- **Detailed View**: Click on any character to see a detailed page with more information.
- **Dynamic Filtering & Sorting**: A comprehensive set of client-side filters on the "All Characters" page, with state managed in the URL.
- **Favorites System**: Mark characters as favorites, with preferences saved locally in the browser.
- **House Selection**: Choose a preferred Hogwarts house to customize the experience.
- **Intelligent Caching**: A smart data-fetching strategy that loads all characters once and uses a cache to make navigation to sub-pages (like Students and Staff) instantaneous.
- **Responsive Design**: A clean and modern UI that works seamlessly on both desktop and mobile devices.

## 🛠️ Tech Stack

This project was built with a focus on modern, efficient, and scalable technologies:

- **Framework**: React 19
- **Bundler**: Vite
- **Routing**: React Router v7 (Framework Mode)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/UI, Radix UI
- **Data Fetching & Caching**: TanStack Query (React Query)
- **State Management**: Zustand (with `persist` middleware)
- **Icons**: Lucide React

## 🚀 Getting Started

To run this project locally, you'll need [Node.js](https://nodejs.org/en/) and `npm` installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AZagatti/hp-mischief-managed
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd hp-mischief-managed
    ```

3.  **Install the dependencies:**
    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## 👁️ Preview

![Application Preview](https://res.cloudinary.com/zagatti/image/upload/v1749938852/readme/hp-preview.gif)

---

Made with ♥ by [André Zagatti](https://www.linkedin.com/in/andre-zagatti/)
