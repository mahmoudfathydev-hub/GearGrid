import Link from "next/link";
import { usePathname } from "next/navigation";

interface LinkItem {
  id: number;
  name: string;
  href: string;
}

interface NavigationLinksProps {
  links: LinkItem[];
  isMobile?: boolean;
}

export const NavigationLinks = ({
  links,
  isMobile = false,
}: NavigationLinksProps) => {
  const pathname = usePathname();

  return (
    <nav
      role="navigation"
      className={
        isMobile ? "space-y-1 sm:px-3" : "flex items-baseline space-x-4 ml-10"
      }
    >
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.id}
            href={link.href}
            className={`
              block px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative
              hover:bg-gray-100 dark:hover:bg-white/10 
              ${
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }
              ${isMobile ? "text-base" : ""}
            `}
          >
            {link.name}
            {isActive && !isMobile && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};
