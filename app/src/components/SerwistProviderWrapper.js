'use client';

import { SerwistProvider } from "@serwist/turbopack/react";

export default function SerwistProviderWrapper({ children }) {
  return (
    <SerwistProvider swUrl="/serwist/sw.js">
      {children}
    </SerwistProvider>
  );
}
