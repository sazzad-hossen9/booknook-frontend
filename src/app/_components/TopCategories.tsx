import Link from "next/link";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { BookOpen, FlaskConical, Landmark, Smile, Star } from "lucide-react";

const categories = [
  {
    name: "Fiction",
    image: "/images/category-fiction.jpg",
    icon: BookOpen,
    iconColor: "text-[#E0A526]",
  },
  {
    name: "Science",
    image: "/images/category-science.jpg",
    icon: FlaskConical,
    iconColor: "text-[#4FB39F]",
  },
  {
    name: "History",
    image: "/images/category-history.jpg",
    icon: Landmark,
    iconColor: "text-[#F2C45A]",
  },
  {
    name: "Kids",
    image: "/images/category-kids.jpg",
    icon: Smile,
    iconColor: "text-[#F07575]",
  },
  {
    name: "Others",
    image: "/images/category-others.jpg",
    icon: Star,
    iconColor: "text-[#E0A526]",
  },
];

/**
 * Top Categories section allowing users to quickly filter by popular genres.
 * Designed with horizontal aspect ratio and vibrant genre-specific ambient glow.
 */
export function TopCategories() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 py-16">
      <SectionHeading
        title="Top Categories"
        subtitle="Find books in your favourite categories."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5 w-full">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              href={`/books?category=${encodeURIComponent(cat.name)}`}
              className="group relative flex h-[120px] sm:h-[135px] w-full flex-col items-center justify-center overflow-hidden rounded-[16px] border border-[#E0A526]/30 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E0A526] hover:shadow-xl"
            >
              {/* Background artwork */}
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Dark ambient overlay for maximum readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25 transition-opacity group-hover:opacity-75" />

              {/* Icon & Title */}
              <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                <div className={`transition-transform duration-300 group-hover:scale-110 ${cat.iconColor}`}>
                  <Icon className="h-7 w-7 drop-shadow-md stroke-[2.2]" />
                </div>
                <span className="font-serif text-base sm:text-lg font-bold text-[#F3EFE6] tracking-wide drop-shadow-md">
                  {cat.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
