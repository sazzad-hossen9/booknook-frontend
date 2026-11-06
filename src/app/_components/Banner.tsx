"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
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
 * Responsive Hero Banner with Swiper slider, ambient overlays, typography and gold action pill.
 * Fades in and slides up on page load (Hero animation specification).
 * Smooth crossfade slide transitions with pauseOnMouseEnter to prevent jumpy auto-reloading sensations.
 */
export function Banner() {
  return (
    <section className="relative mx-auto mt-4 sm:mt-6 w-full max-w-[1200px] px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full overflow-hidden rounded-[20px] sm:rounded-[24px] shadow-xl border border-border/40"
      >
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={800}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          loop={true}
          className="h-[390px] sm:h-[480px] md:h-[520px] lg:h-[540px] w-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="relative h-full w-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt="BookNook Hero"
                  fill
                  priority={slide.id === 1}
                  className="object-cover object-center"
                />
                {/* Mobile overlay: covers entire slide for high contrast & perfect readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1420]/95 via-[#0F1420]/80 to-[#0F1420]/50 sm:hidden" />
                {/* Tablet & Desktop overlay: warm dark gradient fading to the right */}
                <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-[#0F1420]/95 via-[#0F1420]/85 to-transparent sm:w-4/5 md:w-3/5" />
                <div className="absolute inset-0 bg-black/25" />
              </div>

              {/* Slide Content */}
              <div className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-12 md:px-16 max-w-2xl pb-10 sm:pb-0">
                {/* Community lounge badge */}
                <div className="mb-2 sm:mb-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E0A526]/20 border border-[#E0A526]/40 px-3 py-1 text-[11px] sm:text-xs font-semibold text-[#F2C45A] tracking-wider uppercase backdrop-blur-xs">
                    <BookOpen className="h-3 w-3" />
                    <span>Community Lounge</span>
                  </span>
                </div>

                <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold leading-tight sm:leading-[1.15] text-[#F3EFE6] drop-shadow-md">
                  {slide.titlePrefix}
                  <span className="text-[#E0A526]">{slide.titleHighlight}</span>
                </h1>

                <p className="mt-2.5 sm:mt-4 text-xs sm:text-base md:text-lg text-[#F3EFE6]/85 leading-relaxed max-w-lg line-clamp-3 sm:line-clamp-none">
                  {slide.description}
                </p>

                <div className="mt-5 sm:mt-8 flex items-center gap-3 sm:gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block"
                  >
                    <Link
                      href={slide.href}
                      className="inline-flex items-center gap-2 sm:gap-2.5 rounded-full bg-[#E0A526] px-5 py-2.5 sm:px-6 sm:py-3.5 text-xs sm:text-sm md:text-base font-semibold text-[#1F2A44] shadow-lg transition-colors hover:bg-[#F2C45A] hover:shadow-xl active:scale-95"
                    >
                      <BookOpen className="h-4 w-4 stroke-[2.5]" />
                      <span>{slide.btnText}</span>
                      <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
}
