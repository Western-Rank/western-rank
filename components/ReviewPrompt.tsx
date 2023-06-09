import { Course, Course_Review, Term } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Close } from "@radix-ui/react-dialog";
import { Checkbox } from "@/components//ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

interface ReviewPromptProps {
  courseCode: Course["course_code"];
  hasReviewed?: boolean;
}

const reviewFormSchema = z.object({
  professor: z.string(),
  review: z.string().min(15).optional(),
  liked: z.boolean(),
  difficulty: z.array(z.number().min(0).max(5)),
  enthusiasm: z.array(z.number().min(0).max(5)),
  attendance: z.array(z.number().min(0).max(100)),
  anon: z.boolean(),
  date_taken: z.coerce.date({ coerce: true }),
  term_taken: z.nativeEnum(Term),
  date_created: z.coerce.date(),
  last_edited: z.coerce.date(),
});

/**
 * The component for submitting a review and its related information.
 */
const ReviewPrompt = ({ courseCode, hasReviewed }: ReviewPromptProps) => {
  const { data: auth } = useSession();

  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const reviewButtonText = !auth ? "Log in to Review" : hasReviewed ? "Edit your Review" : "Review";

  const reviewForm = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      professor: "",
      review: "",
      liked: true,
      difficulty: [2.5],
      enthusiasm: [2.5],
      attendance: [50],
      anon: false,
      date_taken: new Date(),
      term_taken: "Fall",
      date_created: new Date(),
      last_edited: new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof reviewFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    setOpen(false);
    // TODO: replace with React query mutation w post request
    setTimeout(() => {
      toast({
        title: `Your ${hasReviewed} ${courseCode} Review was submitted!`,
        description: "You can edit it at any time after signing in.",
      });
    }, 50);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!auth} onClick={() => setOpen(true)}>
          {reviewButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <Form {...reviewForm}>
          <form onSubmit={reviewForm.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                Review <span className="font-bold">{courseCode}</span>
              </DialogTitle>
              <DialogDescription>
                You&apos;re rating and an (optional) written review for the course. You can even
                edit the review later!
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={reviewForm.control}
              name="liked"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Liked</FormLabel>
                  <FormDescription>Overall, did you like the course?</FormDescription>

                  <FormControl>
                    <div className="flex gap-1">
                      <Toggle pressed={field.value} onPressedChange={field.onChange}>
                        <ThumbsUp />
                      </Toggle>
                      <Toggle
                        pressed={!field.value}
                        onPressedChange={(value) => field.onChange(!value)}
                      >
                        <ThumbsDown />
                      </Toggle>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div></div>
            <FormField
              control={reviewForm.control}
              name="professor"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Professor</FormLabel>
                  <FormDescription>
                    What&apos;s the name of the course instructor you had?
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Name" value={field.value} onChange={field.onChange} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={reviewForm.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <FormDescription>How difficult did you find the course (0-5)?</FormDescription>
                  <FormControl>
                    <Slider
                      min={0}
                      max={5}
                      step={0.5}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={reviewForm.control}
              name="enthusiasm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enthusiasm</FormLabel>
                  <FormDescription>
                    How excited were you about the course and the course content? (0-5)?
                  </FormDescription>
                  <FormControl>
                    <Slider
                      min={0}
                      max={5}
                      step={0.5}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={reviewForm.control}
              name="attendance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attendance</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={10}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    What percent of lectures did you attend/watch (0-100%)?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={reviewForm.control}
              name="anon"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <div className="flex gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-destructive border-destructive"
                      />
                    </FormControl>
                    <FormLabel>Remain Anonymous</FormLabel>
                  </div>
                  <FormDescription>
                    Would you like your review to remain anonymous (no uwo username)?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Submit Review</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewPrompt;
