import NavbarHeader from "@/components/NavbarHeader";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { BreadthCategories, SortKey, SortOrder, encodeCourseCode } from "@/lib/courses";
import { cn, roundToNearest } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ColumnDef, Header } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Compass, Star } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { type GetCoursesResponse } from "./api/courses";

type ExploreCourseRow = {
  coursecode: string;
  ratings: number;
  liked: string;
  difficulty: string;
  useful: string;
  attendance: string;
};

type CourseHeaderProps = {
  header: Header<ExploreCourseRow, unknown>;
  columnTitle: string;
  sortKey: SortKey;
  setSortKey: (key: SortKey) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
};

const topCoursesColours = [
  "text-purple-800 hover:text-purple-800 decoration-purple-800",
  "text-purple-600 hover:text-purple-600 decoration-purple-600",
  "text-purple-400 hover:text-purple-400 decoration-purple-400",
];

const CourseHeader = ({
  header,
  columnTitle,
  sortKey,
  sortOrder,
  setSortKey,
  setSortOrder,
}: CourseHeaderProps) => {
  return (
    <div className="flex gap-0.5 items-center w-full whitespace-nowrap">
      <Toggle
        onPressedChange={(pressed) => {
          if (sortKey !== header.id) {
            setSortKey(header.id as SortKey);
            setSortOrder("desc");
          } else {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
          }
        }}
        pressed={sortKey === header.id}
        size="sm"
        className="p-2 h-6 "
      >
        <span>{columnTitle}</span>
        {sortKey === header.id && sortOrder === "desc" && <ChevronDown width={16} />}
        {sortKey === header.id && sortOrder === "asc" && <ChevronUp width={16} />}
      </Toggle>
    </div>
  );
};

function courseRowData(course: GetCoursesResponse["courses"][0]): ExploreCourseRow {
  return {
    coursecode: course.course_code,
    ratings: course._count?.review_id ?? 0,
    liked: roundToNearest(course._count?.liked ?? 0, 0) + "%",
    difficulty: `${roundToNearest((course._avg?.difficulty ?? 0) / 2, 1)}/5`,
    useful: `${roundToNearest((course._avg?.useful ?? 0) / 2, 1)}/5`,
    attendance: roundToNearest(course._avg?.attendance ?? 0, 0) + "%",
  };
}

