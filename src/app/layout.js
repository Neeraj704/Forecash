import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Forecash",
  description: "Fintech App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}