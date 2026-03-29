"use client";

import { useState } from "react";
import { UseFormSetValue, Controller, Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Check, X } from "lucide-react";

interface DropdownWithCreateOptionProps {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onAddNew: (newValue: string) => Promise<void>;
  disabled?: boolean;
  error?: string;
}

export function DropdownWithCreateOption({
  label,
  placeholder,
  options,
  value,
  onChange,
  onAddNew,
  disabled = false,
  error,
}: DropdownWithCreateOptionProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleAddNew = async () => {
    if (newValue.trim() && !options.includes(newValue.trim())) {
      setIsSaving(true);
      try {
        await onAddNew(newValue.trim());
        onChange(newValue.trim());
        setNewValue("");
        setIsAddingNew(false);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancelNew = () => {
    setNewValue("");
    setIsAddingNew(false);
  };

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === "__add_new__") {
      setIsAddingNew(true);
    } else {
      onChange(selectedValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </Label>

      {!isAddingNew ? (
        <Select
          value={value || ""}
          onValueChange={handleSelectChange}
          disabled={disabled}
        >
          <SelectTrigger className="h-12 text-lg px-4 rounded-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="mt-14">
            {options.map((option) => (
              <SelectItem
                key={option}
                value={option}
                className="text-base py-3"
              >
                {option}
              </SelectItem>
            ))}
            <SelectItem
              value="__add_new__"
              className="text-blue-600 font-medium text-base py-3"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add new...
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <div className="flex gap-2">
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={`Enter new ${label.toLowerCase()}`}
            className="h-12 text-lg px-4 rounded-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={disabled}
            autoFocus
          />
          <Button
            type="button"
            size="sm"
            onClick={handleAddNew}
            disabled={!newValue.trim() || disabled || isSaving}
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Check className="w-4 h-4" />
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancelNew}
            disabled={disabled || isSaving}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {error && <p className="text-base text-red-500 font-medium">{error}</p>}
    </div>
  );
}
