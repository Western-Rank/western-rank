import '../styles/globals.scss'
import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import type { AppProps } from 'next/app'
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider, createTheme } from '@mui/material'

export default function App({ Component, pageProps }:AppProps) {

  const theme = createTheme({
    palette: {
      background: {
        default: "#F9F9F9"
      },
      primary: {
        main: "#FFFFFF",
      },
      secondary: {
        main: "#731FE0",
      }
    },

    typography: {
      body1: {
        fontSize: 14
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
    }

  })

  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </UserProvider>
  );
}