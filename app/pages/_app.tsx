import type { AppProps } from "next/app";
import "@/styles/globals.css";
import NavBar from "@/components/nav";
import Footer from "@/components/footer";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider, ProductProvider } from "../context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col justify-between`}
    >
      <ProductProvider>
        <CartProvider>
          <NavBar />
          <Component {...pageProps} />
          <Footer />
        </CartProvider>
      </ProductProvider>
    </div>
  );
}
