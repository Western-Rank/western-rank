import { UserProvider } from "@auth0/nextjs-auth0"
import { ThemeProvider, createTheme } from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { AppProps } from "next/app"
import GoogleProvider from "next-auth/providers/google"

import "../styles/globals.scss"
import "@fontsource/lexend"
import "@fontsource/open-sans"
import "@fontsource/poppins"

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
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
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </QueryClientProvider>
    </UserProvider>
  )
}
