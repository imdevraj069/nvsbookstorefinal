import { Inter } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/layout/page-transition";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/lib/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nvsbookstore - Government Updates & Educational Store",
  description:
    "Latest government notifications, job updates, and educational resources",
  icons: {
    icon: "/favicon.ico", // path relative to public/
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} pt-16`}>
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
              <Footer />
            </PageTransition>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
