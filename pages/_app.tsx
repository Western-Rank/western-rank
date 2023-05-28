import { ThemeProvider, createTheme } from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"

import "@fontsource/lexend"
import "@fontsource/open-sans"
import "@fontsource/poppins"
import "../styles/globals.scss"

const queryClient = new QueryClient()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const theme = createTheme({
    palette: {
      background: {
        default: "#F9F9F9",
      },
      primary: {
        main: "#FFFFFF",
      },
      secondary: {
        main: "#731FE0",
      },
    },

    typography: {
      fontFamily: "Lexend",

      h4: {
        fontWeight: "bold",
        marginBottom: 16,
      },

      h5: {
        fontWeight: "medium",
        marginBottom: 16,
      },

      body1: {
        fontSize: 14,
        fontFamily: "Lexend",
        marginBottom: 16,
      },
    },

    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1100,
        xl: 1536,
      },
    },
  })

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
