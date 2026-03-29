import React from "react";
import { CreditCard, TrendingUp, Users, Calendar } from "lucide-react";
import { InstallmentAnalytics } from "../hooks/useInstallmentAnalytics";

interface InstallmentStatsCardProps {
  data: InstallmentAnalytics | null;
  loading: boolean;
}

export const InstallmentStatsCard: React.FC<InstallmentStatsCardProps> = ({
  data,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center text-gray-500 py-8">
          <CreditCard className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No installment data available</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: "Total Customers",
      value: data.total_customers.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Installments",
      value: data.active_installments.toLocaleString(),
      icon: CreditCard,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(data.monthly_revenue),
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Avg. Duration",
      value: `${data.average_months} months`,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Installment Analytics
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <IconComponent className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Completion Rate</span>
          <span className="text-sm font-semibold text-gray-900">
            {data.completion_rate.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${data.completion_rate}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Receivable</span>
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(data.total_receivable)}
          </span>
        </div>
      </div>
    </div>
  );
};
