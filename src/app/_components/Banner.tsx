"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { BookOpen, ArrowRight } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    image: "/images/hero-1.jpg",
    titlePrefix: "Make room for more ",
    titleHighlight: "stories.",
    description:
      "Discover, borrow and enjoy your favourite books from our warm community library lounge.",
    btnText: "Browse Books",
    href: "/books",
  },
  {
    id: 2,
    image: "/images/hero-2.jpg",
    titlePrefix: "Find your quiet corner with a ",
    titleHighlight: "great read.",
    description:
      "Curl up with timeless classics and contemporary bestsellers curated especially for you.",
    btnText: "Explore Collection",
    href: "/books",
  },
  {
    id: 3,
    image: "/images/hero-3.jpg",
    titlePrefix: "A world of knowledge on our ",
    titleHighlight: "open shelves.",
    description:
      "Borrow seamlessly, share your favorite books, and foster a vibrant reading habit today.",
    btnText: "Join Community",
    href: "/books",
  },
];

/**
 * Hero Banner with Swiper slider, ambient overlays, typography and gold action pill.
 */
export function Banner() {
  return (
    <section className="relative mx-auto mt-6 max-w-[1200px] overflow-hidden rounded-[24px] shadow-xl">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="h-[440px] sm:h-[500px] md:h-[540px] w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative h-full w-full">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt="BookNook Hero"
                fill
                priority
                className="object-cover object-center"
              />
              {/* Warm dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F1420]/95 via-[#0F1420]/80 to-transparent sm:w-4/5 md:w-3/5" />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Slide Content */}
            <div className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-12 md:px-16 max-w-2xl">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-[56px] font-bold leading-[1.15] text-[#F3EFE6] drop-shadow-sm">
                {slide.titlePrefix}
                <span className="text-[#E0A526]">{slide.titleHighlight}</span>
              </h1>

              <p className="mt-4 text-base sm:text-lg text-[#F3EFE6]/80 leading-relaxed max-w-lg">
                {slide.description}
              </p>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  href={slide.href}
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#E0A526] px-6 py-3.5 text-sm sm:text-base font-semibold text-[#1F2A44] shadow-lg transition-all duration-300 hover:bg-[#F2C45A] hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <BookOpen className="h-4 w-4 stroke-[2.5]" />
                  <span>{slide.btnText}</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

