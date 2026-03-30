"use client";

import React from "react";
import { Service } from "@/store/services/types";
import { Edit, Trash2 } from "lucide-react";

interface TableRowProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: number) => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  service,
  onEdit,
  onDelete,
}) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
        {service.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <span className="text-lg mr-2">{service.icon}</span>
          <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {service.icon}
          </code>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="max-w-xs truncate" title={service.desc}>
          {service.desc}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onEdit(service)}
            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            title="Edit service"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(service.id)}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            title="Delete service"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
