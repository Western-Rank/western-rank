import { Course, Course_Review, Term as Terms } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

import { Checkbox } from "@/components//ui/checkbox";
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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import Spinner from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import useWarnIfUnsavedChanges from "@/hooks/useWarnIfUnsavedChanges";
import { Course_Review_Create } from "@/lib/reviews";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lock, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ProfessorCombobox } from "./ProfessorCombobox";

type ReviewPromptProps = {
  courseCode: Course["course_code"];
  review?: Course_Review;
  onSubmitReview?: () => void;
};

type ReviewPromptButtonProps = {
  edit?: boolean;
  auth?: boolean;
  onClick: () => void;
};

const optionalTextInput = (schema: z.ZodString) =>
  z.union([z.string(), z.undefined()]).refine((val) => !val || schema.safeParse(val).success);

const reviewFormSchema = z.object({
  professor_name: z
    .string({
      invalid_type_error: "Invalid Professor Name",
      required_error: "Professor is required",
    })
    .nonempty("Professor is required"),
  professor_id: z
    .number({ invalid_type_error: "Invalid Professor Id", required_error: "Professor is required" })
    .int(),
  review: optionalTextInput(z.string({ invalid_type_error: "Invalid Review" }).min(30).max(800)),
  liked: z.boolean({
    invalid_type_error: "Invalid Liked (True or False)",
    required_error: "Liked is required",
  }),
  difficulty: z.array(z.number().min(0).max(5), {
    invalid_type_error: "Invalid Difficulty",
    required_error: "Difficulty is required",
  }),
  useful: z.array(z.number().min(0).max(5), {
    invalid_type_error: "Invalid Useful",
    required_error: "Useful is required",
  }),
  attendance: z.array(z.number().min(0).max(100), {
    invalid_type_error: "Invalid Attendance",
    required_error: "Attendance is required",
  }),
  anon: z.boolean({
    invalid_type_error: "Invalid Anonymous",
    required_error: "Choose if you want the review to be anonymous or not",
  }),
  date_taken: z
    .number()
    .min(2010, "Years before 2010 are not valid")
    .max(new Date().getFullYear(), "Years in the future are invalid"),
  term_taken: z.nativeEnum(Terms, {
    invalid_type_error: "Only Fall, Winter, or Summer are valid terms",
  }),
});

