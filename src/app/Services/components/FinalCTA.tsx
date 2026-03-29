'use client';


export default function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
          Ready to Experience Better Car Services?
        </h2>
        <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
          Join thousands of satisfied customers who trust GearGrid for all their automotive needs
        </p>
        <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
          Get Started Today
        </button>
      </div>
    </section>
  );
}
