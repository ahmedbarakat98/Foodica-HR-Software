import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foodica HR",
  description: "Lightweight HR management portal"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
