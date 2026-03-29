'use client';


interface Service {
  id: number;
  title: string;
  description: string;
  benefits: string[];
  cta: string;
}

const services: Service[] = [
  {
    id: 1,
    title: "Car Sales",
    description: "New and used vehicles with verified listings and competitive pricing",
    benefits: [
      "Verified vehicle history",
      "Transparent pricing",
      "Virtual tours available"
    ],
    cta: "Browse Cars"
  },
  {
    id: 2,
    title: "Car Rental",
    description: "Daily, weekly, and monthly rentals with flexible terms",
    benefits: [
      "Flexible duration options",
      "Insurance included",
      "Delivery available"
    ],
    cta: "Rent Now"
  },
  {
    id: 3,
    title: "Spare Parts Marketplace",
    description: "Genuine parts with fast delivery and best prices",
    benefits: [
      "Authentic parts only",
      "Next-day delivery",
      "Price match guarantee"
    ],
    cta: "Shop Parts"
  },
  {
    id: 4,
    title: "Car Color Change & Wrapping",
    description: "Professional wrapping with PPF protection for lasting finish",
    benefits: [
      "PPF protection included",
      "Custom designs available",
      "2-year warranty"
    ],
    cta: "Get Quote"
  },
  {
    id: 5,
    title: "Roadside Assistance",
    description: "24/7 winch service and emergency support across Egypt",
    benefits: [
      "24/7 availability",
      "30-minute response time",
      "Flatbed towing"
    ],
    cta: "Request Help"
  },
  {
    id: 6,
    title: "Inspection & Maintenance",
    description: "Comprehensive checks and regular maintenance services",
    benefits: [
      "Certified technicians",
      "Digital reports",
      "Scheduled reminders"
    ],
    cta: "Book Service"
  },
  {
    id: 7,
    title: "Battery Replacement",
    description: "On-site battery replacement service at your location",
    benefits: [
      "At your location",
      "30-minute service",
      "Warranty included"
    ],
    cta: "Replace Battery"
  },
  {
    id: 8,
    title: "Car Insurance",
    description: "Comprehensive coverage plans with competitive premiums",
    benefits: [
      "Instant approval",
      "Multiple providers",
      "Claims assistance"
    ],
    cta: "Get Insured"
  },
  {
    id: 9,
    title: "Car Financing",
    description: "Flexible installment plans with quick approval process",
    benefits: [
      "0% down payment",
      "Instant approval",
      "Flexible terms"
    ],
    cta: "Apply Now"
  }
];

export default function ServicesGrid() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
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
