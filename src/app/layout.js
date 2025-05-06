'use client'

import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import { ThemeProvider } from '@gravity-ui/uikit';



export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <ThemeProvider theme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
