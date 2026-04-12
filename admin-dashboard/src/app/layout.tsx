import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
  title: "ZimCart | Admin Dashboard",
  description: "Enterprise-grade management console for ZimCart Mart & Logistics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* Hydration warnings on <div hidden> with bis_skin_checked come from antivirus/browser extensions
     (e.g. Bitdefender), not from this app — exclude localhost from scanning or use a clean browser profile. */
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <NextTopLoader
          color="#10b981"
          initialPosition={0.08}
          crawlSpeed={200}
          height={4}
          showSpinner={false}
          shadow="0 0 10px #10b981,0 0 5px #10b981"
          easing="ease"
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
