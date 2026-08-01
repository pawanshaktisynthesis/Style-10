import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { Cursor } from "@/components/layout/Cursor";
import { Grain, Scrim, ScrollProgress } from "@/components/layout/Chrome";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Work } from "@/components/sections/Work";
import { Stack } from "@/components/sections/Stack";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { SceneMount } from "@/components/canvas/SceneMount";

export default function Home() {
  return (
    <SmoothScroll>
      <Preloader />
      <SceneMount />
      <Scrim />
      <Grain />
      <Cursor />
      {/* Nav owns the skip link, so it must precede the section rail — a
          keyboard user should reach "Skip to content" on the first Tab, not
          after eight progress-rail links. */}
      <Nav />
      <ScrollProgress />

      <main id="main">
        <Hero />
        <Manifesto />
        <About />
        <Services />
        <Process />
        <Work />
        <Stack />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
