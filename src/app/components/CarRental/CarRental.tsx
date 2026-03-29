import React from "react";
import RentalRules from "./components/RentalRules";
import RentalForm from "./components/RentalForm";

const CarRental = () => {
    return (
        <section className="py-24 bg-gray-50/50 dark:bg-black overflow-hidden relative">
            <div className="container max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <RentalRules />
                    <RentalForm />
                </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[800px] bg-blue-600/5 dark:bg-blue-600/5 blur-[120px] rounded-full -z-0"></div>
        </section>
    );
}

export default CarRental;
