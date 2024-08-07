import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import ToasterProvider from "@/components/providers/toaster-provider";
import "@uploadthing/react/styles.css";
import { ConfettiProvider } from "@/components/providers/confetti-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "LMS App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={inter.className}>
					<ConfettiProvider />
					{children}
					<ToasterProvider />
				</body>
			</html>
		</ClerkProvider>
	);
}
