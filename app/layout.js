import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import FlashOffer from "@/components/FlashOffer";

const montserrat = Montserrat({ subsets: ["latin"], weight: ['400', '700'], variable: "--font-montserrat" });
const poppins = Poppins({ subsets: ["latin"], weight: ['300', '400', '600'], variable: "--font-poppins" });

export const metadata = {
    title: "CafeToo - Cyber Canteen",
    description: "Next-gen canteen ordering system",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${montserrat.variable} ${poppins.variable} font-sans bg-darkBg text-white antialiased`}>
                <CartProvider>
                    <FlashOffer />
                    {children}
                </CartProvider>
            </body>
        </html>
    );
}
