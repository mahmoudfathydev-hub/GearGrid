'use client';


const benefits = [
  "Verified service providers",
  "Transparent pricing guaranteed",
  "24/7 customer support",
  "Quick booking process",
  "Quality assurance",
  "Flexible payment options"
];

export default function WhyChoose() {
  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose GearGrid
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span className="text-gray-900 dark:text-white font-medium">
                {benefit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
