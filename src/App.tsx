/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/Navbar";
import BrandsMarquee from "./components/BrandsMarquee";
import Hero from "./components/Hero";
import ServicesBar from "./components/ServicesBar";
import CountdownTimer from "./components/CountdownTimer";
import Differentials from "./components/Differentials";
import Stock from "./components/Stock";
import HowItWorks from "./components/HowItWorks";
import VehicleValuation from "./components/VehicleValuation";
import Financing from "./components/Financing";
import Testimonials from "./components/Testimonials";
import GalleryLightbox from "./components/GalleryLightbox";
import InstagramFeed from "./components/InstagramFeed";
import Contact from "./components/Contact";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  return (
    <div className="min-h-screen bg-[#F5F4F0] font-['DM_Sans'] selection:bg-[#C41E1E] selection:text-white">
      <Navbar />
      <ServicesBar />
      <CountdownTimer />
      <BrandsMarquee />

      <main>
        <Hero />
        <Differentials />
        <Stock />
        <HowItWorks />
        <VehicleValuation />
        <Financing />
        <Testimonials />
        <GalleryLightbox />
        <InstagramFeed />
        <Contact />
        <FinalCTA />
      </main>

      <Footer />
      <WhatsAppButton />
      <AdminPanel />
    </div>
  );
}
