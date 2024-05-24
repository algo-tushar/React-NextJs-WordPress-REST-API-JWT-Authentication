import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

const ThemeSwitcher = () => {
    const [theme, setTheme] = useState(null);

    useEffect(() => {
        const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(currentTheme);
    }, []);

    useEffect(() => {
        if (theme) {
            document.documentElement.classList.remove(theme === 'dark' ? 'light' : 'dark');
            document.documentElement.classList.add(theme);
            localStorage.setItem('theme', theme);
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    if (!theme) return null; // Avoid rendering until theme is determined
    
    return (
        <button
        onClick={toggleTheme}
        className="fixed bottom-4 right-4 p-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full flex items-center justify-center"
        aria-label="Toggle theme"
        >
        {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
    );
};

export default ThemeSwitcher;