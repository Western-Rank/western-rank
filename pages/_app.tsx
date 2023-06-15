import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

import { Toaster } from "@/components/ui/toaster";

import "@/styles/globals.css";
import "@fontsource/lexend";
import "@fontsource/open-sans";
import "@fontsource/poppins";

const queryClient = new QueryClient();

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <Toaster />
      </QueryClientProvider>
    </SessionProvider>
  );
}
