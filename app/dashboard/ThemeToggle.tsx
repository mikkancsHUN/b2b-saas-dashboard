'use client';

import { useState } from "react";

export default function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(false);

    const toggleTheme = () => {
        const nextMode = !darkMode;
        setDarkMode(nextMode);

        if (nextMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <button
        onClick={toggleTheme}
        className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
        >
        {darkMode ? "🌙 Sötét mód" : "☀️ Világos mód"}
        </button>
    )
}