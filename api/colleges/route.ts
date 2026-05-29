import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getFallbackColleges } from "../../../lib/fallbackData";

function getCategoryFilter(category: string) {
  if (category === "iit") {
    return { name: { startsWith: "IIT", mode: "insensitive" } };
  }
  if (category === "nit") {
    return { name: { contains: "NIT", mode: "insensitive" } };
  }
  if (category === "iiit") {
    return { name: { contains: "IIIT", mode: "insensitive" } };
  }
  if (category === "private") {
    return {
      OR: [
        { name: { contains: "BITS", mode: "insensitive" } },
        { name: { contains: "VIT", mode: "insensitive" } },
        { name: { contains: "SRM", mode: "insensitive" } },
        { name: { contains: "Amrita", mode: "insensitive" } },
        { name: { contains: "Manipal", mode: "insensitive" } }
      ]
    };
  }

  return undefined;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim();
  const category = url.searchParams.get("category")?.trim();
  const eamcetRank = Number(url.searchParams.get("eamcetRank") ?? "0");
  const minRating = Number(url.searchParams.get("minRating") ?? "0");
  const maxFees = Number(url.searchParams.get("maxFees") ?? "0");
  const course = url.searchParams.get("course")?.trim();
  const sort = url.searchParams.get("sort") ?? "ratingDesc";

  const filter: any = {};

  if (query) {
    filter.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { location: { contains: query, mode: "insensitive" } },
      { overview: { contains: query, mode: "insensitive" } }
    ];
  }

  if (course) {
    filter.courses = { has: course };
  }

  if (minRating > 0) {
    filter.rating = { gte: minRating };
  }

  if (maxFees > 0) {
    filter.fees = { lte: maxFees };
  }

  if (eamcetRank > 0) {
    filter.rankCutoff = { gte: eamcetRank };
  }

  const categoryFilter = category ? getCategoryFilter(category) : undefined;
  if (categoryFilter) {
    filter.AND = (filter.AND ?? []).concat(categoryFilter);
  }

  const orderBy = [] as Array<{ [key: string]: "asc" | "desc" }>;

  if (sort === "ratingAsc") {
    orderBy.push({ rating: "asc" });
  } else if (sort === "feesAsc") {
    orderBy.push({ fees: "asc" });
  } else if (sort === "feesDesc") {
    orderBy.push({ fees: "desc" });
  } else {
    orderBy.push({ rating: "desc" });
  }

  if (prisma) {
    const colleges = await prisma.college.findMany({
      where: filter,
      orderBy,
      take: 50
    });
    return NextResponse.json({ colleges });
  }

  const colleges = getFallbackColleges().filter((college) => {
    const matchesQuery = query
      ? [college.name, college.location, college.overview].some((field) =>
          field.toLowerCase().includes(query.toLowerCase())
        )
      : true;
    const matchesCourse = course ? college.courses.includes(course) : true;
    const matchesRating = minRating > 0 ? college.rating >= minRating : true;
    const matchesFees = maxFees > 0 ? college.fees <= maxFees : true;
    const matchesRank = eamcetRank > 0 ? (college.rankCutoff ?? 0) >= eamcetRank : true;
    const matchesCategory = category
      ? category === "iit"
        ? college.name.toLowerCase().startsWith("iit")
        : category === "nit"
        ? college.name.toLowerCase().includes("nit")
        : category === "iiit"
        ? college.name.toLowerCase().includes("iiit")
        : category === "private"
        ? ["bits", "vit", "srm", "amrita", "manipal"].some((key) => college.name.toLowerCase().includes(key))
        : true
      : true;
    return matchesQuery && matchesCourse && matchesRating && matchesFees && matchesRank && matchesCategory;
  });

  const sorted = colleges.sort((a, b) => {
    if (sort === "ratingAsc") return a.rating - b.rating;
    if (sort === "feesAsc") return a.fees - b.fees;
    if (sort === "feesDesc") return b.fees - a.fees;
    return b.rating - a.rating;
  });

  return NextResponse.json({ colleges: sorted.slice(0, 50) });
}
