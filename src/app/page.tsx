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

export default function Home() {
  return (
    <>
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
      <Certificates />
      <CareerPlatforms />
      <Platforms />
      <Expertise />
      <Contact />
    </>
  );
}
