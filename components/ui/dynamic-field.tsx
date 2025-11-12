"use client";

import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Input } from './input';

interface FieldOption {
  value: string;
  label: string;
}

interface BaseField {
  key: string;
  label: string;
  required?: boolean;
  placeholder?: string;
}

interface TextField extends BaseField {
  type: 'text' | 'email' | 'tel' | 'url';
}

interface TextareaField extends BaseField {
  type: 'textarea';
  rows?: number;
}

interface SelectField extends BaseField {
  type: 'select';
  options: FieldOption[];
}

interface DateField extends BaseField {
  type: 'date';
  minDate?: string;
  maxDate?: string;
}

interface NumberField extends BaseField {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
}

interface CheckboxField extends BaseField {
  type: 'checkbox';
  description?: string;
}

interface RadioField extends BaseField {
  type: 'radio';
  options: FieldOption[];
}

export type DynamicFieldConfig = 
  | TextField 
  | TextareaField 
  | SelectField 
  | DateField 
  | NumberField 
  | CheckboxField 
  | RadioField;

interface DynamicFieldProps {
  field: DynamicFieldConfig;
  value: any;
  onChange: (key: string, value: any) => void;
  className?: string;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({ 
  field, 
  value, 
  onChange, 
  className 
}) => {
  const baseInputClasses = "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
  
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            className={baseInputClasses}
            value={value || ''}
            onChange={(e) => onChange(field.key, e.target.value)}
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            rows={field.rows || 3}
            className={cn(baseInputClasses, "resize-y")}
            value={value || ''}
            onChange={(e) => onChange(field.key, e.target.value)}
          />
        );

      case 'select':
        return (
          <div className="relative">
            <select
              className={cn(baseInputClasses, "appearance-none pr-10 cursor-pointer")}
              value={value || ''}
              onChange={(e) => onChange(field.key, e.target.value)}
            >
              <option value="">
                {field.placeholder || `Sélectionner ${field.label.toLowerCase()}`}
              </option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        );

      case 'date':
        return (
          <div className="relative">
            <Input
              type="date"
              className={cn(baseInputClasses, "pr-10")}
              value={value || ''}
              min={field.minDate}
              max={field.maxDate}
              onChange={(e) => onChange(field.key, e.target.value)}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            className={baseInputClasses}
            value={value || ''}
            min={field.min}
            max={field.max}
            step={field.step}
            onChange={(e) => onChange(field.key, e.target.value)}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id={`field-${field.key}`}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              checked={value || false}
              onChange={(e) => onChange(field.key, e.target.checked)}
            />
            <div className="flex-1">
              <label 
                htmlFor={`field-${field.key}`} 
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.description && (
                <p className="text-xs text-gray-500 mt-1">{field.description}</p>
              )}
            </div>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options.map((option) => (
              <div key={option.value} className="flex items-center gap-3">
                <input
                  type="radio"
                  id={`field-${field.key}-${option.value}`}
                  name={field.key}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                  checked={value === option.value}
                  onChange={() => onChange(field.key, option.value)}
                />
                <label 
                  htmlFor={`field-${field.key}-${option.value}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <Input
            type="text"
            placeholder={field.placeholder}
            className={baseInputClasses}
            value={value || ''}
            onChange={(e) => onChange(field.key, e.target.value)}
          />
        );
    }
  };

  // For checkbox, we handle the label differently
  if (field.type === 'checkbox') {
    return (
      <div className={className}>
        {renderField()}
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
    </div>
  );
};