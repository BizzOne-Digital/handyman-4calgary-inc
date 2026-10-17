import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { UtilityBar } from "@/components/site/UtilityBar";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/layout";
import { getSettings } from "@/lib/content/queries";

export const metadata = { title: "Page not found | Handyman 4 Calgary", robots: { index: false } };

export default async function NotFound() {
  const settings = await getSettings();
  return (
    <>
      <UtilityBar settings={settings} />
      <Header logoUrl={settings.logoUrl} logoAlt={settings.logoAlt} phone={settings.phone} phoneHref={settings.phoneHref} email={settings.email} />
      <main id="main">
        <section className="bg-mist py-20 sm:py-28">
          <Container className="text-center">
            <p className="eyebrow">Page not found</p>
            <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">We couldn’t find that page.</h1>
            <p className="mx-auto mt-4 max-w-md text-muted">The link may be outdated. Choose a service area below or go back to the homepage.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/residential" variant="outline">Residential</ButtonLink>
              <ButtonLink href="/commercial-industrial" variant="outline">Commercial &amp; Industrial</ButtonLink>
              <ButtonLink href="/">Home</ButtonLink>
            </div>
          </Container>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
