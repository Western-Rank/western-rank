"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ComboboxProps {
  options: {
    value: string;
    label: string;
  }[];
  value?: string;
  onChangeValue?: (value: string) => void;
  placeholder: string;
  id?: string;
  required?: boolean;
}

export function Combobox({
  options,
  value,
  onChangeValue,
  placeholder,
  id,
  required,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [currentValue, setCurrentValue] = React.useState(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full md:w-[300px] justify-between"
        >
          {currentValue ? currentValue : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full md:w-[300px] max-h-64 overflow-scroll p-0 light">
        <Command>
          <CommandInput placeholder="Search..." required={required} id={id} />
          <CommandEmpty>Nothing found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={(value) => {
                  setCurrentValue(currentValue === value ? "" : value);
                  setOpen(false);
                  if (onChangeValue) {
                    currentValue !== value ? onChangeValue(value) : "";
                    currentValue === value ? onChangeValue("") : "";
                  }
                }}
                value={option.value}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    currentValue === option.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
