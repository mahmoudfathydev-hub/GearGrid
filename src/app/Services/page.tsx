"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  selectServices,
  fetchServices,
} from "@/store/services/servicesSelectors";
import ServicesHero from "./components/ServicesHero";
import ServicesGrid from "./components/ServicesGrid";
import Coverage from "./components/Coverage";
import HowItWorks from "./components/HowItWorks";
import WhyChoose from "./components/WhyChoose";
import FinalCTA from "./components/FinalCTA";

export default function Services() {
  const dispatch = useAppDispatch();
  const services = useAppSelector(selectServices);

  console.log("Services page - services from Redux:", services);
  console.log("Services page - services length:", services.length);

  useEffect(() => {
    console.log("Services page - About to fetchServices");
    dispatch(fetchServices());
  }, [dispatch]);

  return (
    <main>
      <ServicesHero />
      <ServicesGrid />
      <Coverage />
      <HowItWorks />
      <WhyChoose />
      <FinalCTA />
    </main>
  );
}
