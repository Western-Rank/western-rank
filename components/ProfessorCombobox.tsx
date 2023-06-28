"use client";

import { Check, ChevronsUpDown } from "lucide-react";
//@ts-ignore
import commandScore from "command-score";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { debounce } from "@/lib/debounce";
import { ProfessorItem, ProfessorResponse } from "@/lib/professors";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface ComboboxProps {
  value?: ProfessorItem;
  onChangeProfessor?: (professor: ProfessorItem) => void;
  placeholder: string;
  id?: string;
  required?: boolean;
}

const otherProfessor: ProfessorItem = {
  id: -1,
  name: "Other",
};

type ProfessorSearchItem = {
  professor: ProfessorItem;
  score: number;
};

export function ProfessorCombobox({
  value,
  onChangeProfessor,
  placeholder,
  id,
  required,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [currentProfessor, setCurrentProfessor] = useState<ProfessorItem>(value ?? otherProfessor);
  const [results, setResults] = useState<ProfessorItem[] | null>(null);

  const { data: professors, isSuccess } = useQuery({
    queryKey: ["professors"],
    queryFn: async () => {
      const response = await fetch("/api/professor?format=compact");
      if (!response.ok) throw new Error("Professors were not found");
      const professors: ProfessorResponse = await response.json();
      return professors;
    },
    refetchOnWindowFocus: false,
  });

  const onSearchTermChange = debounce((searchTerm: string) => {
    if (searchTerm.length > 0) {
      const scoredProfessors = professors
        ?.map((professor: ProfessorItem) => {
          const score: number = commandScore(
            professor.name?.trim().toLowerCase(),
            searchTerm?.trim().toLowerCase(),
          );
          return { score, professor: professor };
        })
        .filter((item) => item.score > 0)
        ?.sort((a, b) => b.score - a.score)
        .map((item) => item.professor);

      setResults(scoredProfessors ?? []);
    } else {
      setResults(null);
    }
  }, 75);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full md:max-w-[50%] justify-between"
        >
          {currentProfessor ? currentProfessor.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-full md:w-[400px] p-0 light overflow-y-scroll">
        <Command shouldFilter={false}>
          <CommandInput
            className=""
            placeholder="Search..."
            required={required}
            id={id}
            onValueChange={onSearchTermChange}
          />
          <CommandGroup inputMode="search" className="max-h-[200px]">
            {results != null &&
              results?.slice(0, 6)?.map((professor) => (
                <CommandItem
                  key={professor.id}
                  onSelect={(professorId) => {
                    const professor = results?.find((prof) => prof.id === parseInt(professorId));
                    if (currentProfessor && currentProfessor?.id !== professor?.id)
                      professor && setCurrentProfessor(professor);
                    else setCurrentProfessor(otherProfessor);
                    setOpen(false);
                    setResults(null);
                    if (onChangeProfessor) {
                      currentProfessor?.id === professor?.id
                        ? onChangeProfessor(otherProfessor)
                        : professor && onChangeProfessor(professor);
                    }
                  }}
                  value={professor.id.toString()}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentProfessor.id === professor.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {professor.name}
                </CommandItem>
              ))}
            {!!currentProfessor && currentProfessor.id > 0 && results === null && (
              <CommandItem
                key={currentProfessor.id}
                onSelect={() => {
                  setCurrentProfessor(otherProfessor);
                  if (onChangeProfessor) onChangeProfessor(otherProfessor);
                  setOpen(false);
                }}
              >
                <Check className="mr-2 h-4 w-4" />
                {currentProfessor.name}
              </CommandItem>
            )}
            {!isSuccess && results == null && (
              <CommandEmpty className="grid place-items-center">
                <div className="p-1 w-full space-y-1">
                  <Skeleton className="h-8 w-full rounded-lg" />
                  <Skeleton className="h-8 w-full rounded-lg" />
                </div>
              </CommandEmpty>
            )}
            {!isSuccess && results != null && <CommandEmpty>No results found.</CommandEmpty>}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
