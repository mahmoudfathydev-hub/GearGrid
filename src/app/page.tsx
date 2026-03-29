import Hero from "./components/Hero/Hero";
import FeaturedCars from "./components/FeaturedCars/FeaturedCars";
import WhyUs from "./components/WhyUs/WhyUs";
import CarRental from "./components/CarRental/CarRental";
import BuyAOne from "./components/BuyAOne/BuyAOne";

export default function Home() {
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
