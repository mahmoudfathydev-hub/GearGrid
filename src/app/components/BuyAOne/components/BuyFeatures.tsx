import React from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";

export const BuyFeatures = () => {
    return (
        <div className="flex flex-wrap gap-6 pt-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-blue-600 border border-gray-100 dark:border-gray-800">
                    <ShieldCheck size={20} />
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Certified Quality</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-blue-600 border border-gray-100 dark:border-gray-800">
                    <ArrowRight size={20} />
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Direct Delivery</span>
            </div>
        </div>
    );
};
