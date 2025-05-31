import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AboutHero from "../components/AboutHero";
import AboutStats from "../components/AboutStats";
import AboutTeam from "../components/AboutTeam";
import AboutFeatures from "../components/AboutFeatures";
import Breadcrumb from "../components/Breadcrumb";

export default function About() {
  return (
    <div className="bg-white" dir="rtl" style={{textAlign: 'right'}}>
      <Header />
      <Breadcrumb items={[
        { label: "من نحن", to: "/about" }
      ]} />
      <AboutHero />
      <AboutStats />
      <AboutTeam />
      <AboutFeatures />
      <Footer />
    </div>
  );
} 