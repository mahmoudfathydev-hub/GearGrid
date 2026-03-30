"use client";

import React from "react";
import { useAppSelector } from "@/hooks";
import {
  selectServices,
  selectServicesLoading,
  selectServicesError,
} from "@/store/services/servicesSelectors";

interface Service {
  id: number;
  title: string;
  description: string;
  benefits: string[];
  cta: string;
}

const staticServices: Service[] = [
  {
    id: 1,
    title: "Car Sales",
    description:
      "New and used vehicles with verified listings and competitive pricing",
    benefits: [
      "Verified vehicle history",
      "Transparent pricing",
      "Virtual tours available",
    ],
    cta: "Browse Cars",
  },
  {
    id: 2,
    title: "Car Rental",
    description: "Daily, weekly, and monthly rentals with flexible terms",
    benefits: [
      "Flexible duration options",
      "Insurance included",
      "Delivery available",
    ],
    cta: "Rent Now",
  },
  {
    id: 3,
    title: "Spare Parts Marketplace",
    description: "Genuine parts with fast delivery and best prices",
    benefits: [
      "Authentic parts only",
      "Next-day delivery",
      "Price match guarantee",
    ],
    cta: "Shop Parts",
  },
  {
    id: 4,
    title: "Car Color Change & Wrapping",
    description: "Professional wrapping with PPF protection for lasting finish",
    benefits: [
      "PPF protection included",
      "Custom designs available",
      "2-year warranty",
    ],
    cta: "Get Quote",
  },
  {
    id: 5,
    title: "Roadside Assistance",
    description: "24/7 winch service and emergency support across Egypt",
    benefits: [
      "24/7 availability",
      "30-minute response time",
      "Flatbed towing",
    ],
    cta: "Request Help",
  },
  {
    id: 6,
    title: "Inspection & Maintenance",
    description: "Comprehensive checks and regular maintenance services",
    benefits: [
      "Certified technicians",
      "Digital reports",
      "Scheduled reminders",
    ],
    cta: "Book Service",
  },
  {
    id: 7,
    title: "Battery Replacement",
    description: "On-site battery replacement service at your location",
    benefits: ["At your location", "30-minute service", "Warranty included"],
    cta: "Replace Battery",
  },
  {
    id: 8,
    title: "Car Insurance",
    description: "Comprehensive coverage plans with competitive premiums",
    benefits: ["Instant approval", "Multiple providers", "Claims assistance"],
    cta: "Get Insured",
  },
  {
    id: 9,
    title: "Car Financing",
    description: "Flexible installment plans with quick approval process",
    benefits: ["0% down payment", "Instant approval", "Flexible terms"],
    cta: "Apply Now",
  },
];

export default function ServicesGrid() {
  const dynamicServices = useAppSelector(selectServices);
  const loading = useAppSelector(selectServicesLoading);
  const error = useAppSelector(selectServicesError);

  console.log("ServicesGrid - dynamicServices:", dynamicServices);
  console.log("ServicesGrid - dynamicServices length:", dynamicServices.length);

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                  <div className="space-y-2 mb-6">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 006. 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707a1 1 0 00-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                    Error loading services
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{error}</p>
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-3 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Only show dynamic services from database
  const allServices = React.useMemo(() => {
    return dynamicServices.map((service) => ({
      id: service.id,
      title: service.name || "Service",
      description: service.desc || "No description available",
      benefits: [
        service.icon || "🔧",
        "Professional service",
        "Quick response",
      ],
      cta: "Learn More",
    }));
  }, [dynamicServices]);

  console.log("ServicesGrid - allServices:", allServices);
  console.log("ServicesGrid - allServices length:", allServices.length);

  if (allServices.length === 0) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0 0h6m-6 0h6"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No services available
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Add services through the dashboard to see them here.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allServices.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-2 mb-6">
                {service.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                {service.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
