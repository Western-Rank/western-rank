import '../styles/globals.scss'
import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import type { AppProps } from 'next/app'
import { ThemeProvider, createTheme } from '@mui/material'

export default function App({ Component, pageProps }:AppProps) {

  const theme = createTheme({
    palette: {
      primary: {
        main: "#FFFFFF"
      },
      secondary: {
        main: "#731FE0"
      }
    },

    typography: {
      fontFamily: [
        "Lexend",
        "Arial"
      ].join(',')
    }

  })

  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </UserProvider>
  );
}