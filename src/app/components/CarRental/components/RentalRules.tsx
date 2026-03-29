import { UserCheck, FileText, ShieldAlert, Sparkles } from "lucide-react";

const rules = [
  {
    icon: UserCheck,
    title: "Age Requirement",
    description: "Drivers must be 21 years or older for standard models and 25+ for premium collections.",
  },
  {
    icon: FileText,
    title: "Documentation",
    description: "Valid driver's license, passport (for international), and a major credit card are required.",
  },
  {
    icon: ShieldAlert,
    title: "Insurance Coverage",
    description: "Standard CDR insurance is included. Premium total coverage options available on request.",
  },
  {
    icon: Sparkles,
    title: "Vehicle Care",
    description: "Vehicles are provided with a full tank and should be returned in similar clean condition.",
  },
];

const RentalRules = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            Rental{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              Guidelines
            </span>
          </h2>
        <p className="text-gray-500 dark:text-gray-400">Please review our standard requirements for a seamless rental experience with GearGrid.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {rules.map((rule, index) => (
          <div key={index} className="flex gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/60">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
              <rule.icon size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">{rule.title}</h4>
              <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{rule.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-6 rounded-2xl bg-blue-600/5 border border-blue-600/20">
        <p className="text-sm text-blue-700 dark:text-blue-400 italic">
          <strong>Note:</strong> Specialized supercars may have additional terms and higher security deposit requirements.
        </p>
      </div>
    </div>
  );
}

export default RentalRules;
