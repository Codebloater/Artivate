import "./globals.css";
import ReduxProvider from "@/redux/provider";

export const metadata = {
  title: "Artivate",
  description: "Explore the World of DAO",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
