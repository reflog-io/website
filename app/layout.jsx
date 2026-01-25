import "./globals.css";

export const metadata = {
  title: {
    default: "Reflog",
    template: "%s | Reflog",
  },
  description: "The SQLite of Event Sourcing",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
