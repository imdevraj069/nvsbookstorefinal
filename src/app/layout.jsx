import { Inter } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/layout/page-transition";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/lib/provider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import FloatingSupport from "@/components/floating"

import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/plugins.pkgd.min.css'; // All plugin styles
import 'froala-editor/css/themes/dark.min.css';   // Optional theme
import 'font-awesome/css/font-awesome.css';   

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nvsbookstore - Government Updates & Educational Store",
  description:
    "Latest government notifications, job updates, and educational resources",
  icons: {
    icon: "/favicon.ico", // path relative to public/
  },
  name:"google-site-verification",
  content:"0erX1NW53cNQgT0kn2oErK6NJzbPd3fEMbmRSM-Gg1Q"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="58kmXpJs2zFCjH4QktlPy8X0-Mev-zeZfigGGDDCluY" />
      </head>
      <body className={`${inter.className} pt-16`}>
        <GoogleAnalytics trackingId="G-ZTL8VDD24J" />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <PageTransition>
              <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                  className: "bg-gray-800 text-white",
                  style: {
                    fontSize: "0.875rem",
                    padding: "0.5rem 1rem",
                  },
                }}
              />
              <Navbar />
              {children}
              <FloatingSupport/>
              <Footer />
            </PageTransition>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
