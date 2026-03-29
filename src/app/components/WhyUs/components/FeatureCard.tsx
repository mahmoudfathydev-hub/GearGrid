import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, index }) => {
  return (
    <div 
      className="group p-8 rounded-3xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-blue-600/30 hover:bg-white dark:hover:bg-gray-900 transition-all duration-500 hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
    >
      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
        <Icon size={28} />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      
      <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;
