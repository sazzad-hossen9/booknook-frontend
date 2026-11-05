import { Banner } from "./_components/Banner";
import { NewArrivals } from "./_components/NewArrivals";
import { HowItWorks } from "./_components/HowItWorks";
import { TopCategories } from "./_components/TopCategories";

export const metadata = {
  title: "BookNook | Home - Cozy Modern Reading Lounge",
  description:
    "Explore our collection of amazing books, borrow effortlessly, and share your favorite stories.",
};

/**
 * Home page with Hero slider, New arrivals, Borrowing guide, and Top categories.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 sm:gap-10">
      <Banner />
      <NewArrivals />
      <HowItWorks />
      <TopCategories />
    </div>
  );
}