const ReviewPromptButton = ({ edit, auth, onClick }: ReviewPromptButtonProps) => {
  if (!auth) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger className="cursor-not-allowed w-full md:w-fit">
            <Button disabled onClick={onClick} variant="gradient" className="w-full">
              Review
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Please login to review.</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (edit) {
    return (
      <TooltipProvider>
        <Button
          disabled={!auth}
          onClick={onClick}
          variant="ghost"
          className="text-purple-600 hover:bg-purple-100 sm:w-auto rounded-l-none"
        >
          Edit
        </Button>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Button onClick={onClick} variant="gradient" className="w-full md:w-fit">
        Review
      </Button>
    </TooltipProvider>
  );
};

/**
 * The component for submitting a review and its related information.
 */
const ReviewPrompt = ({ courseCode, onSubmitReview, review }: ReviewPromptProps) => {
  const { data: auth } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const edit = review !== undefined;

  const reviewButtonText = !auth?.user ? "Log in to Review" : "Review";

  const reviewForm = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      professor_name: "Other",
      professor_id: -1,
      review: edit && review?.review != null ? review?.review : undefined,
      liked: edit ? review.liked : true,
      difficulty: [edit ? review.difficulty / 2 : 2.5],
      useful: [edit ? review.useful / 2 : 2.5],
      attendance: [edit ? review.attendance : 50],
      anon: edit ? review.anon : false,
      date_taken: edit ? review.date_taken.getFullYear() : new Date().getFullYear(),
      term_taken: edit ? review.term_taken : "Fall",
    },
  });

  useEffect(() => {
    if (review) {
      reviewForm.reset({
        professor_name: review.professor_name ?? "Other",
        professor_id: review.professor_id ?? -1,
        review: review?.review != null ? review?.review : undefined,
        liked: review.liked,
        difficulty: [review.difficulty / 2],
        useful: [review.useful / 2],
        attendance: [review.attendance],
        anon: review.anon,
        date_taken: review.date_taken.getFullYear(),
        term_taken: review.term_taken,
      });
    } else {
      reviewForm.reset();
    }
  }, [reviewForm, review]);

  useWarnIfUnsavedChanges(
    reviewForm.formState.isDirty,
    () => confirm("Warning! You have unsubmitted changes."),
    (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Save your changes before exiting.";
    },
  );

  const createReviewMutationFn = useCallback(
    async (review: Course_Review_Create) => {
      const res = await fetch("/api/reviews", { method: "POST", body: JSON.stringify(review) });
      if (!res.ok) {
        throw new Error(`Error: Submitting your ${courseCode} review failed!`);
      }
      return res;
    },
    [courseCode],
  );

  const editReviewMutationFn = useCallback(
    async (new_review: Course_Review_Create) => {
      const res = await fetch(`/api/reviews/${review?.review_id}`, {
        method: "PUT",
        body: JSON.stringify(new_review),
      });
      if (!res.ok) {
        throw new Error(`Error: Submitting your edited ${courseCode} review failed!`);
      }
      return res;
    },
    [review?.review_id, courseCode],
  );

  const reviewMutation = useMutation({
    mutationFn: edit ? editReviewMutationFn : createReviewMutationFn,
    onSuccess() {
      toast({
        title: `Your ${edit ? "Edited" : ""} ${courseCode} Review was submitted!`,
        description: "You can edit it at any time after signing in.",
      });
      if (onSubmitReview) {
        onSubmitReview();
      }
      setOpen(false);
    },
    onError(err: Error) {
      toast({
        title: err.message,
        description: "Try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof reviewFormSchema>) {
    if (!auth || !auth.user?.email) {
      throw new Error("You are not authorized to review a course. Please sign in.");
    }

    const review = {
      course_code: courseCode,
      email: auth.user?.email,
      ...values,
      difficulty: values.difficulty[0] * 2,
      useful: values.useful[0] * 2,
      attendance: values.attendance[0],
      date_taken: new Date(values.date_taken.toString()),
      review: values.review || null,
    };

    reviewMutation.mutate(review);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ReviewPromptButton edit={edit} auth={!!auth} onClick={() => setOpen(true)} />
      </DialogTrigger>
      <DialogContent className="light text-primary sm:max-w-[900px] max-h-[100vh]">
        <Form {...reviewForm}>
          <form
            onSubmit={reviewForm.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col"
            noValidate
          >
            <DialogHeader>
              <DialogTitle className="md:text-2xl">
                Review{" "}
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-blue-400 py-1">
                  {courseCode}
                </span>
              </DialogTitle>
              <DialogDescription className="flex flex-col">
                <>
                  <p>
                    You&apos;re rating and an (optional) written review for the course. You can even
                    edit the review later!
                  </p>
                  <Button
                    variant="link"
                    className="py-3 h-2 text-blue-500 self-end space-x-1"
                    asChild
                  >
                    <span>
                      <Lock width={15} />
                      <Link href="/privacy-policy">See our privacy policy</Link>
                    </span>
                  </Button>
                </>
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="ratings" className="w-full">
              <TabsList className="w-full flex">
                <TabsTrigger value="ratings" className="flex-1">
                  Ratings *
                </TabsTrigger>
                <TabsTrigger value="review" className="flex-1">
                  Review (Optional)
                </TabsTrigger>
              </TabsList>
              <TabsContent value="ratings" className="relative">
                <ScrollArea
                  className="h-[300px] sm:h-[400px] md:h-[350px] lg:h-[400px] px-2"
                  type="always"
                >
                  <div className="flex flex-col gap-4 md:gap-8">
                    <div className="flex flex-col md:flex-row gap-4 justify-between pt-1 md:pt-4 px-1">
                      <FormField
                        control={reviewForm.control}
                        name="liked"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start">
                            <FormLabel>Liked</FormLabel>
                            <FormDescription>Overall, did you like the course?</FormDescription>

                            <FormControl>
                              <div className="flex gap-2">
                                <Toggle
                                  pressed={field.value as boolean}
                                  onPressedChange={() => field.onChange(true)}
                                >
                                  <ThumbsUp />
                                </Toggle>
                                <Toggle
                                  pressed={!field.value}
                                  onPressedChange={() => field.onChange(false)}
                                >
                                  <ThumbsDown />
                                </Toggle>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={reviewForm.control}
                        name="date_taken"
                        render={({ field }) => (
                          <FormItem className="flex-1 flex flex-col items-start">
                            <FormLabel>Year Taken</FormLabel>
                            <FormDescription>When did you take it?</FormDescription>

                            <FormControl className="place-items-center">
                              <div className="flex-1 flex-grow w-full px-1 md:px-0">
                                <Input
                                  type="number"
                                  min={2010}
                                  max={new Date().getFullYear()}
                                  step={1}
                                  value={field?.value}
                                  onChange={(e) => {
                                    if (e.target.value) field.onChange(+e.target.value);
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={reviewForm.control}
                        name="term_taken"
                        render={({ field }) => (
                          <FormItem className="flex-1 flex flex-col items-start">
                            <FormLabel>Term Taken</FormLabel>
                            <FormDescription>Which semester/term?</FormDescription>
                            <FormControl className="place-items-center">
                              <div className="flex-1 flex-grow w-full px-1 md:px-0">
                                <Select
                                  value={field.value}
                                  onValueChange={(value) => {
                                    field.onChange(value as Terms);
                                    console.log("combobox value:", value);
                                  }}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Term" />
                                  </SelectTrigger>
                                  <SelectContent className="light">
                                    {Object.values(Terms).map((option, index) => (
                                      <SelectItem key={index} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={reviewForm.control}
                      name="professor_id"
                      render={({ field, formState }) => (
                        <FormItem className="flex flex-col items-start px-1">
                          <FormLabel>Professor</FormLabel>
                          <FormDescription>
                            What&apos;s the name of the course instructor you had?
                          </FormDescription>
                          <FormControl className="place-items-center">
                            <div className="flex-1 flex-grow w-full">
                              <ProfessorCombobox
                                value={{
                                  id: reviewForm.getValues().professor_id,
                                  name: reviewForm.getValues().professor_name,
                                }}
                                onChangeProfessor={(prof) => {
                                  reviewForm.setValue("professor_id", prof.id);
                                  reviewForm.setValue("professor_name", prof.name);
                                }}
                                placeholder="Select a prof"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex-1 flex-grow flex flex-col md:flex-row gap-4 md:items-start px-1 pb-3">
                      <FormField
                        control={reviewForm.control}
                        name="difficulty"
                        render={({ field }) => (
                          <FormItem className="flex-1 flex-grow flex flex-col">
                            <FormLabel>Difficulty (0-5)</FormLabel>
                            <FormDescription className="flex-1">
                              How difficult was the course?
                            </FormDescription>
                            <FormControl>
                              <Slider
                                min={0}
                                max={5}
                                step={0.5}
                                value={field.value}
                                onValueChange={field.onChange}
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={reviewForm.control}
                        name="useful"
                        render={({ field }) => (
                          <FormItem className="flex-1 flex flex-col">
                            <FormLabel>Useful (0-5)</FormLabel>
                            <FormDescription>How useful was the course?</FormDescription>
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
                          <FormItem className="flex-1 flex flex-col">
                            <FormLabel>Attendance (0-100%)</FormLabel>
                            <FormDescription>% Attended/watched lectures?</FormDescription>
                            <FormControl>
                              <Slider
                                min={0}
                                max={100}
                                step={10}
                                value={field.value}
                                onValueChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="review" className="px-2">
                <FormField
                  control={reviewForm.control}
                  name="review"
                  render={({ field }) => (
                    <FormItem className="h-[300px] sm:h-[400px] md:h-[350px] lg:h-[400px] px-2 py-2 md:py-4 md:pt-7">
                      <FormLabel>Written Review ({field.value?.length || 0} characters)</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={9} />
                      </FormControl>
                      <FormDescription>
                        What else would you like to share about the course (30-800 characters)?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <Separator className="m-0 my-0" />

            <DialogFooter className="flex flex-row items-center py-0">
              <FormField
                control={reviewForm.control}
                name="anon"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-center">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(!!checked)}
                          className="data-[state=checked]:bg-destructive border-destructive"
                        />
                      </FormControl>
                      <FormLabel>Stay Anonymous</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {reviewMutation.isLoading && <Spinner text="Loading submission..." />}
              <Button type="submit" variant="gradient">
                {edit ? "Edit" : "Submit"} Review
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewPrompt;
