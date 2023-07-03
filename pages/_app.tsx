import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { DM_Sans } from "next/font/google";

const queryClient = new QueryClient();
export const dm_sans = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  fallback: ["Inter", "sans-serif"],
});

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <main className={`${dm_sans.className}`}>
          <Component {...pageProps} />
          <Analytics />
        </main>
        <Toaster />
      </QueryClientProvider>
    </SessionProvider>
  );
}
