import { CtaBand } from "@/components/sections/CtaBand";
import { SimpleHero } from "@/components/sections/PageHero";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { Container } from "@/components/ui/layout";
import { getPage, getProjects, getSettings } from "@/lib/content/queries";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("projects");

export default async function ProjectsPage() {
  const [page, settings, projects] = await Promise.all([getPage("projects"), getSettings(), getProjects()]);
  const hasIllustrative = projects.some((p) => p.illustrative);

  return (
    <>
      <SimpleHero hero={page.hero} crumbs={[{ label: "Projects", href: "/projects" }]} />
      <section className="bg-white py-12 sm:py-16" aria-label="Project gallery">
        <Container>
          <ProjectGallery projects={projects} />
          {hasIllustrative && (
            <p className="mt-10 border-t border-line pt-6 text-sm text-muted">
              Images labelled “Illustrative example” are generated examples used to show the type of work we do. They are not
              completed Handyman 4 Calgary client projects.
            </p>
          )}
        </Container>
      </section>
      <CtaBand
        title="Have a project in mind?"
        copy="Tell us about your home or business property and we will help you plan the next step."
        href={page.hero.ctaHref || "/request-a-quote"}
        label={page.hero.ctaLabel || "Request a Quote"}
        phone={settings.phone}
        phoneHref={settings.phoneHref}
      />
    </>
  );
}
