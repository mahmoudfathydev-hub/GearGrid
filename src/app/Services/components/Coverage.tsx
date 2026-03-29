'use client';

export default function Coverage() {
  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Serving Egypt's Major Cities
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Professional car services available in Cairo and Alexandria with rapid response times
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
              Cairo
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Full coverage across Greater Cairo including New Cairo, 6th of October, and all districts
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                24/7 roadside assistance
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Same-day service available
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-4">
              Alexandria
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Complete service coverage throughout Alexandria and surrounding coastal areas
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Specialized coastal services
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Emergency response teams
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
