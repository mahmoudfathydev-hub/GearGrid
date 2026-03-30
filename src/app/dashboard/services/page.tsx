"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  selectServices,
  selectServicesLoading,
  selectServicesError,
  selectServicesForm,
  selectEditingId,
  fetchServices,
  createService,
  updateService,
  deleteService,
  setEditingId,
  resetForm,
  setName,
  setIcon,
  setDesc,
} from "@/store/services/servicesSelectors";
import { Service } from "@/store/services/types";
import {
  ServicesTable,
  ServiceForm,
  LoadingSkeleton,
  ErrorMessage,
} from "./components";

export default function ServicesPage() {
  const dispatch = useAppDispatch();
  const services = useAppSelector(selectServices);
  const loading = useAppSelector(selectServicesLoading);
  const error = useAppSelector(selectServicesError);
  const formData = useAppSelector(selectServicesForm);
  const editingId = useAppSelector(selectEditingId);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleSubmit = () => {
    if (editingId) {
      dispatch(updateService({ id: editingId, data: formData }));
    } else {
      dispatch(createService(formData));
    }
  };

  const handleEdit = (service: Service) => {
    dispatch(setEditingId(service.id));
    dispatch(setName(service.name));
    dispatch(setIcon(service.icon));
    dispatch(setDesc(service.desc));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      dispatch(deleteService(id));
    }
  };

  const handleCancel = () => {
    dispatch(resetForm());
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Services Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your service offerings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ServiceForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
              isEditing={!!editingId}
            />
          </div>

          <div className="lg:col-span-2">
            {loading && <LoadingSkeleton />}

            {error && <ErrorMessage message={error} />}

            {!loading && !error && (
              <ServicesTable
                services={services}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
