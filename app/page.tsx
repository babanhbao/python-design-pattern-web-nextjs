import { redirect } from "next/navigation";
import { problemLessons } from "../lib/problem-slides";

export default function Home() {
  const firstLessonId = problemLessons[0]?.id;
  if (firstLessonId) {
    redirect(`/problems/${firstLessonId}`);
  }

  return null;
}
