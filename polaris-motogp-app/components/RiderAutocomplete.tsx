"use client";

import { useState, useRef, useEffect } from 'react';
import { MOTOGP_RIDERS } from '@/lib/firestore';

interface RiderAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  maxSelections?: number;
}

export default function RiderAutocomplete({
  value,
  onChange,
  placeholder = "Enter rider name...",
  disabled = false,
  multiple = false,
  maxSelections = 1,
}: RiderAutocompleteProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredRiders, setFilteredRiders] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.trim().length > 0) {
      const filtered = MOTOGP_RIDERS.filter(rider =>
        rider.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredRiders(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectRider = (rider: string) => {
    if (multiple) {
      const currentSelections = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
      
      if (currentSelections.length < maxSelections) {
        const newValue = currentSelections.length > 0 
          ? `${value}, ${rider}`
          : rider;
        onChange(newValue);
      }
    } else {
      onChange(rider);
    }
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    if (value.trim().length > 0) {
      const filtered = MOTOGP_RIDERS.filter(rider =>
        rider.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRiders(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredRiders(MOTOGP_RIDERS);
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
        autoComplete="off"
      />
      
      {showSuggestions && filteredRiders.length > 0 && !disabled && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-surface-container-high border border-outline-variant/30 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredRiders.map((rider, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectRider(rider)}
              className="w-full text-left px-4 py-2 hover:bg-primary/10 text-on-surface font-mono text-sm transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {rider}
            </button>
          ))}
        </div>
      )}
      
      {multiple && (
        <div className="mt-1 text-[10px] text-on-surface-variant font-mono">
          {value.split(',').filter(s => s.trim().length > 0).length} / {maxSelections} selected
        </div>
      )}
    </div>
  );
}
