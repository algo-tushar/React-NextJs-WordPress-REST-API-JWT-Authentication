import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
    const setInitialTheme = `
        (function() {
            const savedTheme = localStorage.getItem('theme');
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            const theme = savedTheme || systemTheme;
            document.documentElement.classList.add(theme);
        })();
    `;

    return (
        <Html>
        <Head />
        <body>
            <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
            <Main />
            <NextScript />
        </body>
        </Html>
    );
}