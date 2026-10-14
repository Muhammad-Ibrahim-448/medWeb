
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Home Healthcare Services in [Service Area] | [Brand Name]",
  description:
    "Explore home healthcare options in [Service Area]. Learn which services may be available, what to expect, and how to enquire with [Brand Name].",
  keywords: [
    "home healthcare services",
    "home care services",
    "healthcare at home",
    "home nursing",
    "doctor at home",
  ],
  authors: [{ name: "[Brand Name]" }],
  openGraph: {
    title: "Home Healthcare Services | [Brand Name]",
    description:
      "Explore home healthcare options, understand available services, and learn how to enquire.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>

      <body
        className={`${inter.variable} font-sans antialiased theme-transition`}
        suppressHydrationWarning
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
