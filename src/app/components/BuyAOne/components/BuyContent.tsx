import React, { forwardRef } from "react";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { BuyFeatures } from "@/app/components/BuyAOne/components/BuyFeatures";

export const BuyContent = forwardRef<HTMLDivElement, { children?: React.ReactNode }>(
  (_, ref) => {
    return (
      <div ref={ref} className="lg:w-1/2 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/5 dark:bg-blue-600/10 border border-blue-600/10 dark:border-blue-600/20">
          <Zap size={16} className="text-blue-600 fill-blue-600" />
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">Instant Purchase</span>
        </div>

        <h2 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white leading-tight">
          Buy in <span className="text-blue-600">30 min</span>.
          <br />
          Drive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Today</span>.
        </h2>

        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
          Experience the fastest car buying process in the industry. From selection to signature, we've streamlined everything for the modern driver.
        </p>

        <BuyFeatures />

        <div className="pt-6">
          <Link
            href="/Cars"
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 group"
          >
            Explore Inventory
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }
);

BuyContent.displayName = "BuyContent";
