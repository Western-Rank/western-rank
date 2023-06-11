import { Course, Course_Review, Term as Terms, type Term } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";

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
import { Checkbox } from "@/components//ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Combobox } from "@/components/ui/combobox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface ReviewPromptProps {
  courseCode: Course["course_code"];
  hasReviewed?: boolean;
}

const reviewFormSchema = z.object({
  professor: z.string(),
  review: z.string().optional(),
  liked: z.boolean(),
  difficulty: z.array(z.number().min(0).max(5)),
  enthusiasm: z.array(z.number().min(0).max(5)),
  attendance: z.array(z.number().min(0).max(100)),
  anon: z.boolean(),
  date_taken: z.number().min(2010).max(new Date().getFullYear()),
  term_taken: z.nativeEnum(Terms),
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
      date_taken: new Date().getFullYear(),
      term_taken: "Fall",
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
        title: `Your ${hasReviewed ? "Edited" : ""} ${courseCode} Review was submitted!`,
        description: "You can edit it at any time after signing in.",
      });
    }, 50);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={!auth}
          onClick={() => setOpen(true)}
          variant="gradient"
          className="w-full sm:w-fit"
        >
          {reviewButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="light text-primary sm:max-w-[900px] max-h-[100vh]">
        <Form {...reviewForm}>
          <form onSubmit={reviewForm.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
            <DialogHeader>
              <DialogTitle className="md:text-2xl">
                Review{" "}
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-blue-400 py-1">
                  {courseCode}
                </span>
              </DialogTitle>
              <DialogDescription>
                You&apos;re rating and an (optional) written review for the course. You can even
                edit the review later!
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
                  className="h-[300px] sm:h-[400px] md:h-[350px] lg:h-[400px] px-2 shadow-inner"
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
                                  value={+field?.value}
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
                                <Combobox
                                  id="program"
                                  placeholder="Select a term..."
                                  options={Object.keys(Terms).map((term) => ({
                                    label: term[0].toUpperCase() + term.slice(1),
                                    value: term[0].toUpperCase() + term.slice(1),
                                  }))}
                                  value={field.value}
                                  onChangeValue={(value) => {
                                    field.onChange(value);
                                    console.log("combobox value:", value);
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={reviewForm.control}
                      name="professor"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start px-1">
                          <FormLabel>Professor</FormLabel>
                          <FormDescription>
                            What&apos;s the name of the course instructor you had?
                          </FormDescription>
                          <FormControl className="place-items-center">
                            <div className="flex-1 flex-grow w-full">
                              <Input
                                placeholder="Name"
                                value={field.value}
                                onChange={field.onChange}
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
                        name="enthusiasm"
                        render={({ field }) => (
                          <FormItem className="flex-1 flex flex-col">
                            <FormLabel>Enthusiasm (0-5)</FormLabel>
                            <FormDescription>How exciting was the course?</FormDescription>
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
                      <FormLabel>Written Review</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={9} />
                      </FormControl>
                      <FormDescription>
                        What else would you like to share about the course (15-300 words )?
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
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-destructive border-destructive"
                        />
                      </FormControl>
                      <FormLabel>Stay Anonymous</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" variant="gradient">
                Submit Review
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewPrompt;
