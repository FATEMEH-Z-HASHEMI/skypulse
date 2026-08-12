import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

// Self-hosted (not next/font/google): this sandbox can't reach
// fonts.googleapis.com, and self-hosting avoids a third-party request in
// production too. Variable weight 100–900, licensed under OFL — see
// assets/fonts/VAZIRMATN-OFL.txt.
const vazirmatn = localFont({
  src: "../assets/fonts/Vazirmatn-Variable.woff2",
  variable: "--font-vazirmatn",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "پیش‌بینی آب‌وهوا | Weather Intelligence",
    template: "%s | Weather Intelligence",
  },
  description:
    "داشبورد هوشمند آب‌وهوا با پیش‌بینی ساعتی و هفتگی، کیفیت هوا و نمودارهای تعاملی.",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f17" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
