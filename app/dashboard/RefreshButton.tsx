'use client';

import { useState } from "react";

export default function RefreshButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
        >
            {isLoading ? "Frissítés..." : "Adatok frissítése"}
        </button>
    )
}