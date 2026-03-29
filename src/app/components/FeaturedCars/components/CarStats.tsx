import { Zap, CircleGauge, Activity } from "lucide-react";

interface CarStatsProps {
  hp: number;
  topSpeed: string;
  acceleration: string;
}

const CarStats: React.FC<CarStatsProps> = ({ hp, topSpeed, acceleration }) => {
  return (
    <div className="grid grid-cols-3 border-y border-gray-100 dark:border-gray-800 py-4 mb-6">
      <div className="flex flex-col items-center gap-1">
        <Zap size={14} className="text-blue-600" />
        <span className="text-sm font-bold text-gray-900 dark:text-white">{hp}</span>
        <span className="text-[10px] text-gray-400 uppercase font-medium">HP</span>
      </div>
      <div className="flex flex-col items-center gap-1 border-x border-gray-100 dark:border-gray-800">
        <CircleGauge size={14} className="text-blue-600" />
        <span className="text-sm font-bold text-gray-900 dark:text-white">{topSpeed.split(' ')[0]}</span>
        <span className="text-[10px] text-gray-400 uppercase font-medium">MPH</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Activity size={14} className="text-blue-600" />
        <span className="text-sm font-bold text-gray-900 dark:text-white">{acceleration}</span>
        <span className="text-[10px] text-gray-400 uppercase font-medium">0-60</span>
      </div>
    </div>
  );
}

export default CarStats;
