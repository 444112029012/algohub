import { notFound } from "next/navigation";
import { Lesson } from "@/components/lesson";
import { algorithms, getAlgorithm } from "@/data";

export function generateStaticParams() {
  return algorithms.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getAlgorithm(slug);
  if (!a) return { title: "找不到教材" };
  return {
    title: `${a.name} ${a.english}`,
    description: a.summary,
  };
}

export default async function AlgorithmPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const algorithm = getAlgorithm(slug);
  if (!algorithm) notFound();
  return <Lesson algorithm={algorithm} />;
}
