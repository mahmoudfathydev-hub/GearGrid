"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { FormInput } from "./FormInput";
import { TransmissionSelector } from "./TransmissionSelector";
import { DatePickerField } from "./DatePickerField";
import { SubmitButton } from "./SubmitButton";
import {
  selectBookingForm,
  selectBookingLoading,
  setName,
  setNumber,
  setTransmission,
  setDate,
  submitTestDriveBooking,
} from "@/store/bookTestDrive/bookTestDriveSelectors";
import { BookTestDriveFormData } from "@/store/bookTestDrive/types";

export const BookTestDriveForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectBookingForm) as BookTestDriveFormData;
  const loading = useAppSelector(selectBookingLoading);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(submitTestDriveBooking(formData));
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.number.trim() !== "" &&
      formData.transmissions.trim() !== "" &&
      formData.date.trim() !== "" &&
      /^\d+$/.test(formData.number)
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        label="Full Name"
        value={formData.name}
        onChange={(value: string) => dispatch(setName(value))}
        placeholder="Enter your full name"
        type="text"
        required
      />

      <FormInput
        label="Phone Number"
        value={formData.number}
        onChange={(value: string) => dispatch(setNumber(value))}
        placeholder="Enter your phone number"
        type="tel"
        required
      />

      <TransmissionSelector
        value={formData.transmissions}
        onChange={(value: string) => dispatch(setTransmission(value))}
      />

      <DatePickerField
        value={formData.date}
        onChange={(value: string) => dispatch(setDate(value))}
      />

      <SubmitButton
        loading={loading}
        disabled={!isFormValid() || loading}
        text="Book Test Drive"
      />
    </form>
  );
};
