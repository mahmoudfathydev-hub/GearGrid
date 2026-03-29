'use client'

import { FieldErrors } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { ImageUpload } from '../ImageUpload'
import { CarFormData } from '../../validation/carSchema'

interface CarImagesUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  errors: FieldErrors<CarFormData>
  disabled?: boolean
}

export function CarImagesUpload({
  value,
  onChange,
  errors,
  disabled = false
}: CarImagesUploadProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Images</h2>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Car Images</Label>
        <ImageUpload
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        {errors.image_urls && (
          <p className="text-sm text-red-500">{errors.image_urls.message}</p>
        )}
      </div>
    </div>
  )
}
