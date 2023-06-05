import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FullCourseName } from "../lib/courses";
import { debounce } from "@/lib/debounce";
//@ts-ignore
import commandScore from "command-score";

import { GraduationCap } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";

type SearchItemProps = {
  courseName: string;
  onSelect: (value: string) => void;
};

function SearchItem({ courseName, onSelect }: SearchItemProps) {
  return (
    <CommandItem value={courseName} onSelect={onSelect}>
      <GraduationCap className="mr-2 h-4 w-4" />
      <span>{courseName}</span>
    </CommandItem>
  );
}

type ScoreItem = {
  score: number;
  courseName: string;
};

export function Searchbar() {
  const router = useRouter();

  const [results, setResults] = useState<string[] | null>(null);

  const { data, isLoading, isError } = useQuery(["courseNames"], {
    queryFn: async () => {
      const response = await fetch("/api/courses?format=names");
      if (!response.ok) throw new Error("Courses were not found");
      return response.json() as Promise<FullCourseName[]>;
    },
    refetchOnWindowFocus: false,
  });

  const onSearchTermChange = debounce((searchTerm: string) => {
    if (searchTerm.length > 0) {
      const scoredData: ScoreItem[] = [];

      data?.forEach((courseName: string) => {
        const score: number = commandScore(
          courseName?.trim().toLowerCase(),
          searchTerm?.trim().toLowerCase(),
        );
        if (score > 0) {
          scoredData.push({ score: score, courseName: courseName });
        }
      });

      setResults(scoredData.sort((a, b) => b.score - a.score).map((item) => item.courseName));
    } else {
      setResults(null);
    }
  }, 75);

  const onCourseSelect = (value: string) => {
    // e.g. CALC 1000: Calculus I -> CALC%201000
    const courseCodeURI = encodeURIComponent(value.toUpperCase().split(":")[0]);

    router.push(`/course/${courseCodeURI}`);
  };

  return (
    <Command shouldFilter={false} className="border">
      <CommandInput
        placeholder="Search for a Western University Course..."
        onValueChange={onSearchTermChange}
      />
      <CommandList inputMode="search">
        {!isLoading && !isError && results != null && results?.length > 0 && (
          <CommandGroup heading="Courses">
            {results?.slice(0, 7)?.map((item, id) => (
              <SearchItem key={id} courseName={item} onSelect={onCourseSelect} />
            ))}
          </CommandGroup>
        )}
        {results != null && <CommandEmpty>No results found.</CommandEmpty>}
      </CommandList>
    </Command>
  );
}

export default Searchbar;
