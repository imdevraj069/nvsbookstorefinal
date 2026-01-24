"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function TagInput({ 
  value = [], 
  onChange, 
  label = "Tags",
  placeholder = "Enter tags and press Enter or click Add",
  disabled = false 
}) {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {/* Tag Display */}
      <div className="flex flex-wrap gap-2 p-3 min-h-10 rounded-md border border-input bg-background">
        {value.length === 0 && (
          <span className="text-sm text-muted-foreground">No tags added</span>
        )}
        {value.map((tag, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              disabled={disabled}
              className="hover:text-white/80 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Tag Input */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleAddTag}
          disabled={disabled || !inputValue.trim()}
          variant="outline"
          className="whitespace-nowrap"
        >
          Add Tag
        </Button>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-muted-foreground">
        Tip: Separate tags with Enter, comma, or click "Add Tag". 
        Tags help users find this content when searching.
      </p>
    </div>
  );
}
