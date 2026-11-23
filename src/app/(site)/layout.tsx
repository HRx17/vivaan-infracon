import { getSettings } from "@/lib/data";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <Navbar brand={settings.brandName} />
      <main id="main">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
