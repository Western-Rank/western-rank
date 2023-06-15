import { debounce } from "@/lib/debounce";
import { useRouter } from "next/router";
//@ts-ignore
import commandScore from "command-score";

import { GraduationCap, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
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

export type CourseSearchItem = {
  course_code: string;
  course_name: string;
};

type ScoreItem = {
  course: CourseSearchItem;
  score: number;
};

type SearchItemProps = {
  courseCode: string;
  courseName: string;
  onSelect: (value: string) => void;
};

type SearchbarProps = {
  courses: CourseSearchItem[];
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

export function Searchbar({ courses, onSelect }: SearchbarProps) {
  const router = useRouter();

  const [results, setResults] = useState<CourseSearchItem[] | null>(null);

  const onSearchTermChange = debounce((searchTerm: string) => {
    if (searchTerm.length > 0) {
      const scoredData: ScoreItem[] = [];

      courses.forEach((course: CourseSearchItem) => {
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
    <Command shouldFilter={false} className="border light relative">
      <CommandInput placeholder="Search for a Course..." onValueChange={onSearchTermChange} />
      <CommandList inputMode="search">
        {results != null && results?.length > 0 && (
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

export function SearchbarDialog({ courses, onSelect }: SearchbarProps) {
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
        variant="secondary"
        size="sm"
        className="light bg-secondary hover:bg-background flex justify-between gap-[0.4rem] sm:w-72 md:w-80 mr-2 px-3"
        role="search"
      >
        <div className="flex items-center gap-2 text-ellipsis">
          <Search className="light text-primary h-4 w-4 shrink-0 opacity-90 text-purple-900" />
        </div>
        <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Searchbar courses={courses} onSelect={() => setOpen(false)} />
      </CommandDialog>
    </>
  );
}

export default Searchbar;
