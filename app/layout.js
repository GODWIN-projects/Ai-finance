import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"
import Header from "@/components/header";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smart Finance",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>

        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
            <ClerkLoaded>

            {/* header */}
            <Header/>
            <main className="min-h-screen">
              {children}
            </main>
            <Toaster richColors />
            {/* footer */}
            <footer className="bg-blue-950 py-12">
              <div className="container mx-auto text-center
              text-gray-300 px-4">
                <p>Made by GODWIN K</p>
              </div>
            </footer>
                </ClerkLoaded>
          </body>
        </html>
    </ClerkProvider>
  );
}
