/*
 * DESIGN: Heritage British Trade Signage
 * Main page — assembles Navbar, Hero, Services, About, WhyUs, Contact, Footer.
 * Dark theme throughout: #0C0C0C / #111111 / #161616 backgrounds with gold accents.
 */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AreasCoveredSection from "@/components/AreasCoveredSection";
import ServicesSection from "@/components/ServicesSection";
import GuaranteeCallout from "@/components/GuaranteeCallout";
import AboutSection from "@/components/AboutSection";
import WhyUsSection from "@/components/WhyUsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import TrustpilotSection from "@/components/TrustpilotSection";
import Footer from "@/components/Footer";
import MobileQuickActions from "@/components/MobileQuickActions";

export default function Home() {
  return (
    <div className="min-h-screen pb-24 md:pb-0" style={{ background: "#0C0C0C" }}>
      <Navbar />
      <HeroSection />
      <AreasCoveredSection />
      <ServicesSection />
      <GuaranteeCallout />
      <AboutSection />
      <WhyUsSection />
      <TestimonialsSection />
      <ContactSection />
      <TrustpilotSection />
      <Footer />
      <MobileQuickActions />
    </div>
  );
}
