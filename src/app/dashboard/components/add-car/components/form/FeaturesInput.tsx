'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Plus, X } from 'lucide-react'

interface FeaturesInputProps {
  value: string[]
  onChange: (features: string[]) => void
  disabled?: boolean
  error?: string
}

export function FeaturesInput({ value, onChange, disabled = false, error }: FeaturesInputProps) {
  const [currentFeature, setCurrentFeature] = useState('')

  const addFeature = () => {
    const trimmed = currentFeature.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
      setCurrentFeature('')
    }
  }

  const removeFeature = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addFeature()
    }
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Features & Amenities</Label>
      
      <div className="flex gap-2">
        <Input
          value={currentFeature}
          onChange={(e) => setCurrentFeature(e.target.value)}
          placeholder="Enter a feature (e.g., Leather seats)"
          className="text-base"
          disabled={disabled}
          onKeyPress={handleKeyPress}
        />
        <Button
          type="button"
          onClick={addFeature}
          disabled={!currentFeature.trim() || value.includes(currentFeature.trim()) || disabled}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      {value.length > 0 && (
        <Card className="p-4">
          <div className="space-y-2">
            {value.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
              >
                <span className="text-base">{feature}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeFeature(index)}
                  disabled={disabled}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
