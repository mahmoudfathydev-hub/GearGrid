"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  selectServicesForm,
  selectServicesLoading,
  setName,
  setIcon,
  setDesc,
} from "@/store/services/servicesSelectors";
import { FormInput } from "./FormInput";
import { IconInput } from "./IconInput";
import { DescriptionTextarea } from "./DescriptionTextarea";
import { SubmitButton } from "./SubmitButton";
import { FormLayout } from "./FormLayout";

interface ServiceFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  loading: boolean;
  isEditing: boolean;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  onSubmit,
  onCancel,
  loading,
  isEditing,
}) => {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectServicesForm);
  const formLoading = useAppSelector(selectServicesLoading);

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.icon.trim() !== "" &&
      formData.desc.trim() !== ""
    );
  };

  return (
    <FormLayout title={isEditing ? "Edit Service" : "Create Service"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-6"
      >
        <FormInput
          label="Service Name"
          value={formData.name}
          onChange={(value: string) => dispatch(setName(value))}
          placeholder="Enter service name"
          required
        />

        <IconInput
          label="Icon"
          value={formData.icon}
          onChange={(value: string) => dispatch(setIcon(value))}
          placeholder="Enter icon name or class"
          required
        />

        <DescriptionTextarea
          label="Description"
          value={formData.desc}
          onChange={(value: string) => dispatch(setDesc(value))}
          placeholder="Enter service description"
          required
        />

        <div className="flex gap-3 pt-4">
          <SubmitButton
            loading={formLoading}
            disabled={!isFormValid() || formLoading}
            text={isEditing ? "Update Service" : "Create Service"}
          />

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </FormLayout>
  );
};
