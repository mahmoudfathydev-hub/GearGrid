'use client';

export default function ServicesHero() {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-20 lg:py-32">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
          Complete Car Services
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            One Platform
          </span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
          From buying to maintenance, GearGrid handles everything your car needs
        </p>
        <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl">
          Explore All Services
        </button>
      </div>
    </section>
  );
}
