import Hero from "./components/Hero/Hero";
import FeaturedCars from "./components/FeaturedCars/FeaturedCars";
import WhyUs from "./components/WhyUs/WhyUs";
import CarRental from "./components/CarRental/CarRental";
import BuyAOne from "./components/BuyAOne/BuyAOne";

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Show unauthorized access message if redirected from dashboard
  const errorMessage =
    searchParams?.error === "unauthorized"
      ? "Access denied. You must be an admin to access the dashboard."
      : null;

  return (
    <>
      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">Unauthorized Access</p>
          <p>{errorMessage}</p>
        </div>
      )}
      <Hero />
      <FeaturedCars />
      <WhyUs />
      <CarRental />
      <BuyAOne />
    </>
  );
}
