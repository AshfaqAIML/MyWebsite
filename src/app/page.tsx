import { Hero } from "@/components/sections/hero";
import { ScrollToBottom } from "@/components/ui/scroll-to-bottom";
import { About } from "@/components/sections/about";
import { Websites } from "@/components/sections/websites";
import { Socials } from "@/components/sections/socials";
import { Projects } from "@/components/sections/projects";
import { DigitalWorld } from "@/components/sections/digital-world";
import { Books } from "@/components/sections/books";
import { Articles } from "@/components/sections/articles";
import { PublicationsSection } from "@/components/sections/publications";
import { CareerPlatforms } from "@/components/sections/career";
import { Platforms } from "@/components/sections/freelancing";
import { Expertise } from "@/components/sections/services";
import { Contact } from "@/components/sections/contact";
import { Certificates } from "@/components/certificates/certificates";
import { ResumeSection } from "@/components/resume/resume-section";
import { getSiteConfig, getProfile } from "@/lib/data";
import { WebsiteJsonLd, PersonJsonLd } from "@/components/seo/json-ld";

export default function Home() {
  const config = getSiteConfig();
  const profile = getProfile();

  return (
    <>
      <WebsiteJsonLd
        name={config.name}
        url={config.url}
        description={config.description}
      />
      <PersonJsonLd
        name={config.author}
        url={config.url}
        image={`${config.url.replace(/\/$/, "")}${config.ogImage}`}
        jobTitle={profile.roles}
        sameAs={[
          config.links.github,
          config.links.linkedin,
          config.links.twitter,
        ].filter((s): s is string => Boolean(s))}
        knowsAbout={profile.roles}
      />
      <Hero />
      <ScrollToBottom />
      <About />
      <Websites />
      <Socials />
      <Projects />
      <DigitalWorld />
      <Books />
      <Articles />
      <PublicationsSection />
      <ResumeSection />
      <Certificates />
      <CareerPlatforms />
      <Platforms />
      <Expertise />
      <Contact />
    </>
  );
}
