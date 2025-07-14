import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "../components/UserContext";
import MuiProvider from "../components/MuiProvider";
import { JobsProvider } from "../components/JobsContext";
import { NotificationsProvider } from "../components/NotificationsContext";
import { Box } from "@mui/material";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stanfield Demo",
  description: "Valuers Meeting Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <UserProvider>
          <NotificationsProvider>
            <JobsProvider>
              <MuiProvider>
                {/* NavBar removed */}
                <Box sx={{ pt: 0 }}>
                  {children}
                </Box>
              </MuiProvider>
            </JobsProvider>
          </NotificationsProvider>
        </UserProvider>
      </body>
    </html>
  );
}
