import { forwardRef, ReactNode } from "react";

interface HeroContentProps {
  title?: ReactNode;
  description?: string;
  children?: ReactNode;
}

export const HeroContent = forwardRef<HTMLDivElement, HeroContentProps>(
  ({ title, description, children }, ref) => {
    return (
      <div
        ref={ref}
        className="lg:w-full flex flex-col space-y-6 text-center lg:text-left"
      >
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white leading-none mb-4">
          {title || (
            <>
              <span className="block font-light mb-2">Power in</span>
              <span className="block font-black text-5xl sm:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 dark:from-cyan-300 dark:via-blue-400 dark:to-indigo-500 bg-clip-text text-transparent">
                Performance
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-light mt-4 text-gray-600 dark:text-gray-300 tracking-wide">
                Elegance in Design
              </span>
            </>
          )}
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0">
          {description ||
            "Discover unparalleled performance, sleek design, and cutting-edge automotive engineering engineered for the modern driver."}
        </p>
        {children}
      </div>
    );
  },
);

HeroContent.displayName = "HeroContent";
