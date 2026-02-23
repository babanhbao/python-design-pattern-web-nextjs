import { notFound } from "next/navigation";
import ProblemSlideDeck from "../../../components/problem-slide-deck";
import { problemLessons } from "../../../lib/problem-slides";

type ProblemPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
};

export function generateStaticParams() {
  return problemLessons.map((lesson) => ({ id: lesson.id }));
}

export default async function ProblemPage({ params, searchParams }: ProblemPageProps) {
  const { id } = await params;
  const { lang } = await searchParams;
  const lesson = problemLessons.find((item) => item.id === id);

  if (!lesson) {
    notFound();
  }

  return <ProblemSlideDeck initialLang={lang === "vi" ? "vi" : "en"} lessonId={id} />;
}
