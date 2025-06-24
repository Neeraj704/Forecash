import AboutUs from "../components/AboutUs";
import Contact from "../components/Contact";
import FeatureSection from "../components/Features";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/Hero";

export default function HomePage() {
  return (
    <div className="relative border overflow-hidden">
      <div className="absolute top-0 ">
        <Header />
      </div>
      <HeroSection />
      <AboutUs />
      <FeatureSection />
      <Contact />
      <Footer />
    </div>
  );
}
