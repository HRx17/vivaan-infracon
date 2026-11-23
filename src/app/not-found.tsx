import { getSettings } from "@/lib/data";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import NotFound from "./(site)/not-found";

export default async function RootNotFound() {
  const settings = await getSettings();
  return (
    <>
      <Navbar brand={settings.brandName} />
      <main id="main"><NotFound /></main>
      <Footer settings={settings} />
    </>
  );
}