const ExplorePage = () => {
  const [sortKey, setSortKey] = useState<SortKey>("liked");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [minRatings, setMinRatings] = useState(0);
  const [hasPreReqs, setHasPreReqs] = useState<boolean | undefined>(true);
  const [breadth, setBreadth] = useState<(BreadthCategories[number] | "")[]>(["A", "B", "C"]);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const {
    data: coursesData,
    error,
    fetchPreviousPage,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: ["explore-courses", sortKey, sortOrder, minRatings, hasPreReqs, breadth],
    queryFn: async ({ pageParam = 0 }) => {
      const searchParams = new URLSearchParams({
        cursor: pageParam,
        sortkey: sortKey,
        sortorder: sortOrder,
        minratings: minRatings.toString(),
        breadth: breadth.join(""),
      });

      if (hasPreReqs) {
        searchParams.append("hasprereqs", hasPreReqs.toString());
      }

      const response = await fetch(`/api/courses?${searchParams.toString()}`);
      if (!response.ok) throw new Error("Courses were not found");
      const coursesData: GetCoursesResponse = await response.json();
      const courses = coursesData.courses.map((course) => courseRowData(course));
      return {
        ...coursesData,
        courses,
      };
    },
    getNextPageParam: (nextpage) => nextpage?.next_cursor,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const columns: ColumnDef<ExploreCourseRow>[] = useMemo(
    () => [
      {
        accessorKey: "coursecode",
        header: ({ header }) => (
          <CourseHeader
            sortKey={sortKey}
            setSortKey={setSortKey}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            header={header}
            columnTitle="Course Code"
          />
        ),
        cell: ({ cell, row }) => (
          <div className="flex gap-1 items-center justify-start">
            <Button
              variant="link"
              className={cn("text-blue-500 m-0 h-1.5 py-0 px-0", topCoursesColours[row.index])}
              asChild
            >
              <Link
                className="whitespace-nowrap space-x-1"
                href={`/course/${encodeCourseCode(cell.renderValue<string>())}`}
              >
                {(row.index === 0 || row.index === 1 || row.index === 2) && <Star width={16} />}
                <span>{cell.renderValue<string>()}</span>
              </Link>
            </Button>
          </div>
        ),
      },
      {
        accessorKey: "ratings",
        header: ({ header }) => (
          <CourseHeader
            sortKey={sortKey}
            setSortKey={setSortKey}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            header={header}
            columnTitle="Ratings"
          />
        ),
      },
      {
        accessorKey: "liked",
        header: ({ header }) => (
          <CourseHeader
            sortKey={sortKey}
            setSortKey={setSortKey}
            sortOrder={sortOrder}
            setSortOrder={(order) => {
              setSortOrder(order);
              setMinRatings(1);
            }}
            header={header}
            columnTitle="Liked"
          />
        ),
      },
      {
        accessorKey: "difficulty",
        header: ({ header }) => (
          <CourseHeader
            sortKey={sortKey}
            setSortKey={setSortKey}
            sortOrder={sortOrder}
            setSortOrder={(order) => {
              setSortOrder(order);
              setMinRatings(1);
            }}
            header={header}
            columnTitle="Difficulty"
          />
        ),
      },
      {
        accessorKey: "useful",
        header: ({ header }) => (
          <CourseHeader
            sortKey={sortKey}
            setSortKey={setSortKey}
            sortOrder={sortOrder}
            setSortOrder={(order) => {
              setSortOrder(order);
              setMinRatings(1);
            }}
            header={header}
            columnTitle="Useful"
          />
        ),
      },
      {
        accessorKey: "attendance",
        header: ({ header }) => (
          <CourseHeader
            sortKey={sortKey}
            setSortKey={setSortKey}
            sortOrder={sortOrder}
            setSortOrder={(order) => {
              setSortOrder(order);
              setMinRatings(1);
            }}
            header={header}
            columnTitle="Attendance"
          />
        ),
      },
    ],
    [sortKey, sortOrder],
  );

  //we must flatten the array of arrays from the useInfiniteQuery hook
  const flatCoursesData = useMemo(
    () => coursesData?.pages?.flatMap((page) => page.courses) ?? [],
    [coursesData],
  );

  const totalDBRowCount = coursesData?.pages[0]._count ?? 0;
  const totalFetched = flatCoursesData.length;

  const fetchMoreOnBottomReached = useCallback(
    async (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
        if (
          scrollHeight - scrollTop - clientHeight < 100 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          console.log("fetching next page");
          const nextPage = await fetchNextPage();
          console.log(nextPage);
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
  );

  return (
    <>
      <Head>
        <title>Explore Courses | Western Rank</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <NavbarHeader
          heading="Explore Courses"
          subHeading={`See all Western University Courses`}
          Icon={Compass}
          searchBar
          sticky
        />
        <div className="flex flex-col-reverse md:flex-row gap-4 light text-primary bg-background py-4 px-2 md:px-8 lg:px-15 xl:px-40 flex-grow">
          <div className="h-[64vh] md:items-center justify-between">
            <DataTable
              columns={columns}
              data={flatCoursesData ?? []}
              onBottomReached={fetchMoreOnBottomReached}
            />
          </div>
          <Separator orientation="vertical" className="w-[1px] h-200" />
          <div className="flex flex-col w-full px-2 gap-6">
            <div>
              <h3 className="text-xl font-extrabold">Apply filters</h3>
              <h4 className="text-md text-muted-foreground">
                to find the courses you&apos;re looking for.
              </h4>
            </div>
            <div className="space-y-4">
              <Label className="font-bold text-md text-muted-foreground">
                Minimum Number of Ratings
              </Label>
              <Slider
                min={0}
                max={26}
                step={1}
                value={[minRatings]}
                onValueChange={(value) => setMinRatings(value[0])}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={!hasPreReqs}
                onCheckedChange={(checked) => setHasPreReqs(!hasPreReqs)}
              />
              <Label className="font-bold text-md text-muted-foreground">No Prerequisites</Label>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-bold text-md text-muted-foreground">
                Breadth Requirements
              </Label>
              <div className="space-x-4">
                <Toggle
                  pressed={breadth[0] === "A"}
                  onPressedChange={(pressed) => {
                    if (breadth[0] === "A") {
                      setBreadth(["", ...breadth.slice(1)]);
                    } else {
                      setBreadth(["A", ...breadth.slice(1)]);
                    }
                  }}
                  className="px-6 text-md"
                >
                  A
                </Toggle>
                <Toggle
                  pressed={breadth[1] === "B"}
                  onPressedChange={(pressed) => {
                    if (breadth[1] === "B") {
                      setBreadth([breadth[0], "", breadth[2]]);
                    } else {
                      setBreadth([breadth[0], "B", breadth[2]]);
                    }
                  }}
                  className="px-6 text-md"
                >
                  B
                </Toggle>
                <Toggle
                  pressed={breadth[2] === "C"}
                  onPressedChange={() => {
                    if (breadth[2] === "C") {
                      setBreadth([...breadth.slice(0, 2), ""]);
                    } else {
                      breadth[2] = "C";
                      setBreadth([...breadth.slice(0, 2), "C"]);
                    }
                  }}
                  className="px-6 text-md"
                >
                  C
                </Toggle>
              </div>
            </div>
            {isSuccess && (
              <p className="text-purple-600">{coursesData?.pages[0]._count ?? ""} course results</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExplorePage;
