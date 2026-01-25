export default function SiteLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white antialiased selection:bg-reflog-500 selection:text-white">
      {children}
    </div>
  );
}
