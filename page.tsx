"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { CollegeItem } from "../lib/fallbackData";

const sortOptions = [
  { value: "ratingDesc", label: "Best rating" },
  { value: "ratingAsc", label: "Lowest rating" },
  { value: "feesAsc", label: "Lowest fees" },
  { value: "feesDesc", label: "Highest fees" }
];

const courseOptions = [
  "Computer Science",
  "Data Science",
  "AI & ML",
  "Business Analytics",
  "Civil Engineering",
  "Electrical Engineering",
  "Information Technology",
  "Cyber Security"
];

const categoryOptions = [
  { value: "iit", label: "IIT" },
  { value: "nit", label: "NIT" },
  { value: "iiit", label: "IIIT" },
  { value: "private", label: "Private" }
];

const defaultMaxFees = 1000000;

type College = CollegeItem & {
  id: string;
  rankCutoff?: number;
};

function readList(key: string) {
  if (typeof window === "undefined") return [] as string[];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeList(key: string, items: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(items));
}

export default function HomePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [maxFees, setMaxFees] = useState(defaultMaxFees);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [eamcetRank, setEamcetRank] = useState(0);
  const [sort, setSort] = useState("ratingDesc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const compareItems = useMemo(
    () => colleges.filter((college) => compareIds.includes(college.id)),
    [colleges, compareIds]
  );

  const savedItems = useMemo(
    () => colleges.filter((college) => savedIds.includes(college.id)),
    [colleges, savedIds]
  );

  const eligibleColleges = useMemo(
    () =>
      eamcetRank > 0
        ? colleges.filter((college) => (college.rankCutoff ?? 0) >= eamcetRank)
        : [],
    [colleges, eamcetRank]
  );

  const filteredColleges = useMemo(() => {
    if (!selectedCategory) return colleges;
    return colleges.filter((college) => {
      const lowerName = college.name.toLowerCase();
      if (selectedCategory === "iit") return lowerName.startsWith("iit");
      if (selectedCategory === "nit") return lowerName.includes("nit");
      if (selectedCategory === "iiit") return lowerName.includes("iiit");
      if (selectedCategory === "private") return ["bits", "vit", "srm", "amrita", "manipal"].some((key) => lowerName.includes(key));
      return true;
    });
  }, [colleges, selectedCategory]);

  useEffect(() => {
    setSavedIds(readList("savedColleges"));
    setCompareIds(readList("compareColleges").slice(0, 3));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (search) params.set("q", search);
        if (selectedCategory) params.set("category", selectedCategory);
        if (eamcetRank > 0) params.set("eamcetRank", String(eamcetRank));
        if (minRating > 0) params.set("minRating", String(minRating));
        if (selectedCourse) params.set("course", selectedCourse);
        if (sort) params.set("sort", sort);
        if (maxFees > 0) params.set("maxFees", String(maxFees));

        const response = await fetch(`/api/colleges?${params.toString()}`, {
          signal: controller.signal
        });
        if (!response.ok) {
          throw new Error("Unable to load colleges.");
        }
        const data = await response.json();
        setColleges(data.colleges);
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          setError((err as Error).message || "Server error.");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [search, selectedCategory, eamcetRank, minRating, maxFees, selectedCourse, sort]);

  const handleToggleSave = (id: string) => {
    const next = savedIds.includes(id)
      ? savedIds.filter((value) => value !== id)
      : [...savedIds, id];
    setSavedIds(next);
    writeList("savedColleges", next);
  };

  const handleToggleCompare = (id: string) => {
    const next = compareIds.includes(id)
      ? compareIds.filter((value) => value !== id)
      : compareIds.length < 3
      ? [...compareIds, id]
      : compareIds;
    setCompareIds(next);
    writeList("compareColleges", next);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setEamcetRank(0);
    setMinRating(0);
    setMaxFees(defaultMaxFees);
    setSelectedCourse("");
    setSort("ratingDesc");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm shadow-slate-200">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">College discovery</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Compare colleges, filter by course, fees, rating, and save your favorites.
              </h1>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-slate-700 shadow-inner shadow-slate-100">
              16 colleges · search · filters · compare · saved list · responsive UX
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Search colleges</span>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name, city, course or feature"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">EAMCET rank</span>
                  <input
                    type="number"
                    min={1}
                    value={eamcetRank > 0 ? eamcetRank : ""}
                    onChange={(event) => setEamcetRank(Number(event.target.value))}
                    placeholder="Enter your rank"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Sort by</span>
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Minimum rating</span>
                  <select
                    value={minRating}
                    onChange={(event) => setMinRating(Number(event.target.value))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                  >
                    <option value={0}>Any rating</option>
                    <option value={3}>3.0+</option>
                    <option value={3.5}>3.5+</option>
                    <option value={4}>4.0+</option>
                    <option value={4.2}>4.2+</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Maximum fees</span>
                  <input
                    type="range"
                    min={200000}
                    max={1000000}
                    step={50000}
                    value={maxFees}
                    onChange={(event) => setMaxFees(Number(event.target.value))}
                    className="w-full"
                  />
                  <div className="text-sm text-slate-600">Up to ₹{maxFees.toLocaleString()}</div>
                </label>
              </div>

              <div className="mt-6">
                <div className="mb-3 text-sm font-medium text-slate-700">Top BTech categories</div>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((category) => {
                    const active = selectedCategory === category.value;
                    return (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => setSelectedCategory(active ? "" : category.value)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          active
                            ? "border-sky-600 bg-sky-600 text-white"
                            : "border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-400"
                        }`}
                      >
                        {category.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-3 text-sm font-medium text-slate-700">Focus on course</div>
                <div className="flex flex-wrap gap-2">
                  {courseOptions.map((course) => {
                    const active = selectedCourse === course;
                    return (
                      <button
                        key={course}
                        type="button"
                        onClick={() => setSelectedCourse(active ? "" : course)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          active
                            ? "border-sky-600 bg-sky-600 text-white"
                            : "border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-400"
                        }`}
                      >
                        {course}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Clear filters
                </button>
                <span className="text-sm text-slate-600">
                  {filteredColleges.length} colleges matched
                </span>
                {selectedCategory && (
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-700">
                    Category: {categoryOptions.find((option) => option.value === selectedCategory)?.label}
                  </span>
                )}
                {selectedCourse && (
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-700">
                    Course: {selectedCourse}
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Saved colleges</h2>
              <p className="mt-2 text-sm text-slate-600">Keep track of the colleges you're most interested in.</p>
              <div className="mt-4 space-y-3">
                {savedItems.length > 0 ? (
                  savedItems.map((college) => (
                    <div key={college.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{college.name}</p>
                          <p className="text-sm text-slate-600">{college.location}</p>
                        </div>
                        <button
                          onClick={() => handleToggleSave(college.id)}
                          className="text-sm font-semibold text-sky-600 hover:text-sky-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No saved colleges yet. Use the heart icon to save one.</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Compare colleges</h2>
              <p className="mt-2 text-sm text-slate-600">Select up to 3 colleges and compare them side by side.</p>
              <div className="mt-4 space-y-3">
                {compareItems.length > 0 ? (
                  compareItems.map((college) => (
                    <div key={college.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <p className="font-semibold text-slate-900">{college.name}</p>
                      <p className="text-sm text-slate-600">Rating {college.rating.toFixed(1)} · ₹{college.fees.toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Pick colleges from the main list to compare.</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Results</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Available colleges</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                {loading ? "Loading..." : `${filteredColleges.length} results`}
              </span>
            </div>

            {eamcetRank > 0 && (
              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">Eligible colleges for EAMCET rank {eamcetRank.toLocaleString()}</p>
                {eligibleColleges.length > 0 ? (
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {eligibleColleges.slice(0, 6).map((college) => (
                      <li key={college.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                        <p className="font-semibold text-slate-900">{college.name}</p>
                        <p className="text-sm text-slate-600">{college.location}</p>
                        <p className="mt-2 text-sm text-slate-700">Courses: {college.courses.slice(0, 3).join(", ")}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-slate-600">No colleges match your EAMCET rank yet. Try a higher rank or clear filters.</p>
                )}
              </div>
            )}

            <div className="mt-6">
              {error ? (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
                  {error}
                </div>
              ) : filteredColleges.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
                  No colleges matched your filters.
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredColleges.map((college) => {
                    const saved = savedIds.includes(college.id);
                    const comparing = compareIds.includes(college.id);
                    return (
                      <article key={college.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="p-6">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                              <p className="text-sm font-medium text-slate-600">{college.location}</p>
                              <h3 className="mt-2 text-2xl font-semibold text-slate-900">{college.name}</h3>
                              <p className="mt-3 text-sm leading-6 text-slate-600">{college.overview}</p>
                            </div>
                            <div className="flex flex-col items-start gap-3 text-right md:items-end">
                              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                                {college.rating.toFixed(1)} ★
                              </span>
                              <span className="text-lg font-semibold text-slate-900">₹{college.fees.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="mt-5 flex flex-wrap items-center gap-2">
                            {college.courses.slice(0, 3).map((course) => (
                              <span key={course} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-slate-200 bg-slate-50 p-4 sm:flex sm:items-center sm:justify-between">
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => handleToggleSave(college.id)}
                              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                                saved ? "bg-slate-900 text-white" : "bg-white text-slate-900 border border-slate-300 hover:bg-slate-100"
                              }`}
                            >
                              {saved ? "Saved" : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleCompare(college.id)}
                              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                                comparing ? "bg-sky-600 text-white" : "bg-white text-slate-900 border border-slate-300 hover:bg-slate-100"
                              }`}
                            >
                              {comparing ? "Comparing" : "Compare"}
                            </button>
                          </div>
                          <Link href={`/college/${college.id}`} className="mt-3 inline-flex rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 sm:mt-0">
                            View details
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
