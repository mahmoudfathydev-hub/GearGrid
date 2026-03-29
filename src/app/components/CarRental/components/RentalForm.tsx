"use client";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Send } from "lucide-react";

const RentalForm = () => {
  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reserve Your Drive</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-start">Submit an inquiry and our concierge team will contact you shortly.</p>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe"
              className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
            <input 
              type="email" 
              placeholder="john@example.com"
              className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Car Type</label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="luxury">Luxury Sedan</SelectItem>
              <SelectItem value="sport">Sport / Supercar</SelectItem>
              <SelectItem value="suv">Premium SUV</SelectItem>
              <SelectItem value="electric">Electric Performance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Rental Duration</label>
          <input 
            type="text" 
            placeholder="e.g. 3 Days"
            className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
          />
        </div>

        <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all duration-300 mt-4 group">
          Send Inquiry
          <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </form>
    </div>
  );
}

export default RentalForm;
