import NavbarHeader from "@/components/NavbarHeader";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import Spinner from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import { BreadthCategories, SortKey, SortOrder, encodeCourseCode } from "@/lib/courses";
import { cn, roundToNearest } from "@/lib/utils";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Header } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Compass, Star } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import { type GetCoursesResponse } from "./api/courses";

type ExploreCourseRow = {
  rank: number;
  coursecode: string;
  ratings: number;
  liked: string;
  difficulty: string;
  useful: string;
  attendance: string;
};

const topCoursesColours = [
  "text-purple-800 hover:text-purple-800 decoration-purple-800",
  "text-purple-600 hover:text-purple-600 decoration-purple-600",
  "text-purple-400 hover:text-purple-400 decoration-purple-400",
];

type CourseHeaderProps = {
  header: Header<ExploreCourseRow, unknown>;
  columnTitle: string;
  sortKey: SortKey;
  setSortKey: (key: SortKey) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
};

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
    rank: course.rank ?? "",
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
  const [noPreReqs, setNoPreReqs] = useState<boolean>(false);
  const [breadth, setBreadth] = useState<(BreadthCategories[number] | "")[]>(["A", "B", "C"]);
  const [category, setCategory] = useState("");

  const { data: categoriesOptions } = useQuery({
    queryKey: ["explore-categories"],
    queryFn: async () => {
      const response = await fetch("/api/courses/categories");
      if (!response.ok) throw new Error("Categories were not found");
      const categories: string[] = await response.json();

      const categoriesOptions = categories.map((category) => ({
        label: category,
        value: category,
      }));

      categoriesOptions.push({
        label: "All Subjects",
        value: "",
      });

      return categoriesOptions;
    },
  });

  const queryClient = useQueryClient();

  const {
    data: coursesData,
    fetchNextPage,
    isFetching,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: ["explore-courses", sortKey, sortOrder, minRatings, noPreReqs, breadth, category],
    queryFn: async ({ pageParam = 0 }) => {
      if (queryClient.isFetching(["explore-courses"]))
        queryClient.cancelQueries(["explore-courses"]);

      const searchParams = new URLSearchParams({
        cursor: pageParam,
        sortkey: sortKey,
        sortorder: sortOrder,
        minratings: minRatings.toString(),
        breadth: breadth.join(""),
        noprereqs: noPreReqs.toString(),
      });

      if (category) searchParams.set("cat", category.toUpperCase());

      const response = await fetch(`/api/courses?${searchParams.toString()}`);
      if (!response.ok) throw new Error("Courses were not found");
      const coursesData: GetCoursesResponse = await response.json();
      const courses = coursesData.courses.map((course) => courseRowData(course));
      return {
        ...coursesData,
        courses,
      };
    },
    getNextPageParam: (lastPage) => lastPage.next_cursor,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const columns: ColumnDef<ExploreCourseRow>[] = useMemo(
    () => [
      {
        accessorKey: "rank",
        header: ({ header }) => (
          <div className="flex gap-0.5 items-center w-full whitespace-nowrap opacity-75">Rank</div>
        ),
        cell: ({ cell, row }) => (
          <div className="flex gap-1 items-center justify-start">
            <Button
              variant="link"
              className={cn("text-zinc-300 m-0 h-1.5 py-0 px-0", topCoursesColours[row.index])}
              asChild
            >
              <span>{cell.renderValue<string>()}</span>
            </Button>
          </div>
        ),
      },
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
                {/* {(row.index === 0 || row.index === 1 || row.index === 2) && <Star width={16} />} */}
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
        />
        <div className="flex flex-col-reverse md:flex-row gap-4 light text-primary bg-background py-4 px-2 md:px-8 lg:px-15 xl:px-40 flex-grow">
          <div className="h-[64vh] md:items-center justify-between">
            <DataTable
              columns={columns}
              data={flatCoursesData ?? []}
              onLastRowReached={fetchNextPage}
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
            <div className="flex flex-col space-y-2">
              <Label className="font-bold text-md text-muted-foreground">Subjects</Label>
              <Combobox
                value={category}
                options={categoriesOptions?.sort((a, b) => (a.value > b.value ? 1 : -1)) ?? []}
                onChangeValue={(value) => setCategory(value)}
                placeholder="All Subjects"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={noPreReqs} onCheckedChange={() => setNoPreReqs(!noPreReqs)} />
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
            <div className="flex space-x-2 items-center">
              {isSuccess && (
                <p className="text-purple-600 py-2">
                  {coursesData?.pages[0]._count ?? ""} course results
                </p>
              )}
              {isFetching && <Spinner text="applying filters" className="scale-50" />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExplorePage;
