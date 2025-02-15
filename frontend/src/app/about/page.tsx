import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Page | Free Next.js Template for Startup and SaaS",
  description: "This is About Page for Startup Nextjs Template",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="About Page"
        description="PublicSpace AI (PSI) is redefining smart spaces with advanced AI and IoT solutions. Our cutting-edge technology enhances public safety, optimizes resource management, and improves user experiences in shared environments. From intelligent surveillance to real-time analytics, PSI empowers cities, businesses, and institutions with data-driven insights for a safer, more efficient future."
      />
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
