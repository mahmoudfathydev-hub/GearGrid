interface CarsHeaderProps {}

export default function CarsHeader({}: CarsHeaderProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
        Available Cars
      </h2>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
        Browse our selection of premium vehicles
      </p>
    </div>
  )
}
