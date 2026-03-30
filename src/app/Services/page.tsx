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

  useEffect(() => {
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
