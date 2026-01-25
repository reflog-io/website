import { Layout, Navbar } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import "./docs-theme.css";

export const metadata = {
  title: {
    default: "Reflog Docs",
    template: "%s | Reflog Docs",
  },
};

export default async function DocsLayout({ children }) {
  return (
    <>
      <Layout
        navbar={
          <Navbar
            logo={
              <span className="text-2xl font-bold tracking-tight text-white">
                Reflog<span className="text-reflog-400">.</span>
              </span>
            }
          />
        }
        pageMap={await getPageMap("/docs")}
        darkMode={false}
        nextThemes={{
          defaultTheme: "dark",
          forcedTheme: "dark",
        }}
      >
        {children}
      </Layout>
    </>
  );
}
