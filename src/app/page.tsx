import Hero from "./components/Hero/Hero";
import FeaturedCars from "./components/FeaturedCars/FeaturedCars";
import WhyUs from "./components/WhyUs/WhyUs";
import CarRental from "./components/CarRental/CarRental";
import BuyAOne from "./components/BuyAOne/BuyAOne";
import { AccessMessage } from "@/components/auth/AccessMessage";

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Check if there's an access error message
  const hasError = searchParams?.error;

  // If there's an error, show the access message instead of the home page
  if (hasError) {
    return <AccessMessage />;
  }

  return (
    <>
      <Hero />
      <FeaturedCars />
      <WhyUs />
      <CarRental />
      <BuyAOne />
    </>
  );
}
