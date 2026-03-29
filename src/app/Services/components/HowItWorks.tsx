'use client';

const steps = [
  {
    id: 1,
    title: "Choose Your Service",
    description: "Select from our comprehensive range of automotive services tailored to your needs"
  },
  {
    id: 2,
    title: "Book Instantly",
    description: "Schedule your service online with real-time availability and transparent pricing"
  },
  {
    id: 3,
    title: "Get Service Done",
    description: "Professional technicians deliver quality service at your preferred location"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How GearGrid Works
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                {step.id}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
