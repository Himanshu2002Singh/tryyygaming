import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import Navbar from "./components/Navbar/Navbar";
import { BottomSheetProvider } from "./context/BottomSheet";
import { NavProvider } from "./context/BottomNavigation";
import ClientWrapper from "./utils/bottomnavbarwrapper";
import LayoutWrapper from "./utils/adminpagewrapper";
import { AuthProvider } from "./context/authprovider";
import { UserBankProvider } from "./context/userbankprovider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BetfairPanel",
  description: "BetfairPanel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <UserBankProvider>
            <NavProvider>
              <BottomSheetProvider>
                <LayoutWrapper
                  navbar={<Navbar />}
                  bottomNav={<ClientWrapper />}
                >
                  {children}
                </LayoutWrapper>
              </BottomSheetProvider>
            </NavProvider>
          </UserBankProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
