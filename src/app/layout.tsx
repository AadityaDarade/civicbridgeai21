import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from '@/components/ClientProviders';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CivicBridge AI — Complex Problems, Clear Next Steps",
  description: "Turn confusing documents, urgent situations, and complicated public services into clear, personalized actions with AI-powered assistance.",
  keywords: "civic tech, government schemes, public services, AI assistant, disaster preparedness, document understanding",
  openGraph: {
    title: "CivicBridge AI",
    description: "AI-powered guidance for navigating public services and complex systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
