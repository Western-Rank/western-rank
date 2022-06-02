// pages/_app.js
import '../styles/globals.css'
import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }:AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}