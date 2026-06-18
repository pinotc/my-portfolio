// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getGlobalSettings } from "@/server/actions/settings";
import { GoogleAnalytics } from "@next/third-parties/google";
// TypeScript may complain about missing type declarations for CSS imports in some setups.
// Suppress the error for this side-effect import.
// @ts-ignore
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
const inter = Inter({ subsets: ["latin"] });

// Gộp chung cấu hình SEO vào một hàm động duy nhất
export async function generateMetadata(): Promise<Metadata> {
  const config = await getGlobalSettings();
  
  return {
    // Ưu tiên tên từ Admin, nếu chưa cấu hình sẽ hiển thị tên mặc định
    title: config.siteName || "Le Dat Portfolio",
    description: "Connecting Manufacturing Operations, Data, and Technology.",
    icons: {
      icon: config.faviconUrl || "/favicon.ico",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.GOOGLE_ANALYTICS_ID;
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Mặc định là Dark Theme theo yêu cầu
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}