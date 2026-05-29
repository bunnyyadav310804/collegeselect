let prisma: any = undefined;
try {
  prisma = (await import("../../../lib/prisma")).prisma;
} catch {}
import { getFallbackCollege, CollegeItem } from "../../../lib/fallbackData";
import Link from "next/link";

interface CollegePageProps {
  params: {
    id: string;
  };
}

type College = CollegeItem & {
  id: string;
};

async function getCollege(id: string): Promise<College | null> {
  if (!prisma) {
    return getFallbackCollege(id);
  }

  return prisma.college.findUnique({
    where: { id }
  });
}

export default async function CollegePage({ params }: CollegePageProps) {
  const college = await getCollege(params.id);

  if (!college) {
    return (
      <main className="min-h-screen px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-sm shadow-slate-200">
          <h1 className="text-3xl font-semibold text-slate-900">College not found</h1>
          <p className="mt-4 text-slate-600">The requested college could not be found. Try returning to the homepage.</p>
          <Link href="/" className="mt-6 inline-flex rounded-2xl bg-sky-600 px-4 py-3 text-white hover:bg-sky-700">
            Back to search
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm shadow-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">College details</p>
              <h1 className="mt-2 text-4xl font-semibold text-slate-900">{college.name}</h1>
              <p className="mt-3 text-slate-600">{college.location}</p>
            </div>
            <div className="flex flex-col items-start gap-3 text-right sm:items-end">
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                Rating {college.rating.toFixed(1)}
              </span>
              {college.rankCutoff ? (
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                  EAMCET cutoff: {college.rankCutoff.toLocaleString()}
                </span>
              ) : null}
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-6">
              <h2 className="text-sm uppercase tracking-[0.25em] text-slate-500">Fees</h2>
              <p className="mt-4 text-3xl font-semibold text-slate-900">₹{college.fees.toLocaleString()}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <h2 className="text-sm uppercase tracking-[0.25em] text-slate-500">Overview</h2>
              <p className="mt-4 text-slate-700">{college.overview}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl bg-white p-8 shadow-sm shadow-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Courses offered</h2>
            <ul className="mt-5 space-y-3">
              {college.courses.map((course) => (
                <li key={course} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                  {course}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-3xl bg-white p-8 shadow-sm shadow-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Next steps</h2>
            <p className="mt-4 text-slate-600">Save this college, compare it with others, or reach out to ask questions about admissions and fees.</p>
            <Link href="/" className="mt-6 inline-flex rounded-2xl bg-sky-600 px-4 py-3 text-white hover:bg-sky-700">
              Back to search
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
