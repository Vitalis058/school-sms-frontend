import About from "@/components/pages/HomePage/About";
import FAQs from "@/components/pages/HomePage/FAQs";
import FeatureGrid from "@/components/pages/HomePage/FeatureGrid";
import Hero from "@/components/pages/HomePage/Hero";
import Trusted from "@/components/pages/HomePage/Trusted";
import WhyChooseUs from "@/components/pages/HomePage/WhyChooseUs";
import React from "react";

function Home() {
  return (
    <div>
      <Hero />
      <Trusted />
      <About />
      <FeatureGrid />
      <WhyChooseUs />
      <FAQs />
    </div>
  );
}

export default Home;
