import React from "react";
import { ShieldCheck, Trophy, BadgeDollarSign, HeadphonesIcon } from "lucide-react";
import FeatureCard from "./components/FeatureCard";

const features = [
  {
    icon: Trophy,
    title: "Elite Selection",
    description: "Our inventory features only the most prestigious and high-performance vehicles, hand-picked for their excellence.",
  },
  {
    icon: ShieldCheck,
    title: "Certified Integrity",
    description: "Every vehicle is rigorously inspected by our master technicians to ensure the highest standards of safety and performance.",
  },
  {
    icon: BadgeDollarSign,
    title: "Bespoke Financing",
    description: "We offer tailored luxury financing solutions with competitive rates designed to match your unique financial profile.",
  },
  {
    icon: HeadphonesIcon,
    title: "Concierge Service",
    description: "Our dedicated specialists provide a seamless, personalized experience from initial inquiry to final delivery.",
  },
];

const WhyUs = () => {
  return (
    <section className="py-18 bg-white dark:bg-black overflow-hidden border-t border-gray-50 dark:border-gray-900">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-start max-w-3xl  mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/5 dark:bg-blue-600/10 border border-blue-600/10 dark:border-blue-600/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">Why Choose Us</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            The GearGrid{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              Difference
            </span>
          </h2>
          
          <p className="text-lg text-gray-500 dark:text-gray-400">
            We've redefined the automotive experience, combining elite performance with unparalleled luxury and service at every single step.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              index={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyUs;
