"use client";

import React, { useState } from "react";
import { useFetchInstallmentCustomers } from "../hooks/useFetchInstallmentCustomers";
import { InstallmentCustomer } from "../types/sales";
import { Toaster } from "sonner";
import { SearchBar } from "./components/SearchBar";
import { StatsCards } from "./components/StatsCards";
import { CustomerTable } from "./components/CustomerTable";
import { CustomerDetailsModal } from "./components/CustomerDetailsModal";

export default function InstallmentCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<InstallmentCustomer | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { customers, loading, error, refetch } = useFetchInstallmentCustomers();

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.car_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.brand.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleViewDetails = (customer: InstallmentCustomer) => {
    setSelectedCustomer(customer);
    setIsViewModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading installment customers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold">Error</h3>
          <p className="text-red-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">
              Installment Customers
            </h1>
            <p className="text-purple-100 mt-2">
              Manage and track customers with installment plans
            </p>
          </div>

          <div className="p-6">
            {/* Search Bar */}
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            {/* Stats Cards */}
            <StatsCards customers={customers} />

            {/* Customers Table */}
            <CustomerTable
              customers={filteredCustomers}
              onViewDetails={handleViewDetails}
            />
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      <CustomerDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        customer={selectedCustomer}
      />
    </div>
  );
}
