import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FullCourseName } from "../lib/courses";
import { debounce } from "@/lib/debounce";
//@ts-ignore
import commandScore from "command-score";

import { GraduationCap, Search } from "lucide-react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

type Course = {
  course_code: string;
  course_name: string;
};

type ScoreItem = {
  course: Course;
  score: number;
};

type SearchItemProps = {
  courseCode: string;
  courseName: string;
  onSelect: (value: string) => void;
};

type SearchbarProps = {
  onSelect?: (value: string) => void;
};

function SearchItem({ courseCode, courseName, onSelect }: SearchItemProps) {
  return (
    <CommandItem value={courseCode} onSelect={onSelect}>
      <GraduationCap className="mr-1.5 min-w-4 min-h-4 w-fit flex-shrink-0" />
      <h4 className="overflow-hidden whitespace-nowrap overflow-ellipsis">
        <span className="font-semibold text-xs md:text-sm pr-1">{courseCode}</span>
        <span className="text-muted-foreground text-xs md:text-sm">{courseName}</span>
      </h4>
    </CommandItem>
  );
}

export function Searchbar({ onSelect }: SearchbarProps) {
  const router = useRouter();

  const [results, setResults] = useState<Course[] | null>(null);

  const { data, isLoading, isError } = useQuery(["courseNames"], {
    queryFn: async () => {
      const response = await fetch("/api/courses");
      if (!response.ok) throw new Error("Courses were not found");
      return response.json() as Promise<Course[]>;
    },
    refetchOnWindowFocus: false,
  });

  const onSearchTermChange = debounce((searchTerm: string) => {
    if (searchTerm.length > 0) {
      const scoredData: ScoreItem[] = [];

      data?.forEach((course: Course) => {
        const score: number = commandScore(
          `${course.course_code?.trim().toLowerCase()} ${course.course_name?.trim().toLowerCase()}`,
          searchTerm?.trim().toLowerCase(),
        );
        if (score > 0) {
          scoredData.push({ score, course });
        }
      });

      setResults(scoredData.sort((a, b) => b.score - a.score).map((item) => item.course));
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
      <CommandInput placeholder="Search for a Course..." onValueChange={onSearchTermChange} />
      <CommandList inputMode="search">
        {!isLoading && !isError && results != null && results?.length > 0 && (
          <CommandGroup heading="Courses">
            {results?.slice(0, 7)?.map((item, id) => (
              <SearchItem
                key={id}
                courseCode={item.course_code}
                courseName={item.course_name}
                onSelect={(value) => {
                  onCourseSelect(value);
                  if (onSelect) onSelect(value);
                }}
              />
            ))}
          </CommandGroup>
        )}
        {results != null && <CommandEmpty>No results found.</CommandEmpty>}
      </CommandList>
    </Command>
  );
}

export function SearchbarDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="flex justify-between gap-[0.4rem] sm:w-72 md:w-80 mr-2 px-3"
        role="search"
      >
        <div className="flex items-center gap-2 text-ellipsis">
          <Search className="h-4 w-4 shrink-0 opacity-50" />
        </div>
        <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Searchbar onSelect={() => setOpen(false)} />
      </CommandDialog>
    </>
  );
}

export default Searchbar;
