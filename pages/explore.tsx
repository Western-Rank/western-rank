import NavbarHeader from "@/components/NavbarHeader";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { SortKey, SortOrder, encodeCourseCode } from "@/lib/courses";
import { cn, roundToNearest } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ColumnDef, Header } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Compass, Star } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
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
    <div className="flex gap-0.5 items-center">
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
    queryKey: ["explore-courses", sortKey, sortOrder],
    queryFn: async ({ pageParam = 0 }) => {
      const searchParams = new URLSearchParams({
        cursor: pageParam,
        sortkey: sortKey,
        sortorder: sortOrder,
      });

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
  });

  const columns: ColumnDef<ExploreCourseRow>[] = [
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
          setSortOrder={setSortOrder}
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
          setSortOrder={setSortOrder}
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
          setSortOrder={setSortOrder}
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
          setSortOrder={setSortOrder}
          header={header}
          columnTitle="Attendance"
        />
      ),
    },
  ];

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
          subHeading={`See all ${coursesData?.pages[0]._count ?? ""} Western University Courses`}
          Icon={Compass}
          searchBar
          sticky
        />
        <div className="flex flex-col md:flex-row gap-2 light text-primary bg-background py-4 px-2 md:px-8 lg:px-15 xl:px-40 flex-grow">
          <div className="flex flex-col h-[58vh] items-center">
            <DataTable
              columns={columns}
              data={coursesData?.pages?.flatMap((page) => page?.courses) ?? []}
            />
            <div className="flex justify-between w-full py-2">
              <Button onClick={() => fetchPreviousPage()}>Previous</Button>
              <Button onClick={() => fetchNextPage()}>Next</Button>
            </div>
          </div>
          <Separator orientation="vertical" className="w-[1px] h-200" />
          <form></form>
        </div>
      </div>
    </>
  );
};

export default ExplorePage;
