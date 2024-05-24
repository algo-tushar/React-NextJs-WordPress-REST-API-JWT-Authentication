import "@/styles/globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import ThemeSwitcher from '../components/ThemeSwitcher';

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
	const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

	return (
		<GoogleOAuthProvider clientId={clientId}>
			<main className={`flex max-h-screen flex-col items-center justify-between mx-10 ${inter.className}`}>
				<Component {...pageProps} />
			</main>
			<ThemeSwitcher />
		</GoogleOAuthProvider>
	);
}