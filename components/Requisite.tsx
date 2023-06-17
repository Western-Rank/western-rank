import { encodeCourseCode } from "@/lib/courses";
import { requisiteTypes } from "@/lib/reviews";
import Link from "next/link";
import { Button } from "./ui/button";

export type RequisiteTextItem = {
  text: string;
  isLink: boolean;
};

type RequisiteProps = {
  type: (typeof requisiteTypes)[number];
  requisiteText: RequisiteTextItem[];
};

const Requisite = ({ type, requisiteText }: RequisiteProps) => {
  return (
    <div>
      <h5 className="text-lg font-semibold">{type}</h5>
      <p className="whitespace-pre-wrap">
        {requisiteText.map((item, index) => {
          if (item.isLink) {
            const course_code = item?.text;
            return (
              <Button key={index} variant="link" className="p-0 h-3 pr-1 text-blue-500" asChild>
                <Link href={`/course/${encodeCourseCode(course_code)}`}>{item.text}</Link>
              </Button>
            );
          } else {
            return <span key={index}>{item.text + " "}</span>;
          }
        })}
      </p>
    </div>
  );
};

export default Requisite;
