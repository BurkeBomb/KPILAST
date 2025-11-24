// Import the global stylesheet for all routes. The file lives in the same folder.
import "./global.css";
import { ThemeScript } from "@/components/Theme";

export const metadata = {
  title: "ERA KPI Dashboard — Pro",
  description: "Ops-only KPIs with True PMB and evidence tooling",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeScript />
        <div className="min-h-screen" data-theme="ctrl">
          <div className="max-w-7xl mx-auto p-4 md:p-8">{children}</div>
        </div>
      </body>
    </html>
  );
}
